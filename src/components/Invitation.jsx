import { useCallback, useEffect, useRef, useState } from 'react'
import { invitation as inv } from '../config'
import Calendar from './Calendar'
import Countdown from './Countdown'
import PageSection from './PageSection'
import Program from './Program'
import Reveal from './Reveal'
import Sparkles from './Sparkles'
import { Bouquet, Corner, Petals, SideVine, Sprig } from './Florals'
import { Hourglass, Mosque, Rings, ScrollVine } from './LineArt'

const TOTAL_PAGES = 7
const AUTO_TURN_FIRST_DELAY = 6000
const AUTO_TURN_INTERVAL = 6500
const AUTO_TURN_RESUME = 60000

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

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Equal scroll distance for every single page (0 .. TOTAL_PAGES - 1)
function getScrollTopForPage(idx) {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const clamped = Math.max(0, Math.min(TOTAL_PAGES - 1, idx))
  return Math.round((clamped / (TOTAL_PAGES - 1)) * maxScroll)
}

export default function Invitation() {
  const [toast, flash] = useFlash()
  const [page, setPage] = useState(0)
  const pageRef = useRef(0)
  const leafRefs = useRef([])
  const { dateEn } = inv

  const setLeafRef = (idx) => (el) => {
    leafRefs.current[idx] = el
  }

  const goToPage = useCallback((targetIdx) => {
    const clamped = Math.max(0, Math.min(TOTAL_PAGES - 1, targetIdx))
    const top = getScrollTopForPage(clamped)
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  const nextPage = useCallback(() => {
    goToPage(pageRef.current + 1)
  }, [goToPage])

  const prevPage = useCallback(() => {
    goToPage(pageRef.current - 1)
  }, [goToPage])

  // Unified native-scroll book engine with equal page steps & magnetic settling
  useEffect(() => {
    let rafId = 0
    let settleTimer = 0
    let autoTimer = 0
    let resumeTimer = 0
    let smoothProgress = 0
    let targetProgress = 0
    let lastScrollY = window.scrollY
    let scrollDir = 1
    let isTouching = false

    const computeTarget = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const sy = Math.max(0, Math.min(maxScroll, window.scrollY))
      if (Math.abs(sy - lastScrollY) > 0.5) {
        scrollDir = sy > lastScrollY ? 1 : -1
        lastScrollY = sy
      }
      targetProgress = (sy / maxScroll) * (TOTAL_PAGES - 1)
    }

    const applyBookState = (prog) => {
      const leaves = leafRefs.current
      const turns = new Array(TOTAL_PAGES).fill(0)
      turns[0] = 1

      for (let i = 1; i < TOTAL_PAGES; i++) {
        const seg = prog - (i - 1)
        const rawTurn = Math.max(0, Math.min(1, seg))
        turns[i] = easeInOutCubic(rawTurn)
      }

      let activeIdx = 0
      for (let i = 1; i < TOTAL_PAGES; i++) {
        if (turns[i] > 0.45) activeIdx = i
      }

      if (activeIdx !== pageRef.current) {
        pageRef.current = activeIdx
        setPage(activeIdx)
      }

      for (let i = 0; i < TOTAL_PAGES; i++) {
        const el = leaves[i]
        if (!el) continue
        const t = turns[i]
        const swing = Math.sin(t * Math.PI)
        const underTurn = i < TOTAL_PAGES - 1 ? turns[i + 1] : 0

        el.style.setProperty('--turn', t.toFixed(4))
        el.style.setProperty('--swing', swing.toFixed(4))
        el.style.setProperty('--under-turn', underTurn.toFixed(4))
      }
    }

    const tick = () => {
      computeTarget()
      const diff = targetProgress - smoothProgress
      if (Math.abs(diff) > 0.0008) {
        smoothProgress += diff * 0.22
        applyBookState(smoothProgress)
        rafId = requestAnimationFrame(tick)
      } else {
        smoothProgress = targetProgress
        applyBookState(smoothProgress)
        rafId = 0
      }
    }

    const startTick = () => {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    // Gently settle any half-turned page to a flat integer page index when scrolling stops
    const scheduleSettle = () => {
      clearTimeout(settleTimer)
      if (isTouching) return
      settleTimer = setTimeout(() => {
        computeTarget()
        const baseIdx = Math.floor(targetProgress)
        const frac = targetProgress - baseIdx
        if (frac > 0.03 && frac < 0.97) {
          const destPage =
            scrollDir >= 0
              ? frac > 0.18
                ? baseIdx + 1
                : baseIdx
              : frac < 0.82
                ? baseIdx
                : baseIdx + 1
          window.scrollTo({
            top: getScrollTopForPage(destPage),
            behavior: 'smooth',
          })
        }
      }, 160)
    }

    const scheduleAuto = (delay = AUTO_TURN_INTERVAL) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      clearTimeout(autoTimer)
      autoTimer = setTimeout(() => {
        if (pageRef.current < TOTAL_PAGES - 1) {
          goToPage(pageRef.current + 1)
          scheduleAuto(AUTO_TURN_INTERVAL)
        }
      }, delay)
    }

    const pauseAuto = (e) => {
      if (e?.target?.closest?.('.music-toggle')) return
      clearTimeout(autoTimer)
      clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => scheduleAuto(AUTO_TURN_INTERVAL), AUTO_TURN_RESUME)
    }

    const onScroll = () => {
      startTick()
      scheduleSettle()
    }

    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e) => {
      isTouching = true
      clearTimeout(settleTimer)
      pauseAuto(e)
      const t = e.touches[0]
      if (t) {
        touchStartX = t.clientX
        touchStartY = t.clientY
      }
    }

    const onTouchEnd = (e) => {
      isTouching = false
      const t = e.changedTouches[0]
      if (t) {
        const dx = touchStartX - t.clientX
        const dy = touchStartY - t.clientY
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx < 0) goToPage(pageRef.current + 1)
          else goToPage(pageRef.current - 1)
          return
        }
      }
      scheduleSettle()
    }

    const onKeyDown = (e) => {
      pauseAuto(e)
      if (['ArrowDown', 'PageDown', ' ', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        goToPage(pageRef.current + 1)
      } else if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault()
        goToPage(pageRef.current - 1)
      }
    }

    computeTarget()
    smoothProgress = targetProgress
    applyBookState(smoothProgress)
    scheduleAuto(AUTO_TURN_FIRST_DELAY)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('wheel', pauseAuto, { passive: true })
    window.addEventListener('pointerdown', pauseAuto, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(settleTimer)
      clearTimeout(autoTimer)
      clearTimeout(resumeTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', pauseAuto)
      window.removeEventListener('pointerdown', pauseAuto)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [goToPage])

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
    <main
      className="invitation book-scroll-container"
      style={{ '--total-pages': TOTAL_PAGES }}
    >
      <div className="book-viewport">
        <Petals />

        <div className="book-stage">
          <div className="book-cover-board" aria-hidden="true" />

          <div className="book-pages">
            {/* ---------- Page 1: Hero ---------- */}
            <PageSection
              ref={setLeafRef(0)}
              index={0}
              activeIndex={page}
              total={TOTAL_PAGES}
              isHero
              corners={
                <>
                  <Corner className="c-tr grow-in" />
                  <Corner className="c-bl grow-in" />
                </>
              }
              onTurnNext={nextPage}
            >
              <div className="hero-content">
                <p className="basmala fade-up" style={{ animationDelay: '0.6s' }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <Rings className="hero-rings draw-now" />
                <p className="lead fade-up" style={{ animationDelay: '1s' }}>
                  بكل الحب والسرور، ندعوكم لمشاركتنا فرحة زفاف
                </p>

                <Sparkles className="names-wrap" auto>
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

                <div className="scroll-guide-wrap">
                  <button
                    type="button"
                    onClick={nextPage}
                    className="scroll-guide fade-up"
                    style={{ animationDelay: '3.4s' }}
                  >
                    <span className="sg-script">turn the page</span>
                    <span className="sg-text">مرّر أو اقلب الصفحة لمعرفة التفاصيل</span>
                    <ScrollVine />
                  </button>
                </div>
              </div>
            </PageSection>

            {/* ---------- Page 2: Verse ---------- */}
            <PageSection
              ref={setLeafRef(1)}
              index={1}
              activeIndex={page}
              total={TOTAL_PAGES}
              onTurnNext={nextPage}
            >
              <Reveal className="verse-block">
                <Sprig />
                <p className="verse">
                  ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ
                  بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
                </p>
                <p className="caption">سورة الروم · ٢١</p>
              </Reveal>
            </PageSection>

            {/* ---------- Page 3: Save the date ---------- */}
            <PageSection
              ref={setLeafRef(2)}
              index={2}
              activeIndex={page}
              total={TOTAL_PAGES}
              tinted
              hasVines
              onTurnNext={nextPage}
            >
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
            </PageSection>

            {/* ---------- Page 4: Countdown ---------- */}
            <PageSection
              ref={setLeafRef(3)}
              index={3}
              activeIndex={page}
              total={TOTAL_PAGES}
              onTurnNext={nextPage}
            >
              <SectionHead en="Counting the Days" ar="على الموعد بإذن الله" />
              <Reveal className="illus">
                <Hourglass className="hourglass" />
              </Reveal>
              <Reveal delay={150}>
                <Countdown date={inv.date} />
              </Reveal>
            </PageSection>

            {/* ---------- Page 5: Program ---------- */}
            <PageSection
              ref={setLeafRef(4)}
              index={4}
              activeIndex={page}
              total={TOTAL_PAGES}
              tinted
              hasVines
              onTurnNext={nextPage}
            >
              <SideVine side="left" className="low" />
              <SideVine side="right" className="low" />
              <SectionHead en="Order of the Evening" ar="فقرات الليلة" />
              <Program />
            </PageSection>

            {/* ---------- Page 6: Location ---------- */}
            <PageSection
              ref={setLeafRef(5)}
              index={5}
              activeIndex={page}
              total={TOTAL_PAGES}
              corners={<Corner className="c-tr small" />}
              onTurnNext={nextPage}
            >
              <SectionHead en="The Venue" ar="كيف تصل إلينا" />
              <Reveal className="location-content" delay={150}>
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
            </PageSection>

            {/* ---------- Page 7: Footer ---------- */}
            <PageSection
              ref={setLeafRef(6)}
              index={6}
              activeIndex={page}
              total={TOTAL_PAGES}
              isFooter
              corners={
                <>
                  <Corner className="c-tr" />
                  <Corner className="c-bl" />
                </>
              }
              onTurnNext={nextPage}
            >
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
            </PageSection>
          </div>
        </div>

        {/* Book browsing controls */}
        <nav className="book-nav" aria-label="تصفح صفحات الدعوة">
          <button
            type="button"
            className="book-nav-btn"
            onClick={prevPage}
            disabled={page === 0}
            aria-label="الصفحة السابقة"
          >
            السابق
          </button>

          <div className="book-dots" dir="ltr">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`book-dot ${i === page ? 'active' : ''}`}
                onClick={() => goToPage(i)}
                aria-label={`صفحة ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="book-nav-btn"
            onClick={nextPage}
            disabled={page === TOTAL_PAGES - 1}
            aria-label="الصفحة التالية"
          >
            التالي
          </button>
        </nav>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`} role="status">
        {toast}
      </div>
    </main>
  )
}
