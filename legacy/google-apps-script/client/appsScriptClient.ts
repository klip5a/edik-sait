export interface AppsScriptResponse {
  ok: boolean
  code?: string
  message?: string
  [key: string]: unknown
}

export async function callAppsScript(
  endpoint: string,
  action: 'submitRsvp' | 'lookupSeat',
  payload: Record<string, unknown>,
): Promise<AppsScriptResponse> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 12000)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('NETWORK_ERROR')

    const result = (await response.json()) as AppsScriptResponse
    if (!result || typeof result.ok !== 'boolean') throw new Error('INVALID_RESPONSE')
    return result
  } finally {
    window.clearTimeout(timeout)
  }
}
