import { invitation } from '../config'

const DAYS = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'] // Sun → Sat

export default function Calendar() {
  const d = new Date(invitation.date)
  const year = d.getFullYear()
  const month = d.getMonth()
  const first = new Date(year, month, 1).getDay()
  const total = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

  return (
    <div className="calendar">
      <p className="cal-month">
        {invitation.dateEn.month} <span>{year}</span>
      </p>
      <div className="cal-grid">
        {DAYS.map((day) => (
          <span key={day} className="cal-head">
            {day}
          </span>
        ))}
        {cells.map((n, i) => (
          <span key={i} className={`cal-day ${n === d.getDate() ? 'is-day' : ''}`}>
            {n === d.getDate() && (
              <svg viewBox="0 0 40 36" className="cal-heart" aria-hidden="true">
                <path
                  d="M20 33 C6 23 2 16 2 10.5 C2 5.5 6 2 10.5 2 C14.5 2 17.5 4.5 20 8 C22.5 4.5 25.5 2 29.5 2 C34 2 38 5.5 38 10.5 C38 16 34 23 20 33Z"
                  pathLength="1"
                />
              </svg>
            )}
            <b>{n}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
