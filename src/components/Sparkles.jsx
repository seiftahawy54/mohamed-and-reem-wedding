import { useEffect, useRef, useState } from 'react'

// Wrap anything; tapping it scatters a few petals from the tap point.
// With `auto`, petals also burst on their own every few seconds.
export default function Sparkles({ children, className = '', auto = false }) {
  const [bursts, setBursts] = useState([])
  const ref = useRef(null)

  const burstAt = (x, y) => {
    const id = Date.now() + Math.random()
    const parts = Array.from({ length: 12 }, () => {
      const a = Math.random() * Math.PI * 2
      const d = 30 + Math.random() * 70
      return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, s: 3 + Math.random() * 5 }
    })
    setBursts((b) => [...b, { id, x, y, parts }])
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 1000)
  }

  const spawn = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    burstAt(e.clientX - rect.left, e.clientY - rect.top)
  }

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let interval
    const tick = () => {
      const el = ref.current
      if (!el) return
      burstAt(el.offsetWidth * (0.2 + Math.random() * 0.6), el.offsetHeight * (0.15 + Math.random() * 0.7))
    }
    const start = setTimeout(() => {
      tick()
      interval = setInterval(tick, 2200)
    }, 3800) // after the names have faded in
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [auto])

  return (
    <div ref={ref} className={`sparkles ${className}`} onClick={spawn}>
      {children}
      {bursts.map((b) =>
        b.parts.map((p, i) => (
          <span
            key={`${b.id}-${i}`}
            className="spark"
            style={{ left: b.x, top: b.y, width: p.s, height: p.s, '--dx': `${p.dx}px`, '--dy': `${p.dy}px` }}
          />
        ))
      )}
    </div>
  )
}
