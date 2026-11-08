import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Wine, BookOpen, Heart, User, Menu, X } from 'lucide-react'
import { cn } from './lib/utils'
import Discover from './pages/Discover'
import Pair from './pages/Pair'
import Explore from './pages/Explore'
import MyTaste from './pages/MyTaste'
import Profile from './pages/Profile'
import AgeGate from './components/AgeGate'

const navItems = [
  { path: '/', label: 'Discover', icon: Compass },
  { path: '/pair', label: 'Pair', icon: Wine },
  { path: '/explore', label: 'Explore', icon: BookOpen },
  { path: '/my-taste', label: 'My Taste', icon: Heart },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function App() {
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const stored = localStorage.getItem('pairit-age-verified')
    if (stored === 'true') setAgeVerified(true)
    else if (stored === 'false') setAgeVerified(false)
    else setAgeVerified(null)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  if (ageVerified === null) {
    return (
      <AgeGate
        onConfirm={() => {
          localStorage.setItem('pairit-age-verified', 'true')
          setAgeVerified(true)
        }}
        onDeny={() => {
          localStorage.setItem('pairit-age-verified', 'false')
          setAgeVerified(false)
        }}
      />
    )
  }

  if (ageVerified === false) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-3xl text-[#20211F] mb-4">Age Restricted</h1>
          <p className="text-[#85847E] leading-relaxed">
            PAIR IT is intended for adults of legal drinking age in their region.
            We cannot provide beverage pairing content to underage users.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#20211F] flex flex-col">
      <header className="hidden md:block sticky top-0 z-50 bg-[#F7F5F0]/90 backdrop-blur-md border-b border-[#EAE7E0]">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="font-serif text-2xl tracking-tight text-[#20211F]">
            PAIR IT
          </NavLink>
          <nav className="flex items-center gap-10">
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  cn(
                    'text-sm tracking-wide transition-colors duration-200',
                    isActive ? 'text-[#702D3B]' : 'text-[#85847E] hover:text-[#20211F]'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <header className="md:hidden sticky top-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#EAE7E0]">
        <div className="px-5 h-14 flex items-center justify-between">
          <NavLink to="/" className="font-serif text-xl tracking-tight">
            PAIR IT
          </NavLink>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 -mr-2 text-[#20211F]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#EAE7E0] bg-[#F7F5F0]"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {navItems.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      cn(
                        'py-3 text-base',
                        isActive ? 'text-[#702D3B] font-medium' : 'text-[#85847E]'
                      )
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Discover />} />
            <Route path="/pair" element={<Pair />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/my-taste" element={<MyTaste />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-md border-t border-[#EAE7E0]">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] tracking-wide',
                  isActive ? 'text-[#702D3B]' : 'text-[#85847E]'
                )
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
