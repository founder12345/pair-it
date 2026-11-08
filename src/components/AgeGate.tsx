import { motion } from 'framer-motion'

interface AgeGateProps {
  onConfirm: () => void
  onDeny: () => void
}

export default function AgeGate({ onConfirm, onDeny }: AgeGateProps) {
  return (
    <div className="min-h-screen bg-[#191A18] text-[#F7F5F0] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center"
      >
        <p className="font-serif text-4xl md:text-5xl tracking-tight mb-3">PAIR IT</p>
        <p className="text-[#85847E] text-sm tracking-widest uppercase mb-10">
          Every dish has its match
        </p>

        <h1 className="font-serif text-2xl md:text-3xl mb-4 leading-snug">
          Are you of legal drinking age?
        </h1>
        <p className="text-[#85847E] text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          This experience includes information about wine, beer, spirits and cocktails.
          You must be of legal age to consume alcohol in your country or region to continue.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="px-8 py-3.5 bg-[#F7F5F0] text-[#191A18] text-sm tracking-wide hover:bg-white transition-colors"
          >
            Yes, I am of legal age
          </button>
          <button
            onClick={onDeny}
            className="px-8 py-3.5 border border-[#85847E]/40 text-[#85847E] text-sm tracking-wide hover:border-[#F7F5F0] hover:text-[#F7F5F0] transition-colors"
          >
            No, I am not
          </button>
        </div>

        <p className="mt-12 text-[11px] text-[#85847E]/70 leading-relaxed max-w-xs mx-auto">
          By entering you confirm you are of legal drinking age and agree to our terms of use.
          Please drink responsibly.
        </p>
      </motion.div>
    </div>
  )
}
