import { useEffect, useState } from 'react'
import { invitation as inv } from '../config'
import Calendar from './Calendar'
import Countdown from './Countdown'
import Program from './Program'
import Reveal from './Reveal'
import Sparkles from './Sparkles'
import { Bouquet, Corner, Petals, SideVine, Sprig } from './Florals'
import { Hourglass, Mosque, Rings, ScrollVine } from './LineArt'

const title = `زفاف ${inv.groom} و${inv.bride}`

const googleCalUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent(title)}` +
  `&dates=${inv.calendar.start}/${inv.calendar.end}` +
  `&ctz=${inv.calendar.timeZone}` +
  `&location=${encodeURIComponent(`${inv.venue} ${inv.mapUrl}`)}` +
  `&details=${encodeURIComponent('بارك الله لهما وبارك عليهما وجمع بينهما في خير')}`

function downloadIcs() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//reem-invitation//AR',
    'BEGIN:VEVENT',
    `UID:${inv.calendar.start}-wedding@invitation`,
    `DTSTART;TZID=${inv.calendar.timeZone}:${inv.calendar.start}`,
    `DTEND;TZID=${inv.calendar.timeZone}:${inv.calendar.end}`,
    `SUMMARY:${title}`,
    `LOCATION:${inv.venue}`,
    `URL:${inv.mapUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'wedding.ics'
  a.click()
  URL.revokeObjectURL(url)
}

function useFlash() {
  const [msg, setMsg] = useState('')
  const flash = (text) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 1800)
  }
  return [msg, flash]
}

function SectionHead({ en, ar }) {
  return (
    <Reveal className="section-head">
      <p className="script-label">{en}</p>
      <h2 className="section-title">{ar}</h2>
      <Sprig />
    </Reveal>
  )
}

// If the guest hasn't scrolled a few seconds after the card appears,
// gently peek down and back up once to show there's more below.
function useScrollPeek() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelled = false
    const cancel = () => (cancelled = true)
    const events = ['wheel', 'touchstart', 'keydown', 'mousedown']
    events.forEach((e) => window.addEventListener(e, cancel, { passive: true, once: true }))
    const t1 = setTimeout(() => {
      if (cancelled || window.scrollY > 10) return
      window.scrollTo({ top: 170, behavior: 'smooth' })
    }, 5200)
    const t2 = setTimeout(() => {
      if (cancelled || window.scrollY > 200) return
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 6600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      events.forEach((e) => window.removeEventListener(e, cancel))
    }
  }, [])
}

