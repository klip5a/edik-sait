import { useEffect, useRef, useState } from 'preact/hooks'

export interface SeatedGuest {
  id: number
  name: string
  tableNumber: number | null
  seatNumber: number | null
}

interface SeatingCanvasProps {
  guests: readonly SeatedGuest[]
  admin?: boolean
  selectedSeat?: { table: number; seat: number } | null
  onSeatSelect?: (table: number, seat: number) => void
}

interface SeatLayout {
  x: number
  y: number
  rotation: number
}

interface TableLayout {
  x: number
  y: number
  chairs: readonly SeatLayout[]
}

const WIDTH = 800
const HEIGHT = 650
const TABLE_RADIUS = 68

// Manual seating layout. Change x/y to move a table or chair.
// rotation:
// 0 = horizontal
// 90 = vertical
// 45 = diagonal
// -45 = diagonal to the other side
const TABLE_LAYOUTS: readonly TableLayout[] = [
  {
    x: 220,
    y: 235,
    chairs: [
      { x: 190, y: 150, rotation: -20 }, // table 1, chair 1
      { x: 139, y: 185, rotation: 120 }, // table 1, chair 2
      { x: 130, y: 250, rotation: 80 }, // table 1, chair 3
      { x: 160, y: 310, rotation: 40 }, // table 1, chair 4
      { x: 220, y: 325, rotation: 0 }, // table 1, chair 5
      { x: 280, y: 310, rotation: -40 }, // table 1, chair 6
    ],
  },
  {
    x: 580,
    y: 235,
    chairs: [
      { x: 620, y: 155, rotation: 25 }, // table 2, chair 1
      { x: 665, y: 200, rotation: 70 }, // table 2, chair 2
      { x: 670, y: 260, rotation: 110 }, // table 2, chair 3
      { x: 640, y: 310, rotation: 140 }, // table 2, chair 4
      { x: 580, y: 330, rotation: 0 }, // table 2, chair 5
      { x: 520, y: 310, rotation: 40 }, // table 2, chair 6
    ],
  },
  {
    x: 220,
    y: 470,
    chairs: [
      { x: 155, y: 400, rotation: 135 }, // table 3, chair 1
      { x: 130, y: 455, rotation: 99 }, // table 3, chair 2
      { x: 135, y: 510, rotation: 60 }, // table 3, chair 3
      { x: 180, y: 550, rotation: 27 }, // table 3, chair 4
      { x: 240, y: 555, rotation: -15 }, // table 3, chair 5
      { x: 295, y: 529, rotation: -50 }, // table 3, chair 6
    ],
  },
  {
    x: 580,
    y: 470,
    chairs: [
      { x: 650, y: 410, rotation: 45 }, // table 4, chair 1
      { x: 675, y: 470, rotation: 90 }, // table 4, chair 2
      { x: 660, y: 526, rotation: 130 }, // table 4, chair 3
      { x: 604, y: 560, rotation: 165 }, // table 4, chair 4
      { x: 540, y: 555, rotation: 30 }, // table 4, chair 5
      { x: 495, y: 510, rotation: 70 }, // table 4, chair 6
    ],
  },
] as const

const TABLES = TABLE_LAYOUTS.map(({ x, y }) => ({ x, y }))

function chairPosition(tableIndex: number, seatIndex: number) {
  return TABLE_LAYOUTS[tableIndex].chairs[seatIndex]
}

function toRadians(degrees: number) {
  return degrees * Math.PI / 180
}

function tableAtPoint(clientX: number, clientY: number, rect: DOMRect) {
  const x = (clientX - rect.left) * (WIDTH / rect.width)
  const y = (clientY - rect.top) * (HEIGHT / rect.height)

  for (let index = 0; index < TABLES.length; index += 1) {
    const table = TABLES[index]
    const distance = Math.hypot(x - table.x, y - table.y)
    if (distance <= TABLE_RADIUS) return index + 1
  }

  return null
}

