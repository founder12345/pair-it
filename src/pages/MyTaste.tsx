import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { FlavorProfile } from '../data/types'

const defaultProfile: FlavorProfile = {
  fruity: 5, earthy: 5, floral: 4, spicy: 4, rich: 6, acidic: 5,
}

const dimensions: (keyof FlavorProfile)[] = ['fruity', 'earthy', 'floral', 'spicy', 'rich', 'acidic']

export default function MyTaste() {
  const [profile, setProfile] = useState<FlavorProfile>(defaultProfile)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('pairit-taste')
    if (stored) {
      try { setProfile(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

  const update = (key: keyof FlavorProfile, value: number) => {
    setProfile(p => ({ ...p, [key]: value }))
    setSaved(false)
  }

  const persist = () => {
    localStorage.setItem('pairit-taste', JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const points = dimensions.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2
    const r = (profile[dim] / 10) * 80
    return { x: 100 + Math.cos(angle) * r, y: 100 + Math.sin(angle) * r, label: dim }
  })
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className="mb-12">
        <p className="text-[#85847E] text-xs tracking-[0.2em] uppercase mb-3">Personal</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">My Taste</h1>
        <p className="text-[#85847E] leading-relaxed">
          Shape a visual flavor profile. This becomes a quiet reference for future recommendations.
        </p>
      </div>

      <div className="bg-white border border-[#EAE7E0] p-8 md:p-12 mb-10">
        <div className="flex justify-center mb-10">
          <svg viewBox="0 0 200 200" className="w-56 h-56 md:w-64 md:h-64">
            {[20, 40, 60, 80].map((r) => (
              <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#EAE7E0" strokeWidth="0.75" />
            ))}
            {dimensions.map((_, i) => {
              const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2
              return (
                <line key={i} x1="100" y1="100" x2={100 + Math.cos(angle) * 80} y2={100 + Math.sin(angle) * 80} stroke="#EAE7E0" strokeWidth="0.75" />
              )
            })}
            <motion.path d={pathD} fill="rgba(112, 45, 59, 0.12)" stroke="#702D3B" strokeWidth="1.5" initial={false} animate={{ d: pathD }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} />
            {points.map((p) => {
              const angle = Math.atan2(p.y - 100, p.x - 100)
              return (
                <text key={p.label} x={100 + Math.cos(angle) * 96} y={100 + Math.sin(angle) * 96} textAnchor="middle" dominantBaseline="middle" className="fill-[#85847E]" style={{ fontSize: 8 }}>
                  {p.label}
                </text>
              )
            })}
          </svg>
        </div>

        <div className="space-y-6">
          {dimensions.map((dim) => (
            <div key={dim}>
              <div className="flex justify-between text-sm mb-2">
                <span className="capitalize text-[#20211F]">{dim}</span>
                <span className="text-[#85847E]">{profile[dim]}/10</span>
              </div>
              <input type="range" min={0} max={10} value={profile[dim]} onChange={(e) => update(dim, Number(e.target.value))} className="w-full accent-[#702D3B] h-1.5 bg-[#EAE7E0] rounded-full appearance-none cursor-pointer" />
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4">
          <button onClick={persist} className="px-6 py-3 bg-[#702D3B] text-[#F7F5F0] text-sm tracking-wide hover:bg-[#5a2430] transition-colors">Save profile</button>
          {saved && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#777E65]">Saved locally</motion.span>}
        </div>
      </div>

      <div className="border border-[#EAE7E0] bg-[#F7F5F0] p-8 text-center">
        <Heart size={20} strokeWidth={1.25} className="mx-auto mb-3 text-[#85847E]" />
        <p className="text-sm text-[#85847E] leading-relaxed max-w-sm mx-auto">
          Saved pairings and collections will appear here once you start exploring. Data is stored locally in this demonstration.
        </p>
      </div>
    </div>
  )
}
