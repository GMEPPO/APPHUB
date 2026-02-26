import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { translations, langNames } from './i18n/translations'
import AppCard from './components/AppCard'

const LANG_KEY = 'ggmpi-apps-lang'

const CATEGORY_ALL = null // "Todos" = mostrar todos

// Clave de categoría para filtrar (category_es)
function getCategoryKey(a) {
  return a.category_es ?? ''
}

function App() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL)
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved && (saved === 'es' || saved === 'pt')) return saved
    return 'es'
  })

  const t = translations[lang]

  // Lista única de categorías con etiquetas en es y pt (usa category_es como clave)
  const categoryMap = {}
  apps.forEach((a) => {
    const key = getCategoryKey(a)
    if (!key) return
    if (!categoryMap[key]) {
      categoryMap[key] = {
        key,
        labelEs: a.category_es ?? key,
        labelPt: a.category_pt ?? a.category_es ?? key,
      }
    }
  })
  const categories = Object.values(categoryMap).sort((a, b) =>
    (a.labelEs || a.key).localeCompare(b.labelEs || b.key)
  )

  const filteredApps =
    selectedCategory === CATEGORY_ALL
      ? apps
      : apps.filter((a) => getCategoryKey(a) === selectedCategory)

  const selectedCat = categories.find((c) => c.key === selectedCategory)
  const selectedCategoryLabel =
    selectedCategory === CATEGORY_ALL
      ? null
      : (lang === 'pt' ? selectedCat?.labelPt : selectedCat?.labelEs) ?? selectedCategory

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
    <div className="min-h-screen bg-[#0a0e12] text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#2d3d52] bg-[#0a0e12]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
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
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#1e2a3a] border border-[#2d3d52]">
              {(['es', 'pt']).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    lang === l
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#243044]'
                  }`}
                >
                  {langNames[l]}
                </button>
              ))}
            </div>
          </div>
          {/* Filtro por categoría: General siempre primero, luego categorías de Supabase */}
          {!loading && (
            <nav className="mt-4 pt-4 border-t border-[#2d3d52]" aria-label="Categorías">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCategory(CATEGORY_ALL)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === CATEGORY_ALL
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#1e2a3a] text-gray-400 hover:text-white hover:bg-[#243044] border border-[#2d3d52]'
                  }`}
                >
                  {t.categoryAll}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-[#1e2a3a] text-gray-400 hover:text-white hover:bg-[#243044] border border-[#2d3d52]'
                    }`}
                  >
                    {lang === 'pt' ? cat.labelPt : cat.labelEs}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 opacity-0 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">
            {selectedCategoryLabel ?? t.welcome}
          </h1>
          <p className="text-gray-500">
            {selectedCategoryLabel ? t.subtitleCategory : t.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[200px] rounded-xl bg-[#1e2a3a] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 opacity-0 animate-fade-in">
            <p className="text-red-400 font-medium">{t.errorTitle}</p>
            <p className="text-gray-400 text-sm mt-2">{error}</p>
            <p className="text-gray-500 text-xs mt-4">
              {t.errorHint} <code className="bg-[#1e2a3a] px-1 rounded">apps</code> {t.errorHint2} <code className="bg-[#1e2a3a] px-1 rounded">.env</code>.
            </p>
          </div>
        ) : apps.length === 0 ? (
          <div className="rounded-xl bg-[#1e2a3a] border border-[#2d3d52] p-12 text-center opacity-0 animate-fade-in">
            <p className="text-gray-500">{t.noApps}</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="rounded-xl bg-[#1e2a3a] border border-[#2d3d52] p-12 text-center opacity-0 animate-fade-in">
            <p className="text-gray-500">{t.noAppsInCategory}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                className="opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${60 + index * 50}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <AppCard app={app} index={index} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
