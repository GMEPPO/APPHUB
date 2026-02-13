import { useRef, useState, useCallback } from 'react'
import { getIconUrl } from '../lib/supabase'

export default function AppCard({ app, index = 0, onOpen }) {
  const cardRef = useRef(null)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  const handleClick = useCallback(() => {
    if (app.link) {
      window.open(app.link, '_blank', 'noopener,noreferrer')
      onOpen?.(app)
    }
  }, [app, onOpen])

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

  const iconUrl = getIconUrl(app.icon)
  const iconEmoji = iconUrl ? null : app.icon_emoji

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
      className="app-card relative overflow-hidden flex flex-col items-center justify-center gap-3 p-6 
                 min-h-[140px] w-full text-left rounded-xl border
                 bg-[#1e2a3a] border-[#2d3d52] 
                 transition-[transform,box-shadow,border-color] duration-300 ease-out
                 hover:scale-[1.02] hover:border-blue-500/40 
                 hover:shadow-[0_12px_40px_-12px_rgba(59,130,246,0.25)]
                 active:scale-[0.98] active:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                 focus-visible:outline-blue-500
                 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100
                 group"
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 
                   group-hover:opacity-100 motion-reduce:opacity-0"
        style={spotlightStyle}
        aria-hidden
      />

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
