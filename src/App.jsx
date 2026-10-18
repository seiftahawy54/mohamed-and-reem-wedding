import { useEffect, useRef, useState } from 'react'
import Intro from './components/Intro'
import Invitation from './components/Invitation'
import { createMusic, detectMusicFile } from './music'

export default function App() {
  const [stage, setStage] = useState('intro') // intro | opening | reveal | open
  const [playing, setPlaying] = useState(false)
  const music = useRef(null)
  const hasFile = useRef(false)

  useEffect(() => {
    detectMusicFile().then((ok) => (hasFile.current = ok))
  }, [])

  // Scroll-driven CSS vars: --scroll (px) for parallax, --progress (0..1) for the top bar
  useEffect(() => {
    const root = document.documentElement
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = root.scrollHeight - window.innerHeight
        root.style.setProperty('--scroll', window.scrollY)
        root.style.setProperty('--progress', max > 0 ? window.scrollY / max : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const startMusic = () => {
    if (!music.current) music.current = createMusic(hasFile.current)
    music.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  // byUser: opened by tapping the seal (a user gesture, so audio may start now).
  // Auto-opened envelopes can't play audio yet; start it on the guest's first tap/key instead.
  const handleOpen = (byUser) => {
    if (byUser) {
      startMusic()
    } else {
      const events = ['pointerup', 'touchend', 'keydown', 'click']
      const onFirstGesture = (e) => {
        if (e.target.closest?.('.music-toggle')) return // the toggle handles itself
        events.forEach((ev) => window.removeEventListener(ev, onFirstGesture, true))
        if (!music.current) startMusic()
      }
      events.forEach((ev) => window.addEventListener(ev, onFirstGesture, true))
    }
    setStage('opening')
    // mount the page as the envelope starts fading so its entrance animations aren't hidden
    setTimeout(() => setStage('reveal'), 2200)
    setTimeout(() => setStage('open'), 3400)
  }

  const toggleMusic = () => {
    if (!music.current) return startMusic()
    if (playing) {
      music.current.pause()
      setPlaying(false)
    } else {
      music.current.play().then(() => setPlaying(true))
    }
  }

  return (
    <>
      {(stage === 'reveal' || stage === 'open') && <div className="progress-bar" aria-hidden="true" />}
      {(stage === 'reveal' || stage === 'open') && <Invitation />}
      {stage !== 'open' && <Intro onOpen={handleOpen} />}
      {stage !== 'intro' && (
        <button
          className={`music-toggle ${playing ? 'on' : ''}`}
          onClick={toggleMusic}
          aria-label={playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        >
          <span /><span /><span />
        </button>
      )}
    </>
  )
}
