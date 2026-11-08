import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { dishes } from '../data/dishes'
import { beverages } from '../data/beverages'
import { pairings } from '../data/pairings'
import HeroVisual from '../components/HeroVisual'

const featuredPairings = pairings
  .filter(p => p.category === 'classic')
  .slice(0, 4)
  .map(p => {
    const dish = dishes.find(d => d.id === p.dishId)!
    const beverage = beverages.find(b => b.id === p.beverageId)!
    return { pairing: p, dish, beverage }
  })
  .filter(x => x.dish && x.beverage)

const cuisines = [
  { name: 'French', count: dishes.filter(d => d.cuisine.includes('French')).length },
  { name: 'Italian', count: dishes.filter(d => d.cuisine.includes('Italian')).length },
  { name: 'Thai', count: dishes.filter(d => d.cuisine.includes('Thai')).length },
  { name: 'Chinese', count: dishes.filter(d => d.cuisine.includes('Chinese')).length },
  { name: 'Moroccan', count: dishes.filter(d => d.cuisine.includes('Moroccan')).length },
]

export default function Discover() {
  return (
    <div>
      <section className="relative min-h-[85vh] flex flex-col md:flex-row items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F0] via-[#F7F5F0] to-[#EAE7E0]/40 pointer-events-none" />
        <div className="relative z-10 w-full md:w-1/2 px-6 md:px-12 lg:px-16 py-16 md:py-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-[#85847E] text-xs tracking-[0.25em] uppercase mb-6">Culinary discovery</p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#20211F] mb-6">
              Every dish<br />has its match.
            </h1>
            <p className="text-[#85847E] text-base md:text-lg leading-relaxed max-w-md mb-10">
              Explore the art of pairing. Discover the flavors, origins and culinary science behind exceptional combinations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/pair" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#702D3B] text-[#F7F5F0] text-sm tracking-wide hover:bg-[#5a2430] transition-colors">
                Explore pairings <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
              <Link to="/explore" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#20211F]/20 text-[#20211F] text-sm tracking-wide hover:border-[#20211F]/50 transition-colors">
                Discover beverages
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-[85vh]">
          <HeroVisual />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#85847E] text-xs tracking-[0.2em] uppercase mb-3">Editorial</p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Featured pairings</h2>
          </div>
          <Link to="/pair" className="hidden md:inline-flex items-center gap-1.5 text-sm text-[#702D3B] hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {featuredPairings.map(({ pairing, dish, beverage }, i) => (
            <motion.article key={pairing.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="group">
              <div className="aspect-[16/10] bg-[#EAE7E0] mb-5 flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="font-serif text-2xl text-[#20211F]/80 mb-1">{dish.name}</p>
                  <p className="text-[#85847E] text-sm">×</p>
                  <p className="font-serif text-xl text-[#702D3B] mt-1">{beverage.name}</p>
                </div>
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#85847E] mb-2">{pairing.category}</p>
              <h3 className="font-serif text-xl mb-2 group-hover:text-[#702D3B] transition-colors">{dish.name} & {beverage.name}</h3>
              <p className="text-[#85847E] text-sm leading-relaxed line-clamp-2">{pairing.explanation}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-[#EAE7E0]/50 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <p className="text-[#85847E] text-xs tracking-[0.2em] uppercase mb-3">By origin</p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-12">Explore by cuisine</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cuisines.map((c) => (
              <Link key={c.name} to="/pair" className="bg-[#F7F5F0] p-6 md:p-8 hover:bg-white transition-colors group">
                <p className="font-serif text-xl mb-1 group-hover:text-[#702D3B] transition-colors">{c.name}</p>
                <p className="text-[#85847E] text-xs">{c.count} dishes</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
        <p className="text-[#85847E] text-xs tracking-[0.2em] uppercase mb-4">Insight</p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 leading-snug">Acidity is the quiet architect of great pairings.</h2>
        <p className="text-[#85847E] leading-relaxed mb-8">
          Whether cutting through the richness of a slow-braised stew or refreshing the palate after foie gras, acidity is often the difference between a good match and a memorable one.
        </p>
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-[#702D3B] hover:underline">
          Explore wine regions <ArrowRight size={14} />
        </Link>
      </section>

      <footer className="border-t border-[#EAE7E0] py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg">PAIR IT</p>
          <p className="text-[#85847E] text-xs tracking-wide">Demonstration data · Please drink responsibly · For adults of legal age</p>
        </div>
      </footer>
    </div>
  )
}
