import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-zinc-100 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
