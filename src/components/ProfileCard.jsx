import { motion } from 'framer-motion'
import { Mail, Hash, Calendar, Sparkles } from 'lucide-react'

export default function ProfileCard({ user }) {
  if (!user) return null
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Member'
  const initials = name.slice(0, 2).toUpperCase()
  const bio = user.user_metadata?.bio
  const created = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-gradient relative overflow-hidden rounded-2xl"
    >
      <div className="glass-strong relative rounded-2xl">
        {/* Banner */}
        <div className="relative h-24 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-grad-aurora opacity-60" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.25), transparent 60%)',
            }}
          />
          {/* Subtle stars */}
          <Sparkles
            size={14}
            className="absolute right-6 top-5 text-white/60"
          />
          <Sparkles
            size={10}
            className="absolute right-16 top-10 text-white/40"
          />
        </div>

        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-ink-900"
              />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-grad-aurora text-2xl font-semibold text-white ring-4 ring-ink-900">
                {initials}
              </div>
            )}
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              Active
            </span>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-50">{name}</h2>
            <p className="text-sm text-zinc-500">
              <span className="font-serif italic">a member of</span> the Aurora workspace
            </p>
            {bio && (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                {bio}
              </p>
            )}
          </div>

          <div className="mt-5 space-y-2.5">
            <Row icon={Mail} label="Email">
              {user.email}
            </Row>
            <Row icon={Hash} label="User ID">
              <code className="font-mono text-[11px] text-zinc-400">
                {user.id?.slice(0, 8)}…{user.id?.slice(-4)}
              </code>
            </Row>
            <Row icon={Calendar} label="Member since">
              {created}
            </Row>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-3 py-2.5">
      <Icon size={14} className="text-zinc-500" />
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="ml-auto truncate text-sm text-zinc-200">{children}</span>
    </div>
  )
}
