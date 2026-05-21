import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

/**
 * Hero analytic tile. Has gradient hairline border, hover lift, optional
 * trailing badge and a small trend pill.
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
  trendDir = 'up',
  accent = 'cyan',
  badge,
}) {
  const accentMap = {
    cyan: 'from-aurora-cyan/30 to-transparent text-aurora-cyan',
    blue: 'from-aurora-blue/30 to-transparent text-aurora-blue',
    violet: 'from-aurora-violet/30 to-transparent text-aurora-violet',
    pink: 'from-aurora-pink/30 to-transparent text-aurora-pink',
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="border-gradient group relative overflow-hidden rounded-2xl"
    >
      <div className="glass relative rounded-2xl p-5">
        {/* Glow blob on hover */}
        <span
          className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${accentMap[accent]}`}
          style={{ filter: 'blur(40px)' }}
        />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] ${accentMap[accent].split(' ').slice(-1).join(' ')}`}
            >
              <Icon size={16} />
            </span>
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
          </div>
          {badge}
        </div>

        <div className="relative mt-5 flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-zinc-50">{value}</p>
            {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
          </div>
          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
                trendDir === 'up'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              <ArrowUpRight
                size={11}
                className={trendDir === 'down' ? 'rotate-90' : ''}
              />
              {trend}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
