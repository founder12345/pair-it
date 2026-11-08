import { useState } from 'react'
import { motion } from 'framer-motion'
import { beverages } from '../data/beverages'
import { cn } from '../lib/utils'

const regions = [
  { name: 'Bordeaux', country: 'France', lat: 44.84, lng: -0.58, desc: 'Home of Cabernet-dominant and Merlot-dominant blends of global renown.' },
  { name: 'Burgundy', country: 'France', lat: 47.05, lng: 4.84, desc: 'Pinot Noir and Chardonnay on limestone and clay. Site expression is paramount.' },
  { name: 'Champagne', country: 'France', lat: 49.25, lng: 4.03, desc: 'The northernmost major sparkling region. Chalk soils and cool climate.' },
  { name: 'Tuscany', country: 'Italy', lat: 43.77, lng: 11.25, desc: 'Sangiovese country — Chianti, Brunello, Super Tuscans.' },
  { name: 'Rioja', country: 'Spain', lat: 42.46, lng: -2.44, desc: 'Tempranillo aged in oak, often with distinctive savory complexity.' },
  { name: 'Napa Valley', country: 'USA', lat: 38.50, lng: -122.32, desc: 'Cabernet Sauvignon of intensity and polish; also excellent Chardonnay.' },
  { name: 'Mosel', country: 'Germany', lat: 49.90, lng: 7.05, desc: 'Steep slate slopes producing some of the world\'s most precise Riesling.' },
  { name: 'Rías Baixas', country: 'Spain', lat: 42.23, lng: -8.71, desc: 'Cool, Atlantic-influenced home of Albariño.' },
]

const grapes = [
  { name: 'Cabernet Sauvignon', color: 'red', notes: 'Blackcurrant, cedar, graphite' },
  { name: 'Pinot Noir', color: 'red', notes: 'Red cherry, rose, forest floor' },
  { name: 'Nebbiolo', color: 'red', notes: 'Rose, tar, cherry, anise' },
  { name: 'Chardonnay', color: 'white', notes: 'Citrus, apple, butter, oak (style dependent)' },
  { name: 'Sauvignon Blanc', color: 'white', notes: 'Gooseberry, citrus, flint' },
  { name: 'Riesling', color: 'white', notes: 'Peach, lime, slate, petrol with age' },
  { name: 'Syrah / Shiraz', color: 'red', notes: 'Blackberry, pepper, smoke' },
  { name: 'Tempranillo', color: 'red', notes: 'Strawberry, leather, tobacco' },
]

type Tab = 'regions' | 'grapes' | 'beverages'

export default function Explore() {
  const [tab, setTab] = useState<Tab>('regions')
  const [selectedRegion, setSelectedRegion] = useState(regions[0])

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className="mb-12">
        <p className="text-[#85847E] text-xs tracking-[0.2em] uppercase mb-3">Encyclopedia</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Explore</h1>
        <p className="text-[#85847E] max-w-xl leading-relaxed">
          Regions, grape varieties and a curated selection of beverages.
        </p>
      </div>

      <div className="flex gap-1 mb-10 border-b border-[#EAE7E0]">
        {([{ id: 'regions' as Tab, label: 'Wine regions' }, { id: 'grapes' as Tab, label: 'Grape varieties' }, { id: 'beverages' as Tab, label: 'Beverages' }]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn('px-5 py-3 text-sm tracking-wide relative', tab === t.id ? 'text-[#702D3B]' : 'text-[#85847E] hover:text-[#20211F]')}>
            {t.label}
            {tab === t.id && <motion.div layoutId="explore-tab" className="absolute bottom-0 left-0 right-0 h-px bg-[#702D3B]" />}
          </button>
        ))}
      </div>

      {tab === 'regions' && (
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-1">
            {regions.map((r) => (
              <button key={r.name} onClick={() => setSelectedRegion(r)} className={cn('w-full text-left px-4 py-3 text-sm transition-colors', selectedRegion.name === r.name ? 'bg-white text-[#702D3B] border-l-2 border-[#702D3B]' : 'text-[#85847E] hover:text-[#20211F] hover:bg-white/50')}>
                <span className="font-medium">{r.name}</span>
                <span className="text-[#85847E] ml-2 text-xs">{r.country}</span>
              </button>
            ))}
          </div>
          <div className="md:col-span-3">
            <div className="bg-white border border-[#EAE7E0] p-8 md:p-10">
              <p className="text-xs tracking-[0.15em] uppercase text-[#85847E] mb-2">{selectedRegion.country}</p>
              <h2 className="font-serif text-3xl mb-4">{selectedRegion.name}</h2>
              <p className="text-[#85847E] leading-relaxed mb-6">{selectedRegion.desc}</p>
              <div className="flex gap-6 text-sm">
                <div><p className="text-[10px] tracking-wide uppercase text-[#85847E] mb-1">Latitude</p><p>{selectedRegion.lat.toFixed(2)}°</p></div>
                <div><p className="text-[10px] tracking-wide uppercase text-[#85847E] mb-1">Longitude</p><p>{selectedRegion.lng.toFixed(2)}°</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'grapes' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {grapes.map((g) => (
            <div key={g.name} className="bg-white border border-[#EAE7E0] p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('w-2.5 h-2.5 rounded-full', g.color === 'red' ? 'bg-[#702D3B]' : 'bg-[#777E65]')} />
                <p className="text-[10px] tracking-wide uppercase text-[#85847E]">{g.color}</p>
              </div>
              <h3 className="font-serif text-xl mb-2">{g.name}</h3>
              <p className="text-sm text-[#85847E]">{g.notes}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'beverages' && (
        <div className="space-y-3">
          {beverages.map((b) => (
            <div key={b.id} className="bg-white border border-[#EAE7E0] px-6 py-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <div className="flex-1">
                <h3 className="font-serif text-lg">{b.name}</h3>
                <p className="text-sm text-[#85847E]">{b.category} · {b.region}, {b.country}</p>
              </div>
              <p className="text-xs text-[#85847E] md:text-right max-w-xs">{b.aromaProfile.slice(0, 4).join(' · ')}</p>
              {b.verifiedPriceRange && <p className="text-xs text-[#85847E] shrink-0">{b.verifiedPriceRange}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