export function SeatingCanvas({ guests, admin = false, selectedSeat, onSeatSelect }: SeatingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const [hoveredTable, setHoveredTable] = useState<number | null>(null)
  const [activeTable, setActiveTable] = useState<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return

    const draw = () => {
      const rect = host.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(rect.width * ratio))
      canvas.height = Math.max(1, Math.round(rect.width * HEIGHT / WIDTH * ratio))
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(canvas.width / WIDTH, canvas.height / HEIGHT)
      drawRoom(ctx, guests, hoveredTable ?? activeTable, selectedSeat)
    }

    const observer = new ResizeObserver(draw)
    observer.observe(host)
    draw()
    return () => observer.disconnect()
  }, [guests, hoveredTable, activeTable, selectedSeat])

  const shownTable = hoveredTable ?? activeTable
  const shownGuests = shownTable ? guests.filter((guest) => guest.tableNumber === shownTable) : []
  const canShowOverlay = Boolean(shownTable && shownGuests.length)

  const handlePointerMove = (event: MouseEvent | PointerEvent) => {
    const rect = hostRef.current?.getBoundingClientRect()
    if (!rect) return
    setHoveredTable(tableAtPoint(event.clientX, event.clientY, rect))
  }

  const handlePointerLeave = () => setHoveredTable(null)

  const handleTableClick = (event: MouseEvent) => {
    const rect = hostRef.current?.getBoundingClientRect()
    if (!rect) return
    const table = tableAtPoint(event.clientX, event.clientY, rect)
    if (!table) return
    setActiveTable(activeTable === table ? null : table)
  }

  return (
    <div
      ref={hostRef}
      class="relative mx-auto w-full max-w-[50rem] overflow-hidden rounded-3xl bg-[#f6f0e4] shadow-soft outline-1 -outline-offset-1 outline-black/10"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onClick={handleTableClick}
    >
      <canvas ref={canvasRef} class="block aspect-[800/650] w-full" aria-hidden="true" />

      {TABLES.map((table, tableIndex) => (
        <button
          type="button"
          class="sr-only"
          style={{ left: `${table.x / WIDTH * 100}%`, top: `${table.y / HEIGHT * 100}%` }}
          aria-label={`Стол ${tableIndex + 1}. ${guests.filter((guest) => guest.tableNumber === tableIndex + 1).map((guest) => guest.name).join(', ') || 'Гости не назначены'}`}
          onFocus={() => setHoveredTable(tableIndex + 1)}
          onBlur={() => setHoveredTable(null)}
          onClick={() => setActiveTable(activeTable === tableIndex + 1 ? null : tableIndex + 1)}
        >
          Стол {tableIndex + 1}
        </button>
      ))}

      {admin ? TABLES.flatMap((_, tableIndex) => Array.from({ length: 6 }, (_, seatIndex) => {
        const chair = chairPosition(tableIndex, seatIndex)
        const occupied = guests.some((guest) => guest.tableNumber === tableIndex + 1 && guest.seatNumber === seatIndex + 1)
        return (
          <button
            type="button"
            class={`absolute size-[7%] -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 transition-[transform,box-shadow] hover:scale-110 focus-visible:scale-110 focus-visible:outline-none ${occupied ? 'border-gold-deep bg-gold/35' : 'border-ink/25 bg-white/55'} ${selectedSeat?.table === tableIndex + 1 && selectedSeat.seat === seatIndex + 1 ? 'scale-110 shadow-[0_0_0_4px_rgb(156_108_38/0.35)]' : ''}`}
            style={{ left: `${chair.x / WIDTH * 100}%`, top: `${chair.y / HEIGHT * 100}%` }}
            aria-label={`Стол ${tableIndex + 1}, место ${seatIndex + 1}${occupied ? ', занято' : ', свободно'}`}
            onClick={() => onSeatSelect?.(tableIndex + 1, seatIndex + 1)}
            key={`${tableIndex}-${seatIndex}`}
          />
        )
      })) : null}

      {canShowOverlay ? (
        <div class="pointer-events-none absolute top-3 right-3 z-10 w-[min(15rem,52%)] rounded-2xl bg-white/95 p-3 text-left text-sm shadow-[0_12px_35px_rgb(67_58_51/0.18)] backdrop-blur-sm" role="status">
          <strong class="block text-base text-gold-deep">Стол {shownTable}</strong>
          <ul class="mt-1 mb-0 list-none p-0">
            {shownGuests
              .slice()
              .sort((left, right) => (left.seatNumber ?? 99) - (right.seatNumber ?? 99))
              .map((guest) => <li key={guest.id}>{guest.seatNumber}. {guest.name}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function drawRoom(
  ctx: CanvasRenderingContext2D,
  guests: readonly SeatedGuest[],
  highlightedTable: number | null,
  selectedSeat?: { table: number; seat: number } | null,
) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  gradient.addColorStop(0, '#fbf8f1')
  gradient.addColorStop(1, '#eee4d3')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.strokeStyle = 'rgba(91,76,58,.13)'
  ctx.lineWidth = 1
  for (let x = 40; x < WIDTH; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke() }
  for (let y = 35; y < HEIGHT; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke() }

  ctx.fillStyle = '#d8c5a5'
  roundedRect(ctx, 160, 22, 480, 72, 14); ctx.fill()
  ctx.fillStyle = '#5c4b3b'; ctx.font = '600 20px Georgia'; ctx.textAlign = 'center'; ctx.fillText('СЦЕНА', 400, 65)

  ctx.fillStyle = 'rgba(201,154,72,.10)'
  roundedRect(ctx, 80, 120, 640, 455, 30); ctx.fill()
  ctx.strokeStyle = 'rgba(156,108,38,.24)'; ctx.lineWidth = 2; ctx.stroke()

  TABLES.forEach((table, tableIndex) => {
    for (let seatIndex = 0; seatIndex < 6; seatIndex++) {
      const chair = chairPosition(tableIndex, seatIndex)
      const occupied = guests.some((guest) => guest.tableNumber === tableIndex + 1 && guest.seatNumber === seatIndex + 1)
      ctx.save(); ctx.translate(chair.x, chair.y); ctx.rotate(toRadians(chair.rotation))
      ctx.fillStyle = occupied ? '#c99a48' : '#f8f3e9'; ctx.strokeStyle = occupied ? '#9c6c26' : '#9b8c7b'; ctx.lineWidth = 2
      roundedRect(ctx, -22, -15, 44, 30, 7); ctx.fill(); ctx.stroke(); ctx.restore()
      if (selectedSeat?.table === tableIndex + 1 && selectedSeat.seat === seatIndex + 1) {
        ctx.beginPath(); ctx.arc(chair.x, chair.y, 25, 0, Math.PI * 2); ctx.strokeStyle = '#9c6c26'; ctx.lineWidth = 4; ctx.stroke()
      }
    }
    ctx.beginPath(); ctx.arc(table.x, table.y, 68, 0, Math.PI * 2)
    ctx.fillStyle = highlightedTable === tableIndex + 1 ? '#ead7ad' : '#fffdf8'; ctx.fill()
    ctx.strokeStyle = highlightedTable === tableIndex + 1 ? '#9c6c26' : '#b69b72'; ctx.lineWidth = highlightedTable === tableIndex + 1 ? 4 : 2; ctx.stroke()
    ctx.fillStyle = '#6b5844'; ctx.font = '500 24px Georgia'; ctx.fillText(String(tableIndex + 1), table.x, table.y + 8)
  })

}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius)
}
