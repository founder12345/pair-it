import { useState, useEffect } from 'react'

export default function Profile() {
  const [ageVerified, setAgeVerified] = useState(true)

  useEffect(() => {
    setAgeVerified(localStorage.getItem('pairit-age-verified') === 'true')
  }, [])

  const resetAge = () => {
    localStorage.removeItem('pairit-age-verified')
    window.location.reload()
  }

  const clearTaste = () => {
    localStorage.removeItem('pairit-taste')
    alert('Taste profile cleared.')
  }

  return (
    <div className="max-w-xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className="mb-12">
        <p className="text-[#85847E] text-xs tracking-[0.2em] uppercase mb-3">Account</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Profile</h1>
      </div>

      <div className="space-y-6">
        <section className="bg-white border border-[#EAE7E0] p-6 md:p-8">
          <h2 className="font-serif text-xl mb-4">Age verification</h2>
          <p className="text-sm text-[#85847E] mb-4">
            Status: {ageVerified ? 'Verified (legal age confirmed)' : 'Not verified'}
          </p>
          <button
            onClick={resetAge}
            className="text-sm text-[#702D3B] hover:underline"
          >
            Reset age gate
          </button>
        </section>

        <section className="bg-white border border-[#EAE7E0] p-6 md:p-8">
          <h2 className="font-serif text-xl mb-4">Data</h2>
          <p className="text-sm text-[#85847E] mb-4 leading-relaxed">
            This demonstration stores preferences and age confirmation in your browser's local storage only.
            No account server is required.
          </p>
          <button
            onClick={clearTaste}
            className="text-sm text-[#702D3B] hover:underline"
          >
            Clear taste profile
          </button>
        </section>

        <section className="bg-white border border-[#EAE7E0] p-6 md:p-8">
          <h2 className="font-serif text-xl mb-4">About this build</h2>
          <p className="text-sm text-[#85847E] leading-relaxed mb-3">
            PAIR IT is a premium food & beverage discovery prototype.
            It includes a curated pairing engine, editorial discovery experience,
            menu scanner flow (demo OCR), flavor profile, and age controls.
          </p>
          <p className="text-sm text-[#85847E] leading-relaxed">
            Demonstration data is clearly identified. Prices and ratings are not fabricated as expert consensus;
            where ranges appear they are indicative and sourced where noted.
          </p>
        </section>

        <p className="text-center text-xs text-[#85847E] pt-6">
          Please drink responsibly. For adults of legal drinking age only.
        </p>
      </div>
    </div>
  )
}
