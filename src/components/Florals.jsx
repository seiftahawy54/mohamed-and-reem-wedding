// Hand-built SVG botanicals: eucalyptus-style branches and soft roses.

const LEAF = 'M0 0 C5 -6 5 -14 0 -20 C-5 -14 -5 -6 0 0Z'
const GREENS = ['#9aab94', '#7f9279', '#b8c5b1']

export function Branch({ x, y, rotate, length = 120, bend = 18, leaves = 8, size = 1, tone = 0 }) {
  const c = { x: bend, y: -length / 2 }
  const end = { x: 0, y: -length }
  const at = (t) => ({
    x: 2 * (1 - t) * t * c.x + t * t * end.x,
    y: 2 * (1 - t) * t * c.y + t * t * end.y,
  })
  const tangent = (t) => {
    const tx = 2 * (1 - t) * c.x + 2 * t * (end.x - c.x)
    const ty = 2 * (1 - t) * c.y + 2 * t * (end.y - c.y)
    return (Math.atan2(ty, tx) * 180) / Math.PI
  }

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path
        d={`M0 0 Q${c.x} ${c.y} ${end.x} ${end.y}`}
        stroke="#8a9a84"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {Array.from({ length: leaves }, (_, i) => {
        const t = 0.15 + (i / leaves) * 0.85
        const p = at(t)
        const side = i % 2 ? 1 : -1
        const s = size * (1.15 - t * 0.45)
        return (
          <path
            key={i}
            d={LEAF}
            fill={GREENS[(i + tone) % GREENS.length]}
            transform={`translate(${p.x} ${p.y}) rotate(${tangent(t) + 90 + side * 48}) scale(${s})`}
          />
        )
      })}
      <path d={LEAF} fill={GREENS[tone % 3]} transform={`translate(${end.x} ${end.y}) rotate(${tangent(1) + 90}) scale(${size * 0.7})`} />
    </g>
  )
}

export function Rose({ x, y, r = 16, light = '#f0d9d2', mid = '#e2bcb1', deep = '#c48f84' }) {
  const spiral = []
  for (let a = 0; a <= Math.PI * 5; a += 0.25) {
    const rad = r * (0.12 + (a / (Math.PI * 5)) * 0.7)
    spiral.push(`${(Math.cos(a) * rad).toFixed(1)} ${(Math.sin(a) * rad).toFixed(1)}`)
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <circle
            key={i}
            cx={Math.cos(a) * r * 0.5}
            cy={Math.sin(a) * r * 0.5}
            r={r * 0.58}
            fill={light}
            stroke={mid}
            strokeWidth="0.8"
          />
        )
      })}
      <circle r={r * 0.62} fill={mid} />
      <path d={`M${spiral.join(' L')}`} fill="none" stroke={deep} strokeWidth="1.1" strokeLinecap="round" />
    </g>
  )
}

function Bud({ x, y, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M0 0 L0 -16" stroke="#8a9a84" strokeWidth="1" />
      <ellipse cx="0" cy="-20" rx="4" ry="6" fill="#e2bcb1" />
      <path d="M-4 -16 Q0 -10 4 -16" fill="#9aab94" />
    </g>
  )
}

// Corner arrangement anchored at the top-right of its box.
export function Corner({ className = '' }) {
  return (
    <svg className={`corner ${className}`} viewBox="0 0 240 240" aria-hidden="true">
      <Branch x={228} y={14} rotate={-98} length={170} bend={-16} leaves={11} tone={0} />
      <Branch x={226} y={16} rotate={-168} length={160} bend={16} leaves={10} tone={1} />
      <Branch x={222} y={20} rotate={-133} length={120} bend={10} leaves={8} size={0.9} tone={2} />
      <Bud x={196} y={40} rotate={-120} />
      <Bud x={206} y={52} rotate={-155} />
      <Rose x={204} y={32} r={20} />
      <Rose x={172} y={22} r={13} light="#f6e7e2" mid="#ecd1c9" deep="#d3a79c" />
      <Rose x={222} y={66} r={12} light="#f6e7e2" mid="#ecd1c9" deep="#d3a79c" />
    </svg>
  )
}

