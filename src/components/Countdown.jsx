import { useEffect, useState } from 'react'

function diff(target) {
  const ms = Math.max(0, new Date(target) - new Date())
  return {
    done: ms === 0,
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  }
}

// Each digit rolls in when it changes
function Digits({ value }) {
  return (
    <span className="cd-value">
      {String(value)
        .padStart(2, '0')
        .split('')
        .map((d, i) => (
          <span className="cd-digit" key={`${i}-${d}`}>
            {d}
          </span>
        ))}
    </span>
  )
}

export default function Countdown({ date }) {
  const [t, setT] = useState(() => diff(date))

  useEffect(() => {
    const id = setInterval(() => setT(diff(date)), 1000)
    return () => clearInterval(id)
  }, [date])

  if (t.done) return <p className="countdown-done">بارك الله لهما وجمع بينهما في خير</p>

  const units = [
    ['يوم', t.days],
    ['ساعة', t.hours],
    ['دقيقة', t.minutes],
    ['ثانية', t.seconds],
  ]

  return (
    <div className="countdown">
      {units.map(([label, value]) => (
        <div className="cd-unit" key={label}>
          <Digits value={value} />
          <span className="cd-label">{label}</span>
        </div>
      ))}
    </div>
  )
}
