import { forwardRef } from 'react'
import { PageActiveContext } from './Reveal'

const PageSection = forwardRef(function PageSection(
  {
    index,
    activeIndex,
    total,
    tinted = false,
    hasVines = false,
    isHero = false,
    isFooter = false,
    corners,
    onTurnNext,
    children,
  },
  ref
) {
  const isActive = index === activeIndex

  return (
    <PageActiveContext.Provider value={isActive}>
      <article
        ref={ref}
        className={[
          'book-leaf',
          isActive ? 'is-active' : '',
          tinted ? 'tinted' : '',
          hasVines ? 'has-vines' : '',
          isHero ? 'leaf-hero' : '',
          isFooter ? 'leaf-footer' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          '--leaf-z': 20 + index,
          '--turn': index === 0 ? 1 : 0,
          '--swing': 0,
          '--under-turn': 0,
        }}
        aria-hidden={!isActive}
      >
        {/* Front face of the page (sweeps open from left spine to right fore-edge) */}
        {corners && <div className="page-corners">{corners}</div>}
        <div className="book-leaf-front">
          <span className="page-spine" aria-hidden="true" />
          <span className="page-sheen" aria-hidden="true" />
          <span className="page-under-shadow" aria-hidden="true" />

          <div className="page-scroll-area">
            <div className="page-inner">{children}</div>
          </div>

          {index < total - 1 && (
            <button
              type="button"
              className="page-curl"
              onClick={onTurnNext}
              aria-label="الصفحة التالية"
              tabIndex={isActive ? 0 : -1}
            />
          )}
        </div>

        {/* Back face of the leaf (seen near the left spine at the start of the turn) */}
        <div className="book-leaf-back" aria-hidden="true">
          <div className="back-ornament" />
        </div>
      </article>
    </PageActiveContext.Provider>
  )
})

export default PageSection
