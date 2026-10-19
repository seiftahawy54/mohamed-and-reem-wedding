import { createContext, useContext, useEffect, useRef, useState } from 'react'

export const PageActiveContext = createContext(null)

export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null)
  const pageActive = useContext(PageActiveContext)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (pageActive !== null) {
      if (pageActive) setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [pageActive])

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'shown' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
