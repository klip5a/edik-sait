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

const WIDTH = 800
const HEIGHT = 650
const TABLES = [
  { x: 220, y: 235 },
  { x: 580, y: 235 },
  { x: 220, y: 470 },
  { x: 580, y: 470 },
]

function chairPosition(tableIndex: number, seatIndex: number) {
  const table = TABLES[tableIndex]
  const angle = -Math.PI / 2 + seatIndex * Math.PI / 3
  return { x: table.x + Math.cos(angle) * 92, y: table.y + Math.sin(angle) * 92, angle }
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

  return (
    <div ref={hostRef} class="relative mx-auto w-full max-w-[50rem] overflow-hidden rounded-3xl bg-[#f6f0e4] shadow-soft outline-1 -outline-offset-1 outline-black/10">
      <canvas ref={canvasRef} class="block aspect-[800/650] w-full" aria-hidden="true" />

      {TABLES.map((table, tableIndex) => (
        <button
          type="button"
          class="absolute size-[23%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent text-transparent outline-none transition-[box-shadow] hover:shadow-[0_0_0_3px_rgb(156_108_38/0.42)] focus-visible:shadow-[0_0_0_4px_rgb(156_108_38/0.62)]"
          style={{ left: `${table.x / WIDTH * 100}%`, top: `${table.y / HEIGHT * 100}%` }}
          aria-label={`Стол ${tableIndex + 1}. ${guests.filter((guest) => guest.tableNumber === tableIndex + 1).map((guest) => guest.name).join(', ') || 'Свободен'}`}
          onMouseEnter={() => setHoveredTable(tableIndex + 1)}
          onMouseLeave={() => setHoveredTable(null)}
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

      {shownTable ? (
        <div class="pointer-events-none absolute top-3 right-3 z-10 w-[min(15rem,52%)] rounded-2xl bg-white/95 p-3 text-left text-sm shadow-[0_12px_35px_rgb(67_58_51/0.18)] backdrop-blur-sm" role="status">
          <strong class="block text-base text-gold-deep">Стол {shownTable}</strong>
          {shownGuests.length ? (
            <ul class="mt-1 mb-0 list-none p-0">
              {shownGuests.map((guest) => <li key={guest.id}>{guest.seatNumber}. {guest.name}</li>)}
            </ul>
          ) : <span class="text-ink-soft">Пока свободен</span>}
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
      ctx.save(); ctx.translate(chair.x, chair.y); ctx.rotate(chair.angle + Math.PI / 2)
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

  ctx.fillStyle = '#9c6c26'; ctx.beginPath(); ctx.moveTo(375, 622); ctx.lineTo(425, 622); ctx.lineTo(400, 598); ctx.closePath(); ctx.fill()
  ctx.font = '600 15px Georgia'; ctx.fillText('ВХОД', 400, 590)
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius)
}
