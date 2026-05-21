import { motion } from 'framer-motion'
import Logo from './Logo'
import AuroraBackground from './AuroraBackground'

export default function LoadingScreen({ label = 'Loading workspace' }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <AuroraBackground />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <Logo size={48} withWordmark={false} />
        <div className="flex flex-col items-center gap-3">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full w-1/3 rounded-full bg-grad-aurora"
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            {label}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
