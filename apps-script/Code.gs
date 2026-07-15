var CONFIG = {
  RSVP_SHEET: 'RSVP',
  SEATING_SHEET: 'Seating',
  MAX_BODY_LENGTH: 12000,
  LOCK_TIMEOUT_MS: 10000,
};

var RSVP_HEADERS = [
  'Timestamp',
  'Name',
  'Attendance',
  'Ceremony',
  'Photo session',
  'Guest count',
  'Drinks alcohol',
  'Alcohol preferences',
  'Alcohol other',
  'Dietary restrictions',
  'Comment',
];

function doGet() {
  return json_({ ok: true, service: 'wedding-invitation', version: 1 });
}

function doPost(event) {
  try {
    var body = event && event.postData && event.postData.contents;
    if (!body || body.length > CONFIG.MAX_BODY_LENGTH) {
      return json_({ ok: false, code: 'INVALID_BODY', message: 'Некорректный запрос.' });
    }

    var request = JSON.parse(body);
    if (!request || typeof request.action !== 'string' || !isPlainObject_(request.payload)) {
      return json_({ ok: false, code: 'INVALID_REQUEST', message: 'Некорректный формат запроса.' });
    }

    if (request.action === 'submitRsvp') return submitRsvp_(request.payload);
    if (request.action === 'lookupSeat') return lookupSeat_(request.payload);

    return json_({ ok: false, code: 'UNKNOWN_ACTION', message: 'Неизвестное действие.' });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, code: 'SERVER_ERROR', message: 'Сервис временно недоступен.' });
  }
}

function submitRsvp_(payload) {
  if (String(payload.website || '').trim()) {
    return json_({ ok: true });
  }

  var validation = validateRsvp_(payload);
  if (!validation.ok) return json_(validation);

  var properties = PropertiesService.getScriptProperties();
  var deadline = new Date(properties.getProperty('RSVP_DEADLINE') || '2026-08-10T23:59:59+05:00');
  if (new Date().getTime() > deadline.getTime()) {
    return json_({ ok: false, code: 'DEADLINE_PASSED', message: 'Срок подтверждения присутствия завершён.' });
  }

  var sheet = getSheet_(CONFIG.RSVP_SHEET, RSVP_HEADERS);
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(CONFIG.LOCK_TIMEOUT_MS)) {
    return json_({ ok: false, code: 'BUSY', message: 'Сервис занят. Попробуйте ещё раз.' });
  }

  try {
    var row = [
      new Date(),
      cleanText_(payload.name, 120),
      payload.attendance,
      payload.attendance === 'yes' ? payload.ceremony : '',
      payload.attendance === 'yes' ? payload.photoSession : '',
      payload.attendance === 'yes' ? Number(payload.guestCount) : '',
      payload.attendance === 'yes' ? payload.drinksAlcohol : '',
      payload.attendance === 'yes' && payload.drinksAlcohol === 'yes' ? payload.alcohol.join(', ') : '',
      payload.attendance === 'yes' && payload.drinksAlcohol === 'yes' ? cleanText_(payload.alcoholOther, 120) : '',
      payload.attendance === 'yes' ? cleanText_(payload.dietary, 500) : '',
      payload.attendance === 'yes' ? cleanText_(payload.comment, 1000) : '',
    ];
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

function lookupSeat_(payload) {
  var name = cleanText_(payload.name, 120);
  if (name.length < 3) {
    return json_({ ok: false, code: 'INVALID_NAME', message: 'Введите имя и фамилию.' });
  }

  var spreadsheet = openSpreadsheet_();
  var sheet = spreadsheet.getSheetByName(CONFIG.SEATING_SHEET);
  if (!sheet || sheet.getLastRow() < 2) {
    return json_({ ok: true, found: false });
  }

  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getDisplayValues();
  var key = normalizeName_(name);
  var match = rows.find(function (row) {
    return normalizeName_(row[0] || row[1]) === key;
  });

  if (!match) return json_({ ok: true, found: false });

  return json_({
    ok: true,
    found: true,
    guestName: cleanText_(match[1], 120),
    tableNumber: cleanText_(match[2], 20),
    note: cleanText_(match[3], 200),
  });
}

function validateRsvp_(payload) {
  var yesNo = ['yes', 'no'];
  var allowedAlcohol = ['Водка', 'Шампанское', 'Вино', 'Настойки', 'Ликёр'];
  var name = cleanText_(payload.name, 120);

  if (name.length < 2) return invalid_('name', 'Укажите имя и фамилию.');
  if (yesNo.indexOf(payload.attendance) === -1) return invalid_('attendance', 'Укажите, сможете ли вы присутствовать.');

  if (payload.attendance === 'yes') {
    if (yesNo.indexOf(payload.ceremony) === -1) return invalid_('ceremony', 'Укажите участие в церемонии.');
    if (yesNo.indexOf(payload.photoSession) === -1) return invalid_('photoSession', 'Укажите участие в фотосессии.');
    var guestCount = Number(payload.guestCount);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 4) return invalid_('guestCount', 'Укажите количество гостей.');
    if (yesNo.indexOf(payload.drinksAlcohol) === -1) return invalid_('drinksAlcohol', 'Укажите предпочтение по алкоголю.');
    if (!Array.isArray(payload.alcohol)) return invalid_('alcohol', 'Некорректный список напитков.');
    if (payload.alcohol.some(function (item) { return allowedAlcohol.indexOf(item) === -1; })) {
      return invalid_('alcohol', 'Некорректный вариант напитка.');
    }
  }

  return { ok: true };
}

function invalid_(field, message) {
  return { ok: false, code: 'VALIDATION_ERROR', field: field, message: message };
}

function getSheet_(name, headers) {
  var spreadsheet = openSpreadsheet_();
  var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function openSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('SPREADSHEET_ID is not configured');
  return SpreadsheetApp.openById(id);
}

function normalizeName_(value) {
  return cleanText_(value, 120).toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();
}

function cleanText_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function isPlainObject_(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
