// Background music controller.
// If you drop a track at public/music.m4a it will be used.
// Otherwise a gentle Hijaz-maqam melody (ney + drone + daf) is synthesized live with the Web Audio API.

const BPM = 70
const BEAT = 60 / BPM
const D4 = 293.66

// Maqam Hijaz on D (semitones from D4)
const NOTE = { C4: -2, D: 0, Eb: 1, 'F#': 4, G: 5, A: 7, Bb: 8, C: 10, D5: 12 }

const PHRASES = [
  [['A', 2], ['G', 1], ['F#', 1], ['G', 1], ['F#', 0.5], ['Eb', 0.5], ['D', 3]],
  [['D', 1], ['Eb', 1], ['F#', 1], ['G', 1], ['A', 3], [null, 1]],
  [['Bb', 1], ['A', 1], ['G', 1], ['A', 0.5], ['Bb', 0.5], ['C', 2], ['Bb', 1], ['A', 1], ['G', 1], ['F#', 1], ['G', 2]],
  [['F#', 1], ['Eb', 1], ['F#', 1], ['G', 1], ['F#', 1], ['Eb', 1], ['D', 4]],
  [['A', 1], ['Bb', 1], ['C', 1], ['D5', 3], ['C', 1], ['Bb', 1], ['A', 2], [null, 1]],
  [['G', 1], ['F#', 1], ['Eb', 1], ['D', 1], ['C4', 1], ['D', 3], [null, 2]],
]

const freq = (name) => D4 * Math.pow(2, NOTE[name] / 12)

function makeImpulse(ctx, seconds = 3.5, decay = 2.5) {
  const rate = ctx.sampleRate
  const len = rate * seconds
  const buf = ctx.createBuffer(2, len, rate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
  }
  return buf
}

function makeNoise(ctx, seconds = 2) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

class SynthMusic {
  constructor() {
    const Ctx = window.AudioContext || window.webkitAudioContext
    this.ctx = new Ctx()
    const ctx = this.ctx

    this.master = ctx.createGain()
    this.master.gain.value = 0
    const comp = ctx.createDynamicsCompressor()
    this.master.connect(comp).connect(ctx.destination)

    this.dry = ctx.createGain()
    this.dry.gain.value = 0.6
    this.dry.connect(this.master)

    const reverb = ctx.createConvolver()
    reverb.buffer = makeImpulse(ctx)
    this.wet = ctx.createGain()
    this.wet.gain.value = 0.55
    reverb.connect(this.wet).connect(this.master)
    this.bus = ctx.createGain()
    this.bus.connect(this.dry)
    this.bus.connect(reverb)

    this.noise = makeNoise(ctx)
    this.timer = null
    this.phraseIndex = 0
    this.nextTime = 0
    this.barTime = 0
  }

  startDrone() {
    const ctx = this.ctx
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 600
    const g = ctx.createGain()
    g.gain.value = 0.09
    filter.connect(g).connect(this.bus)

    ;[D4 / 4, (D4 / 4) * 1.5, D4 / 2].forEach((f, i) => {
      const o = ctx.createOscillator()
      o.type = i === 2 ? 'sine' : 'triangle'
      o.frequency.value = f
      o.detune.value = (i - 1) * 3
      const og = ctx.createGain()
      og.gain.value = i === 2 ? 0.5 : 0.8
      o.connect(og).connect(filter)
      o.start()
    })

    // slow breathing swell
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.08
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.035
    lfo.connect(lfoGain).connect(g.gain)
    lfo.start()
  }

  // Ney-like flute voice
  ney(f, t, dur) {
    const ctx = this.ctx
    const out = ctx.createGain()
    out.gain.setValueAtTime(0, t)
    out.gain.linearRampToValueAtTime(0.22, t + Math.min(0.18, dur * 0.3))
    out.gain.setValueAtTime(0.22, t + dur * 0.75)
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.35)
    out.connect(this.bus)

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = f * 3
    lp.Q.value = 0.7
    lp.connect(out)

    const o1 = ctx.createOscillator()
    o1.type = 'sine'
    o1.frequency.value = f
    const o2 = ctx.createOscillator()
    o2.type = 'triangle'
    o2.frequency.value = f * 2
    const o2g = ctx.createGain()
    o2g.gain.value = 0.18
    o1.connect(lp)
    o2.connect(o2g).connect(lp)

