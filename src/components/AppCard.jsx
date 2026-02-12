import { useRef, useState, useCallback, useEffect } from 'react'

const REDIRECT_DELAY_MS = 2000

export default function AppCard({ app, index = 0, onOpen, openingText = 'Abriendo…' }) {
  const cardRef = useRef(null)
  const timerRef = useRef(null)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!app.link || isOpening) return
    setIsOpening(true)
    timerRef.current = setTimeout(() => {
      window.open(app.link, '_blank', 'noopener,noreferrer')
      onOpen?.(app)
      setIsOpening(false)
      timerRef.current = null
    }, REDIRECT_DELAY_MS)
  }, [app, onOpen, isOpening])

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMouse({ x, y })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0.5, y: 0.5 })
  }, [])

  const iconUrl = app.icon
  const iconEmoji = app.icon_emoji

  const spotlightStyle = {
    background: `
      radial-gradient(
        400px circle at ${mouse.x * 100}% ${mouse.y * 100}%,
        rgba(59, 130, 246, 0.12),
        transparent 40%
      )
    `,
  }

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={isOpening}
      className={`app-card relative overflow-hidden flex flex-col items-center justify-center gap-3 p-6 
                 min-h-[140px] w-full text-left rounded-xl border
                 bg-[#1e2a3a] border-[#2d3d52] 
                 transition-[transform,box-shadow,border-color] duration-300 ease-out
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                 focus-visible:outline-blue-500
                 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100
                 group
                 ${isOpening 
                   ? 'border-blue-500/60 shadow-[0_0_24px_rgba(59,130,246,0.3)] cursor-wait' 
                   : 'hover:scale-[1.02] hover:border-blue-500/40 hover:shadow-[0_12px_40px_-12px_rgba(59,130,246,0.25)] active:scale-[0.98] active:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)]'}`}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 
                   group-hover:opacity-100 motion-reduce:opacity-0"
        style={spotlightStyle}
        aria-hidden
      />

      {/* Opening overlay */}
      {isOpening && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1e2a3a]/95 z-10 animate-pulse"
          aria-live="polite"
        >
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-400 font-medium">{openingText}</span>
        </div>
      )}

      {/* Card content */}
      <div
        className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg 
                   bg-[#0f1419]/70 group-hover:bg-blue-500/15 transition-colors duration-300"
      >
        {iconUrl ? (
          <img src={iconUrl} alt="" className="w-10 h-10 object-contain" />
        ) : iconEmoji ? (
          <span className="text-4xl">{iconEmoji}</span>
        ) : (
          <span className="text-4xl text-blue-400 font-bold">
            {app.name?.charAt(0) || '?'}
          </span>
        )}
      </div>
      <span className="relative text-white font-medium text-sm text-center line-clamp-2">
        {app.name}
      </span>
    </button>
  )
}
