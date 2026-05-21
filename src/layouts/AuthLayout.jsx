import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'
import AuroraBackground from '../components/AuroraBackground'
import ThemeToggle from '../components/ThemeToggle'
import { Quote } from 'lucide-react'

/**
 * Two-pane auth shell: form left, editorial marketing pane right.
 * On mobile the right pane collapses; the form is centered.
 */
export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <AuroraBackground />

      {/* Left — form pane */}
      <div className="relative flex w-full flex-1 flex-col px-6 py-6 lg:px-12 lg:py-8">
        <header className="flex items-center justify-between">
          <Link to="/login" className="inline-flex">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12"
        >
          <Outlet />
        </motion.div>

        <footer className="flex items-center justify-between text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Aurora Labs</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-300">
              Privacy
            </a>
            <a href="#" className="hover:text-zinc-300">
              Terms
            </a>
          </div>
        </footer>
      </div>

      {/* Right — editorial pane */}
      <div className="relative hidden w-1/2 max-w-2xl items-center justify-center overflow-hidden p-8 lg:flex">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-strong relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl p-10"
        >
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-aurora-violet/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-aurora-cyan/20 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              v1.0 · Now in beta
            </span>
          </div>

          <div className="relative">
            <Quote
              size={40}
              className="mb-6 -rotate-180 text-aurora-cyan/40"
            />
            <p className="text-balance text-3xl font-light leading-snug tracking-tight text-zinc-100">
              The most beautiful{' '}
              <span className="font-serif italic text-aurora">
                authentication
              </span>{' '}
              experience we've ever shipped.{' '}
              <span className="text-zinc-500">
                It feels like nothing — and that's the point.
              </span>
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-grad-aurora text-sm font-semibold text-white">
                ML
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Maya Lindgren
                </p>
                <p className="text-xs text-zinc-500">
                  Head of Engineering · Northstar
                </p>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3 text-center">
            <Stat n="99.99%" l="Uptime" />
            <Stat n="48ms" l="P95 latency" />
            <Stat n="SOC 2" l="Compliant" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Stat({ n, l }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-aurora text-xl font-semibold tracking-tight">{n}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {l}
      </p>
    </div>
  )
}
