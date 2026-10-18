import { useMemo, useState } from 'react'
import { invitation as inv } from '../config'
import { Corner } from './Florals'

export default function Intro({ onOpen }) {
  const [opening, setOpening] = useState(false)

  const petals = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2 + Math.random() * 0.4
        const d = 110 + Math.random() * 200
        return {
          dx: Math.cos(a) * d,
          dy: Math.sin(a) * d - 40,
          rot: Math.random() * 360,
          size: 7 + Math.random() * 8,
          delay: Math.random() * 150,
          color: i % 3 === 0 ? '#9aab94' : i % 2 ? '#ecd1c9' : '#e2bcb1',
        }
      }),
    []
  )

  const open = (byUser) => {
    if (opening) return
    setOpening(true)
    onOpen(byUser)
  }

  // The envelope waits for a tap: that tap is the user gesture browsers require
  // before any audio can play, so the song starts exactly as the envelope opens.

  return (
    <div className={`intro ${opening ? 'is-opening' : ''}`} onClick={() => open(true)}>
      <div className="intro-inner">
        <p className="intro-kicker">You are invited</p>

        <div className="envelope">
          <div className="env-back" />
          <div className="letter">
            <Corner className="letter-corner" />
            <p className="letter-basmala">بسم الله الرحمن الرحيم</p>
            <p className="letter-names">
              {inv.groom} <span>&</span> {inv.bride}
            </p>
            <p className="letter-script">
              {inv.groomEn} & {inv.brideEn}
            </p>
          </div>
          <div className="env-pocket" />
          <div className="env-flap" />
          <button className="wax" aria-label="افتح الدعوة">
            <span className="wax-inner">
              {inv.groomEn[0]}
              <i>&</i>
              {inv.brideEn[0]}
            </span>
            <span className="wax-petals" aria-hidden="true">
              {petals.map((p, i) => (
                <span
                  key={i}
                  style={{
                    '--dx': `${p.dx}px`,
                    '--dy': `${p.dy}px`,
                    '--rot': `${p.rot}deg`,
                    width: p.size,
                    height: p.size * 0.75,
                    background: p.color,
                    animationDelay: `${p.delay}ms`,
                  }}
                />
              ))}
            </span>
          </button>
        </div>

        <p className="intro-hint">اضغط لفتح الدعوة 🎵</p>
        <p className="intro-note">🔊 شغّل الصوت لتجربة أجمل</p>
      </div>
    </div>
  )
}