export default function Invitation() {
  const [toast, flash] = useFlash()
  const { dateEn } = inv
  useScrollPeek()

  const copyLocation = async () => {
    try {
      await navigator.clipboard.writeText(inv.mapUrl)
      flash('تم نسخ رابط الموقع')
    } catch {
      flash('تعذّر النسخ')
    }
  }

  const share = async () => {
    const data = { title, text: `يسعدنا دعوتكم لحضور ${title}`, url: window.location.href }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(data.url)
      flash('تم نسخ رابط الدعوة')
    }
  }

  return (
    <main className="invitation">
      {/* ---------- Hero card ---------- */}
      <section className="hero">
        <Petals />
        <div className="card hero-card">
          <Corner className="c-tr grow-in" />
          <Corner className="c-bl grow-in" />

          <p className="basmala fade-up" style={{ animationDelay: '0.6s' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <Rings className="hero-rings draw-now" />
          <p className="lead fade-up" style={{ animationDelay: '1s' }}>
            بكل الحب والسرور، ندعوكم لمشاركتنا فرحة زفاف
          </p>

          <Sparkles className="names-wrap">
            <h1 className="names fade-up" style={{ animationDelay: '1.4s' }}>
              {inv.groom} <span className="amp">&</span> {inv.bride}
            </h1>
            <p className="names-script write" style={{ animationDelay: '2s' }}>
              {inv.groomEn} & {inv.brideEn}
            </p>
          </Sparkles>

          <div className="date-block fade-up" style={{ animationDelay: '2.6s' }} dir="ltr">
            <p className="db-month">{dateEn.month}</p>
            <div className="db-row">
              <span className="db-side">{dateEn.weekday}</span>
              <span className="db-day">{dateEn.day}</span>
              <span className="db-side">at {dateEn.time}</span>
            </div>
            <p className="db-year">{dateEn.year}</p>
          </div>

          <p className="hero-venue fade-up" style={{ animationDelay: '3s' }}>
            {inv.venue}
          </p>
        </div>
        <div className="scroll-guide-wrap">
          <a href="#verse" className="scroll-guide fade-up" style={{ animationDelay: '3.6s' }}>
            <span className="sg-script">scroll down</span>
            <span className="sg-text">مرّر للأسفل لمعرفة التفاصيل</span>
            <ScrollVine />
          </a>
        </div>
      </section>

      {/* ---------- Verse ---------- */}
      <section className="section" id="verse">
        <Reveal className="verse-block">
          <Sprig />
          <p className="verse">
            ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ
            بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
          </p>
          <p className="caption">سورة الروم · ٢١</p>
        </Reveal>
      </section>

      {/* ---------- Save the date ---------- */}
      <section className="section tinted has-vines">
        <SideVine side="right" />
        <SideVine side="left" />
        <SectionHead en="Save the Date" ar="احفظوا الموعد" />
        <div className="std">
          <Reveal className="card small-card" delay={100}>
            <Calendar />
          </Reveal>
          <div className="details">
            <Reveal className="detail" delay={150}>
              <p className="caption">اليوم</p>
              <p className="detail-main">{inv.dateText}</p>
              <p className="detail-sub">{inv.hijriText}</p>
            </Reveal>
            <Reveal className="detail" delay={250}>
              <p className="caption">الوقت</p>
              <p className="detail-main">{inv.timeText}</p>
            </Reveal>
            <Reveal className="detail" delay={350}>
              <p className="caption">المكان</p>
              <p className="detail-main">{inv.venue}</p>
              {inv.address && <p className="detail-sub">{inv.address}</p>}
            </Reveal>
          </div>
        </div>
        <Reveal className="actions" delay={300}>
          <a className="btn btn-ghost" href={googleCalUrl} target="_blank" rel="noreferrer">
            أضف إلى تقويم جوجل
          </a>
          <button className="btn btn-ghost" onClick={downloadIcs}>
            أضف إلى تقويم الهاتف
          </button>
        </Reveal>
      </section>

      {/* ---------- Countdown ---------- */}
      <section className="section">
        <SectionHead en="Counting the Days" ar="على الموعد بإذن الله" />
        <Reveal className="illus">
          <Hourglass className="hourglass" />
        </Reveal>
        <Reveal delay={150}>
          <Countdown date={inv.date} />
        </Reveal>
      </section>

      {/* ---------- Program ---------- */}
      <section className="section tinted has-vines">
        <SideVine side="left" className="low" />
        <SideVine side="right" className="low" />
        <SectionHead en="Order of the Evening" ar="فقرات الليلة" />
        <Program />
      </section>

      {/* ---------- Location ---------- */}
      <section className="section">
        <SectionHead en="The Venue" ar="كيف تصل إلينا" />
        <Reveal className="card location-card" delay={150}>
          <Corner className="c-tr small" />
          <Mosque className="mosque" />
          <p className="detail-main">{inv.venue}</p>
          {inv.address && <p className="detail-sub">{inv.address}</p>}
          <div className="actions">
            <a className="btn btn-solid" href={inv.mapUrl} target="_blank" rel="noreferrer">
              افتح في الخرائط
            </a>
            <button className="btn btn-ghost" onClick={copyLocation}>
              نسخ الرابط
            </button>
          </div>
        </Reveal>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <Reveal className="illus">
          <Bouquet />
          <p className="dua">بارك الله لكما، وبارك عليكما، وجمع بينكما في خير</p>
          <p className="footer-script">
            {inv.groomEn} & {inv.brideEn}
          </p>
          <p className="detail-sub">بحضوركم تكتمل فرحتنا</p>
          <button className="link-btn share" onClick={share}>
            شارك الدعوة
          </button>
        </Reveal>
      </footer>

      <div className={`toast ${toast ? 'show' : ''}`} role="status">
        {toast}
      </div>
    </main>
  )
}
