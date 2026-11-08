import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Upload, X, ChevronRight, AlertCircle } from 'lucide-react'
import { findPairingsForDish, searchDishes } from '../lib/pairingEngine'
import type { PairingResult } from '../lib/pairingEngine'
import { dishes } from '../data/dishes'
import { cn } from '../lib/utils'

type Mode = 'search' | 'upload' | 'manual'

export default function Pair() {
  const [mode, setMode] = useState<Mode>('search')
  const [query, setQuery] = useState('')
  const [selectedDishName, setSelectedDishName] = useState('')
  const [results, setResults] = useState<PairingResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [extractedDishes, setExtractedDishes] = useState<string[]>([])
  const [manualIngredients, setManualIngredients] = useState('')
  const [manualMethod, setManualMethod] = useState('')

  const suggestions = useMemo(() => searchDishes(query), [query])

  const runPairing = (dishName: string) => {
    setLoading(true)
    setSelectedDishName(dishName)
    setTimeout(() => {
      setResults(findPairingsForDish(dishName))
      setLoading(false)
    }, 600)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadPreview(URL.createObjectURL(file))
    setLoading(true)
    setTimeout(() => {
      setExtractedDishes(['Beef Bourguignon', 'Grilled Salmon with Dill', 'Mushroom Risotto', 'Roast Duck with Cherry Sauce'])
      setLoading(false)
    }, 1200)
  }

  const clearResults = () => {
    setResults(null)
    setSelectedDishName('')
    setUploadPreview(null)
    setExtractedDishes([])
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className="mb-12">
        <p className="text-[#85847E] text-xs tracking-[0.2em] uppercase mb-3">Core experience</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Pairing workspace</h1>
        <p className="text-[#85847E] max-w-xl leading-relaxed">
          Enter a dish, upload a menu photograph, or describe ingredients. The engine evaluates flavor structure and culinary context.
        </p>
      </div>

      <div className="flex gap-1 mb-8 border-b border-[#EAE7E0]">
        {([{ id: 'search' as Mode, label: 'Search dish' }, { id: 'upload' as Mode, label: 'Menu scanner' }, { id: 'manual' as Mode, label: 'Describe' }]).map((t) => (
          <button key={t.id} onClick={() => { setMode(t.id); clearResults() }} className={cn('px-5 py-3 text-sm tracking-wide relative', mode === t.id ? 'text-[#702D3B]' : 'text-[#85847E] hover:text-[#20211F]')}>
            {t.label}
            {mode === t.id && <motion.div layoutId="pair-tab" className="absolute bottom-0 left-0 right-0 h-px bg-[#702D3B]" />}
          </button>
        ))}
      </div>

      <div className="mb-12">
        {mode === 'search' && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#85847E]" size={18} strokeWidth={1.5} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) runPairing(query.trim()) }} placeholder="Try “Beef Bourguignon”, “oysters”, “Thai green curry”…" className="w-full pl-12 pr-4 py-4 bg-white border border-[#EAE7E0] text-[#20211F] placeholder:text-[#85847E]/70 focus:outline-none focus:border-[#702D3B]/40" />
            {query && suggestions.length > 0 && !results && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#EAE7E0] shadow-lg">
                {suggestions.map((d) => (
                  <button key={d.id} onClick={() => { setQuery(d.name); runPairing(d.name) }} className="w-full text-left px-5 py-3 text-sm hover:bg-[#F7F5F0] flex items-center justify-between">
                    <span>{d.name}</span>
                    <span className="text-[#85847E] text-xs">{d.cuisine}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {dishes.slice(0, 6).map((d) => (
                <button key={d.id} onClick={() => { setQuery(d.name); runPairing(d.name) }} className="px-3 py-1.5 text-xs tracking-wide border border-[#EAE7E0] text-[#85847E] hover:border-[#702D3B]/40 hover:text-[#702D3B]">{d.name}</button>
              ))}
            </div>
          </div>
        )}

        {mode === 'upload' && (
          <div>
            {!uploadPreview ? (
              <label className="flex flex-col items-center justify-center gap-4 py-16 border border-dashed border-[#EAE7E0] bg-white cursor-pointer hover:border-[#702D3B]/30">
                <Upload size={28} strokeWidth={1.25} className="text-[#85847E]" />
                <div className="text-center">
                  <p className="text-sm text-[#20211F] mb-1">Upload a menu photograph</p>
                  <p className="text-xs text-[#85847E]">JPG, PNG · We’ll extract dish names for you to confirm</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-[16/9] max-h-64 bg-[#EAE7E0] overflow-hidden">
                  <img src={uploadPreview} alt="Menu preview" className="w-full h-full object-cover" />
                  <button onClick={() => { setUploadPreview(null); setExtractedDishes([]) }} className="absolute top-3 right-3 p-2 bg-[#191A18]/70 text-white rounded-full"><X size={16} /></button>
                </div>
                {loading ? <p className="text-sm text-[#85847E] animate-pulse">Extracting dishes…</p> : extractedDishes.length > 0 && (
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-[#85847E] mb-3">Recognized dishes — select one</p>
                    <div className="space-y-2">
                      {extractedDishes.map((name) => (
                        <button key={name} onClick={() => runPairing(name)} className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-[#EAE7E0] hover:border-[#702D3B]/40 text-left">
                          <span className="text-sm">{name}</span>
                          <ChevronRight size={16} className="text-[#85847E]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {mode === 'manual' && (
          <div className="space-y-4">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Dish name" className="w-full px-4 py-3.5 bg-white border border-[#EAE7E0] focus:outline-none focus:border-[#702D3B]/40" />
            <textarea value={manualIngredients} onChange={(e) => setManualIngredients(e.target.value)} placeholder="Ingredients (comma-separated)" rows={2} className="w-full px-4 py-3.5 bg-white border border-[#EAE7E0] focus:outline-none focus:border-[#702D3B]/40 resize-none" />
            <input type="text" value={manualMethod} onChange={(e) => setManualMethod(e.target.value)} placeholder="Cooking method" className="w-full px-4 py-3.5 bg-white border border-[#EAE7E0] focus:outline-none focus:border-[#702D3B]/40" />
            <button onClick={() => query.trim() && runPairing(query.trim())} disabled={!query.trim()} className="px-6 py-3 bg-[#702D3B] text-[#F7F5F0] text-sm tracking-wide disabled:opacity-40 hover:bg-[#5a2430]">Generate pairings</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center">
            <div className="inline-block w-6 h-6 border border-[#702D3B]/30 border-t-[#702D3B] rounded-full animate-spin mb-4" />
            <p className="text-sm text-[#85847E]">Analyzing flavor structure…</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[#85847E] mb-1">Results for</p>
                <h2 className="font-serif text-2xl md:text-3xl">{selectedDishName}</h2>
              </div>
              <button onClick={clearResults} className="text-sm text-[#85847E] hover:text-[#20211F]">Clear</button>
            </div>
            <div className="space-y-10">
              {(['classic', 'alternative', 'unexpected'] as const).map((cat) => {
                const items = results.filter(r => r.category === cat)
                if (items.length === 0) return null
                return (
                  <div key={cat}>
                    <p className="text-[11px] tracking-[0.2em] uppercase text-[#85847E] mb-4">{cat}</p>
                    <div className="space-y-6">
                      {items.map((r) => (
                        <article key={r.beverage.id} className="bg-white border border-[#EAE7E0] p-6 md:p-8">
                          <div className="flex flex-col md:flex-row md:items-start gap-6">
                            <div className="flex-1">
                              <div className="flex items-baseline gap-3 mb-2">
                                <h3 className="font-serif text-xl md:text-2xl">{r.beverage.name}</h3>
                                <span className="text-xs text-[#85847E]">{r.beverage.category}</span>
                              </div>
                              <p className="text-sm text-[#85847E] mb-1">{r.beverage.region}, {r.beverage.country}{r.beverage.grapeVariety && ` · ${r.beverage.grapeVariety}`}</p>
                              {r.beverage.verifiedPriceRange && <p className="text-xs text-[#85847E] mb-4">Indicative range: {r.beverage.verifiedPriceRange}</p>}
                              <p className="text-[#20211F] leading-relaxed mb-4">{r.explanation}</p>
                              <ul className="space-y-1 mb-4">
                                {r.notes.map((n, i) => (
                                  <li key={i} className="text-sm text-[#85847E] flex gap-2"><span className="text-[#777E65]">·</span>{n}</li>
                                ))}
                              </ul>
                              {r.potentialIssues.length > 0 && (
                                <div className="flex items-start gap-2 text-sm text-[#85847E]">
                                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                  <span>{r.potentialIssues.join(' ')}</span>
                                </div>
                              )}
                              {r.isEstimate && <p className="mt-3 text-[11px] text-[#85847E]/80 italic">Generated estimate · not a verified expert rating</p>}
                            </div>
                            <div className="md:w-40 shrink-0">
                              <div className="aspect-square bg-[#EAE7E0] flex items-center justify-center">
                                <span className="font-serif text-3xl text-[#702D3B]/40">{r.beverage.category[0]}</span>
                              </div>
                              <p className="mt-2 text-[10px] tracking-wide text-[#85847E] text-center">{r.beverage.aromaProfile.slice(0, 3).join(' · ')}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