// Small centered divider: two mirrored sprigs with a rose.
export function Sprig({ className = '' }) {
  return (
    <svg className={`sprig ${className}`} viewBox="0 0 220 40" aria-hidden="true">
      <Branch x={110} y={22} rotate={-90} length={90} bend={-8} leaves={7} size={0.6} tone={0} />
      <Branch x={110} y={22} rotate={90} length={90} bend={8} leaves={7} size={0.6} tone={1} />
      <Rose x={110} y={21} r={9} />
    </svg>
  )
}

export function Petals({ count = 16 }) {
  const petals = Array.from({ length: count }, (_, i) => {
    const r = (n) => {
      const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453
      return v - Math.floor(v)
    }
    return {
      left: `${r(1) * 100}%`,
      size: 8 + r(2) * 10,
      delay: `${-r(3) * 16}s`,
      dur: `${11 + r(4) * 9}s`,
      drift: `${(r(5) - 0.5) * 160}px`,
      hue: r(6) > 0.5 ? '#ecd1c9' : '#e2bcb1',
    }
  })
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 0.8,
            background: p.hue,
            animationDelay: p.delay,
            animationDuration: p.dur,
            '--drift': p.drift,
          }}
        />
      ))}
    </div>
  )
}

// Footer bouquet: fanned stems, a cluster of roses and a ribbon bow.
export function Bouquet({ className = '' }) {
  return (
    <svg className={`bouquet ${className}`} viewBox="0 0 200 230" aria-hidden="true">
      <Branch x={100} y={196} rotate={-38} length={130} bend={-14} leaves={9} size={0.9} tone={0} />
      <Branch x={100} y={196} rotate={38} length={130} bend={14} leaves={9} size={0.9} tone={1} />
      <Branch x={100} y={196} rotate={-14} length={150} bend={-8} leaves={10} size={0.85} tone={2} />
      <Branch x={100} y={196} rotate={16} length={145} bend={10} leaves={10} size={0.85} tone={0} />
      <path d="M100 196 L92 226 M100 196 L100 228 M100 196 L108 226" stroke="#8a9a84" strokeWidth="1.4" />
      <Rose x={72} y={96} r={15} light="#f6e7e2" mid="#ecd1c9" deep="#d3a79c" />
      <Rose x={128} y={94} r={15} light="#f6e7e2" mid="#ecd1c9" deep="#d3a79c" />
      <Rose x={86} y={74} r={18} />
      <Rose x={116} y={72} r={17} />
      <Rose x={100} y={98} r={20} />
      <Rose x={100} y={52} r={13} light="#f6e7e2" mid="#ecd1c9" deep="#d3a79c" />
      <g fill="none" stroke="#c48f84" strokeWidth="1.6" strokeLinecap="round">
        <path d="M100 172 q-26 -16 -34 0 q9 14 34 0" />
        <path d="M100 172 q26 -16 34 0 q-9 14 -34 0" />
        <path d="M100 172 q-8 18 -20 34 M100 172 q6 20 16 36" />
      </g>
      <circle cx="100" cy="172" r="4" fill="#c48f84" />
    </svg>
  )
}

// A single drifting vine for section edges (parallax via CSS).
export function SideVine({ side = 'right', className = '' }) {
  return (
    <svg className={`side-vine ${side} ${className}`} viewBox="0 0 90 260" aria-hidden="true">
      <Branch x={side === 'right' ? 88 : 2} y={250} rotate={side === 'right' ? -12 : 12} length={230} bend={side === 'right' ? -22 : 22} leaves={14} size={0.85} tone={1} />
      <Rose x={side === 'right' ? 70 : 20} y={40} r={11} light="#f6e7e2" mid="#ecd1c9" deep="#d3a79c" />
    </svg>
  )
}