    // delayed vibrato
    const vib = ctx.createOscillator()
    vib.frequency.value = 5.2
    const vibDepth = ctx.createGain()
    vibDepth.gain.setValueAtTime(0, t)
    vibDepth.gain.linearRampToValueAtTime(f * 0.012, t + Math.min(dur, 0.8))
    vib.connect(vibDepth)
    vibDepth.connect(o1.frequency)
    vibDepth.connect(o2.frequency)

    // breath noise
    const n = ctx.createBufferSource()
    n.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = f * 2
    bp.Q.value = 2
    const ng = ctx.createGain()
    ng.gain.value = 0.05
    n.connect(bp).connect(ng).connect(out)

    const end = t + dur + 0.4
    ;[o1, o2, vib, n].forEach((s) => {
      s.start(t)
      s.stop(end)
    })
  }

  // Soft frame drum (daf)
  daf(t, strong) {
    const ctx = this.ctx
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(strong ? 110 : 160, t)
    o.frequency.exponentialRampToValueAtTime(55, t + 0.25)
    const g = ctx.createGain()
    g.gain.setValueAtTime(strong ? 0.35 : 0.12, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
    o.connect(g).connect(this.dry)
    o.start(t)
    o.stop(t + 0.45)

    const n = ctx.createBufferSource()
    n.buffer = this.noise
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 2500
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(strong ? 0.05 : 0.07, t)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    n.connect(hp).connect(ng).connect(this.bus)
    n.start(t)
    n.stop(t + 0.15)
  }

  schedule() {
    const ctx = this.ctx
    const horizon = ctx.currentTime + 1.5

    while (this.nextTime < horizon) {
      const phrase = PHRASES[this.phraseIndex % PHRASES.length]
      let t = this.nextTime
      for (const [name, beats] of phrase) {
        const dur = beats * BEAT
        if (name) this.ney(freq(name), t, dur * 0.95)
        t += dur
      }
      this.nextTime = t + BEAT // breath between phrases
      this.phraseIndex++
    }

    // daf pattern: dum . tek tek | dum . tek .
    while (this.barTime < horizon) {
      if (this.phraseIndex >= 2) {
        const b = this.barTime
        this.daf(b, true)
        this.daf(b + BEAT * 1.5, false)
        this.daf(b + BEAT * 2, false)
        this.daf(b + BEAT * 3, false)
      }
      this.barTime += BEAT * 4
    }
  }

  async play() {
    await this.ctx.resume()
    if (!this.started) {
      this.started = true
      this.startDrone()
      this.nextTime = this.ctx.currentTime + 1.2
      this.barTime = this.nextTime
    }
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0.8, now + 3)
    clearInterval(this.timer)
    this.timer = setInterval(() => this.schedule(), 300)
    this.schedule()
  }

  pause() {
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0, now + 0.6)
    setTimeout(() => {
      clearInterval(this.timer)
      this.ctx.suspend()
    }, 700)
  }
}

class FileMusic {
  constructor(src) {
    this.audio = new Audio(src)
    this.audio.loop = true
    this.audio.preload = 'auto' // load early so a tap starts it instantly
    this.audio.volume = 0
    this.audio.load()
  }
  async play() {
    await this.audio.play()
    clearInterval(this.fade)
    this.fade = setInterval(() => {
      this.audio.volume = Math.min(1, this.audio.volume + 0.05)
      if (this.audio.volume >= 1) clearInterval(this.fade)
    }, 100)
  }
  pause() {
    clearInterval(this.fade)
    this.audio.pause()
  }
}

const SRC = `${import.meta.env.BASE_URL}music.m4a`

// Call on page load: checks whether a custom track exists in public/.
export async function detectMusicFile() {
  try {
    const res = await fetch(SRC, { method: 'HEAD' })
    return res.ok && (res.headers.get('content-type') || '').startsWith('audio')
  } catch {
    return false
  }
}

// Creating is safe anytime; play() must run inside a user gesture unless the browser allows autoplay.
export function createMusic(useFile) {
  return useFile ? new FileMusic(SRC) : new SynthMusic()
}
