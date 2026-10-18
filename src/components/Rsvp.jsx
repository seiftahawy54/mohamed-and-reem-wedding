import { useState } from 'react'
import { invitation as inv } from '../config'

export default function Rsvp() {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState(true)
  const [guests, setGuests] = useState(1)
  const [wish, setWish] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const lines = [
      `السلام عليكم، أنا ${name.trim()}`,
      attending
        ? `يسعدني تأكيد حضوري حفل زفاف ${inv.groom} و${inv.bride} — عدد الحضور: ${guests}`
        : `أعتذر عن حضور حفل زفاف ${inv.groom} و${inv.bride}، وأتمنى لهما كل الخير`,
      wish.trim() && `دعوتي للعروسين: ${wish.trim()}`,
    ].filter(Boolean)
    window.open(`https://wa.me/${inv.rsvpPhone}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rsvp-done">
        <span className="check" />
        <p className="program-title">شكراً لك {name.trim()}</p>
        <p className="detail-sub">{attending ? 'ننتظرك بإذن الله' : 'جزاك الله خيراً على دعواتك'}</p>
        <button className="link-btn" onClick={() => setSent(false)}>تعديل الرد</button>
      </div>
    )
  }

  return (
    <form className="rsvp" onSubmit={submit}>
      <label className="field">
        <span>الاسم</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="اكتب اسمك" />
      </label>

      <div className="toggle" role="radiogroup">
        <button type="button" className={attending ? 'active' : ''} onClick={() => setAttending(true)}>
          سأحضر بإذن الله
        </button>
        <button type="button" className={!attending ? 'active' : ''} onClick={() => setAttending(false)}>
          أعتذر
        </button>
        <span className={`toggle-pill ${attending ? '' : 'right'}`} />
      </div>

      {attending && (
        <div className="stepper">
          <span>عدد الحضور</span>
          <div>
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="أقل">−</button>
            <b key={guests}>{guests}</b>
            <button type="button" onClick={() => setGuests((g) => Math.min(10, g + 1))} aria-label="أكثر">+</button>
          </div>
        </div>
      )}

      <label className="field">
        <span>دعوة للعروسين (اختياري)</span>
        <textarea value={wish} onChange={(e) => setWish(e.target.value)} rows={3} placeholder="بارك الله لكما…" />
      </label>

      <button className="btn btn-solid" type="submit">إرسال عبر واتساب</button>
    </form>
  )
}
