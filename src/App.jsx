import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { translations, langNames } from './i18n/translations'

const LANG_KEY = 'ggmpi-apps-lang'

function AppButton({ app, onOpen }) {
  const handleClick = () => {
    if (app.link) {
      window.open(app.link, '_blank', 'noopener,noreferrer')
      onOpen?.(app)
    }
  }

  const iconUrl = app.icon
  const iconEmoji = app.icon_emoji

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center gap-3 p-6 bg-dark-card rounded-xl 
                 hover:bg-dark-cardHover transition-all duration-200 
                 border border-dark-border hover:border-blue-500/50
                 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10
                 min-h-[140px] w-full text-left group"
    >
      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg 
                      bg-dark-bg/80 group-hover:bg-blue-500/20 transition-colors">
        {iconUrl ? (
          <img src={iconUrl} alt="" className="w-8 h-8 object-contain" />
        ) : iconEmoji ? (
          <span className="text-2xl">{iconEmoji}</span>
        ) : (
          <span className="text-2xl text-blue-400 font-bold">
            {app.name?.charAt(0) || '?'}
          </span>
        )}
      </div>
      <span className="text-white font-medium text-sm text-center line-clamp-2">
        {app.name}
      </span>
    </button>
  )
}

function App() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved && (saved === 'es' || saved === 'pt')) return saved
    return 'es'
  })

  const t = translations[lang]

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang)
  }, [lang])

  useEffect(() => {
    async function fetchApps() {
      try {
        const { data, error: err } = await supabase
          .from('apps')
          .select('*')
          .order('orden', { ascending: true, nullsFirst: false })

        if (err) throw err
        setApps(data || [])
      } catch (err) {
        setError(err.message)
        setApps([])
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-dark-border bg-dark-bg/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 
                            flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">GGMPI Apps Hub</span>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-dark-card border border-dark-border">
            {(['es', 'pt']).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  lang === l
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-cardHover'
                }`}
              >
                {langNames[l]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">{t.welcome}</h1>
          <p className="text-gray-500">{t.subtitle}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[140px] rounded-xl bg-dark-card animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6">
            <p className="text-red-400 font-medium">{t.errorTitle}</p>
            <p className="text-gray-400 text-sm mt-2">{error}</p>
            <p className="text-gray-500 text-xs mt-4">
              {t.errorHint} <code className="bg-dark-card px-1 rounded">apps</code> {t.errorHint2} <code className="bg-dark-card px-1 rounded">.env</code>.
            </p>
          </div>
        ) : apps.length === 0 ? (
          <div className="rounded-xl bg-dark-card border border-dark-border p-12 text-center">
            <p className="text-gray-500">{t.noApps}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {apps.map((app) => (
              <AppButton key={app.id} app={app} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
