// Single-stroke line illustrations. Paths use pathLength=1 so CSS can "draw" them.
const P = (props) => <path pathLength="1" {...props} />

export function Rings({ className = '' }) {
  return (
    <svg className={`line-art ${className}`} viewBox="0 0 120 76" aria-hidden="true">
      <P d="M48 50 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0" />
      <P d="M74 50 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0" />
      <P d="M68 24 L74 16 L80 24 L74 31 Z" className="accent" />
      <P d="M74 4 V9 M63 9 L66 12 M85 9 L82 12" className="accent" />
    </svg>
  )
}

export function Mosque({ className = '' }) {
  return (
    <svg className={`line-art ${className}`} viewBox="0 0 200 124" aria-hidden="true">
      <P d="M6 118 H194" />
      <P d="M52 118 V74 H148 V118" />
      <P d="M60 74 Q60 34 100 26 Q140 34 140 74" />
      <P d="M100 26 V12" />
      <P d="M95 10 A6 6 0 1 0 103 4 A4.5 4.5 0 1 1 95 10 Z" className="accent" />
      <P d="M88 118 V96 Q100 82 112 96 V118" />
      <P d="M66 104 V92 Q72 84 78 92 V104 M122 104 V92 Q128 84 134 92 V104" />
      <P d="M164 118 V46 H176 V118 M161 66 H179 M164 46 L170 28 L176 46 M170 28 V18" />
      <P d="M24 118 V46 H36 V118 M21 66 H39 M24 46 L30 28 L36 46 M30 28 V18" />
    </svg>
  )
}

export function Hourglass({ className = '' }) {
  return (
    <svg className={`line-art ${className}`} viewBox="0 0 48 60" aria-hidden="true">
      <P d="M10 4 H38 M10 56 H38" />
      <P d="M13 4 Q13 22 24 30 Q13 38 13 56 M35 4 Q35 22 24 30 Q35 38 35 56" />
      <P d="M18 50 Q24 42 30 50 Z M24 30 V44" className="accent sand" />
    </svg>
  )
}

const ICONS = {
  arch: (
    <>
      <P d="M10 44 V20 Q24 2 38 20 V44 M6 44 H42" />
      <P d="M24 36 C16 30 16 24 20 22 C22 21 24 23 24 25 C24 23 26 21 28 22 C32 24 32 30 24 36 Z" className="accent" />
    </>
  ),
  rings: (
    <>
      <P d="M19 30 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0" />
      <P d="M31 30 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0" />
      <P d="M28 15 L31 11 L34 15 L31 19 Z" className="accent" />
    </>
  ),
  moon: (
    <>
      <P d="M26 8 A17 17 0 1 0 41 33 A13 13 0 1 1 26 8 Z" />
      <P d="M38 10 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z" className="accent" />
    </>
  ),
}

export function ProgramIcon({ name, className = '' }) {
  return (
    <svg className={`line-art ${className}`} viewBox="0 0 48 48" aria-hidden="true">
      {ICONS[name] ?? ICONS.arch}
    </svg>
  )
}

// "Scroll down" guide: a vine that grows into an arrow, with cascading chevrons.
export function ScrollVine() {
  return (
    <svg className="scroll-vine" viewBox="0 0 40 74" aria-hidden="true">
      <path className="sv-stem" pathLength="1" d="M20 2 C14 14 26 24 20 36 C16 44 20 50 20 56" />
      <path className="sv-leaf l1" d="M20 14 C26 10 30 12 31 15 C27 18 23 17 20 14Z" />
      <path className="sv-leaf l2" d="M19 30 C13 26 9 28 8 31 C12 34 16 33 19 30Z" />
      <path className="sv-chev c1" d="M12 56 L20 64 L28 56" />
      <path className="sv-chev c2" d="M12 64 L20 72 L28 64" />
    </svg>
  )
}
