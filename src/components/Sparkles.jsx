import { useState } from 'react'

// Wrap anything; tapping it scatters a few gold sparkles from the tap point.
export default function Sparkles({ children, className = '' }) {
  const [bursts, setBursts] = useState([])

  const spawn = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now() + Math.random()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const parts = Array.from({ length: 12 }, () => {
      const a = Math.random() * Math.PI * 2
      const d = 30 + Math.random() * 70
      return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, s: 3 + Math.random() * 5 }
    })
    setBursts((b) => [...b, { id, x, y, parts }])
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 1000)
  }

  return (
    <div className={`sparkles ${className}`} onClick={spawn}>
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
