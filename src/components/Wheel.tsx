import { memo } from 'react'
import type { Entry } from '../lib/odds'
import { polar, slicePath, type Slice } from '../lib/wheel'

const R = 480
const LABEL_OUTER = 462
const LABEL_INNER = 118
const HUB = 96

interface Props {
  slices: Slice<Entry>[]
  rotation: number
  durationMs: number
  spinning: boolean
  highlightId: string | null
  onSpin: () => void
  onSettled: () => void
}

export function Wheel({ slices, rotation, durationMs, spinning, highlightId, onSpin, onSettled }: Props) {
  const empty = slices.length === 0
  return (
    <div className="wheel">
      <svg viewBox="-500 -520 1000 1020" role="img" aria-label={`Roulette wheel with ${slices.length} places`}>
        <circle r={R + 14} className="wheel-rim" />
        <g
          className="wheel-face"
          style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${durationMs}ms` }}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === 'transform') onSettled()
          }}
        >
          <circle r={R} className="wheel-backdrop" />
          {empty ? null : <Slices slices={slices} highlightId={spinning ? null : highlightId} />}
        </g>
        <Pegs />
        <path className="wheel-pointer" d="M0 -452 L-30 -516 L30 -516 Z" />
        <circle r={HUB + 8} className="wheel-hub-ring" />
        <g
          className="wheel-hub"
          role="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={onSpin}
        >
          <circle r={HUB} />
          <text y={-8} className="wheel-hub-word">{spinning ? '…' : 'SPIN'}</text>
          <text y={34} className="wheel-hub-count">
            {slices.length} {slices.length === 1 ? 'place' : 'places'}
          </text>
        </g>
      </svg>
    </div>
  )
}

const Slices = memo(function Slices({ slices, highlightId }: { slices: Slice<Entry>[]; highlightId: string | null }) {
  const thin = slices.length > 120
  return (
    <>
      {slices.length === 1 ? (
        <circle r={R} className={`slice k-${slices[0].item.place.kind}`} />
      ) : (
        slices.map((s, i) => (
          <path
            key={s.item.place.id}
            d={slicePath(s.start, s.end, R)}
            className={`slice k-${s.item.place.kind}${i % 2 ? ' alt' : ''}${s.item.place.id === highlightId ? ' hit' : ''}`}
            strokeWidth={thin ? 0.6 : 1.5}
          />
        ))
      )}
      {slices.map((s) => (
        <Label key={s.item.place.id} slice={s} />
      ))}
    </>
  )
})

function Label({ slice }: { slice: Slice<Entry> }) {
  const sweep = slice.end - slice.start
  if (sweep < 2.3) return null
  const mid = (slice.start + slice.end) / 2
  // Font size follows the slice's width at the label's outer end.
  const arc = (2 * Math.PI * (LABEL_OUTER - 30) * sweep) / 360
  const size = Math.max(10, Math.min(26, arc * 0.62))
  const maxChars = Math.floor((LABEL_OUTER - LABEL_INNER) / (size * 0.56))
  const name = slice.item.place.name
  const text = name.length > maxChars ? `${name.slice(0, maxChars - 1).trimEnd()}…` : name
  return (
    <text
      className="slice-label"
      transform={`rotate(${mid - 90}) translate(${LABEL_OUTER} 0)`}
      textAnchor="end"
      dominantBaseline="central"
      fontSize={size}
    >
      {text}
    </text>
  )
}

function Pegs() {
  const pegs = []
  for (let i = 0; i < 36; i++) {
    const [x, y] = polar(i * 10, R + 7)
    pegs.push(<circle key={i} cx={x} cy={y} r={3.2} className="wheel-peg" />)
  }
  return <g>{pegs}</g>
}
