import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Clock,
  Sparkles,
  LogIn,
  CheckCircle2,
  Globe,
  Smartphone,
  Key,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import ProfileCard from '../components/ProfileCard'
import ActivityChart from '../components/ActivityChart'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export default function Dashboard() {
  const { user, loginCount } = useAuth()

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 5) return 'Late night'
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.user_metadata?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there'

  const lastLogin = user?.last_sign_in_at
    ? formatRelative(user.last_sign_in_at)
    : 'Just now'

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          {greeting}
        </p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-zinc-50">
          {firstName},{' '}
          <span className="font-serif italic text-aurora">
            you're all set.
          </span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-500">
          Here's a quiet view of your account. Sessions, activity, and security
          — all in one calm place.
        </p>
      </motion.section>

      {/* Stat grid */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <motion.div variants={fadeUp}>
          <StatCard
            icon={Activity}
            label="Session status"
            value="Active"
            hint="Encrypted JWT, auto-refresh on"
            accent="cyan"
            badge={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                Online
              </span>
            }
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            icon={LogIn}
            label="Total sign-ins"
            value={loginCount.toLocaleString()}
            hint="Tracked this session"
            trend="+12%"
            trendDir="up"
            accent="blue"
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            icon={Sparkles}
            label="Account tier"
            value="Free"
            hint="Upgrade to unlock more"
            accent="violet"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-grad-aurora px-2 py-0.5 text-[10px] font-semibold text-white">
                PRO →
              </span>
            }
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            icon={Clock}
            label="Last sign-in"
            value={lastLogin}
            hint={
              user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : '—'
            }
            accent="pink"
          />
        </motion.div>
      </motion.section>

      {/* Two-column area */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <ProfileCard user={user} />
          <SecuritySnippet />
        </div>
      </section>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

function RecentActivity() {
  const items = [
    {
      icon: CheckCircle2,
      title: 'Email verified',
      desc: 'Your address was confirmed successfully.',
      time: 'Just now',
      tone: 'text-emerald-400',
    },
    {
      icon: Globe,
      title: 'New sign-in from Chrome on macOS',
      desc: 'Karachi, PK · 103.27.x.x',
      time: '2 min ago',
      tone: 'text-aurora-cyan',
    },
    {
      icon: Smartphone,
      title: 'Device added',
      desc: 'iPhone 15 · trusted',
      time: '1 day ago',
      tone: 'text-aurora-violet',
    },
    {
      icon: Key,
      title: 'Password rotated',
      desc: 'Successful update from Settings.',
      time: '6 days ago',
      tone: 'text-zinc-400',
    },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Activity</p>
          <h3 className="mt-0.5 text-base font-semibold tracking-tight text-zinc-50">
            Recent events
          </h3>
        </div>
        <button className="text-xs text-zinc-500 transition-colors hover:text-zinc-200">
          View all →
        </button>
      </div>
      <ul className="divide-y divide-white/[0.04]">
        {items.map((item, i) => (
          <li
            key={i}
            className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
          >
            <span className={`grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] ${item.tone}`}>
              <item.icon size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-100">{item.title}</p>
              <p className="truncate text-xs text-zinc-500">{item.desc}</p>
            </div>
            <span className="shrink-0 text-[11px] text-zinc-500">{item.time}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function SecuritySnippet() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass relative overflow-hidden rounded-2xl p-5"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aurora-violet/20"
        style={{ filter: 'blur(40px)' }}
      />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
          Security
        </p>
        <h3 className="mt-1 text-base font-semibold tracking-tight text-zinc-50">
          Your account looks healthy
        </h3>
        <p className="mt-1.5 text-xs text-zinc-500">
          One small step you can take to harden things further.
        </p>

        <div className="mt-4 space-y-2.5">
          {[
            { label: 'Strong password', done: true },
            { label: 'Email verified', done: true },
            { label: 'Two-factor authentication', done: false },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm">
              <span
                className={`grid h-5 w-5 place-items-center rounded-full ${
                  c.done
                    ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-white/[0.04] text-zinc-500 ring-1 ring-white/10'
                }`}
              >
                <CheckCircle2 size={11} />
              </span>
              <span className={c.done ? 'text-zinc-300' : 'text-zinc-400'}>
                {c.label}
              </span>
              {!c.done && (
                <button className="ml-auto rounded-md bg-grad-aurora-soft px-2 py-1 text-[11px] font-medium text-aurora-cyan ring-1 ring-white/10 transition-opacity hover:opacity-80">
                  Enable
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function formatRelative(iso) {
  const then = new Date(iso).getTime()
  const diff = Math.max(0, Date.now() - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
