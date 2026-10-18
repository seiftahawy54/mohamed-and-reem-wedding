import { useEffect, useRef, useState } from 'react'
import Intro from './components/Intro'
import Invitation from './components/Invitation'
import { createMusic, detectMusicFile } from './music'

export default function App() {
  const [stage, setStage] = useState('intro') // intro | opening | reveal | open
  const [playing, setPlaying] = useState(false)
  const music = useRef(null)
  const playingRef = useRef(false)
  const userPaused = useRef(false) // guest turned music off themselves; never auto-start it again

  const setPlayingBoth = (v) => {
    playingRef.current = v
    setPlaying(v)
  }

  // Must run synchronously inside gesture handlers so browsers allow the audio.
  const startMusic = () => {
    if (playingRef.current) return
    if (!music.current) music.current = createMusic(true)
    music.current
      .play()
      .then(() => setPlayingBoth(true))
      .catch(() => setPlayingBoth(false))
  }

  useEffect(() => {
    // Preload the song now and try to autoplay (allowed by some browsers, e.g. desktop Chrome on revisit)
    music.current = createMusic(true)
    startMusic()
    // Only fall back to the synthesized melody if the song file is really missing
    detectMusicFile().then((ok) => {
      if (!ok && !playingRef.current) music.current = createMusic(false)
    })

    // Otherwise start on the guest's first tap/click/key anywhere on the page
    const gestures = ['pointerup', 'touchend', 'keydown', 'click']
    const onGesture = (e) => {
      if (e.target.closest?.('.music-toggle')) return // the toggle handles itself
      if (!userPaused.current) startMusic()
    }
    gestures.forEach((g) => window.addEventListener(g, onGesture, true))

    // Phones pause audio in the background; resume when the guest comes back
    const onVisible = () => {
      if (document.visibilityState === 'visible' && playingRef.current && !userPaused.current) {
        music.current?.play().catch(() => setPlayingBoth(false))
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      music.current?.pause()
      gestures.forEach((g) => window.removeEventListener(g, onGesture, true))
      document.removeEventListener('visibilitychange', onVisible)
    }
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

  // byUser: opened by tapping the seal, a gesture, so the song can start right now.
  // Auto-opened: the global gesture listener starts it on the guest's first tap.
  const handleOpen = (byUser) => {
    if (byUser && !userPaused.current) startMusic()
    setStage('opening')
    // mount the page as the envelope starts fading so its entrance animations aren't hidden
    setTimeout(() => setStage('reveal'), 2200)
    setTimeout(() => setStage('open'), 3400)
  }

  const toggleMusic = () => {
    if (playingRef.current) {
      userPaused.current = true
      music.current.pause()
      setPlayingBoth(false)
    } else {
      userPaused.current = false
      startMusic()
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
