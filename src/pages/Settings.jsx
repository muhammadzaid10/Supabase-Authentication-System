import { motion } from 'framer-motion'
import { Bell, Globe, Monitor, Moon, Sun, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [productUpdates, setProductUpdates] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Delete your account permanently? This cannot be undone.',
    )
    if (!confirmed) return

    setDeleting(true)
    const { error } = await deleteAccount()
    setDeleting(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Account deleted')
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Preferences
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-zinc-50">
          Settings
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Tune Aurora to match the way you work.
        </p>
      </header>

      {/* Appearance */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-2xl p-6"
      >
        <SectionHeader
          eyebrow="Appearance"
          title="Choose your interface"
          subtitle="Aurora was designed dark-first, but it shines in the light too."
        />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'system', label: 'System', icon: Monitor, disabled: true },
          ].map((opt) => {
            const active = theme === opt.id
            return (
              <button
                key={opt.id}
                disabled={opt.disabled}
                onClick={() => !opt.disabled && setTheme(opt.id)}
                className={`relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? 'border-aurora-blue/40 bg-aurora-blue/5'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
                } ${opt.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <ThemePreview variant={opt.id} />
                <div className="flex items-center gap-2">
                  <opt.icon size={14} className="text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-100">
                    {opt.label}
                  </span>
                  {opt.disabled && (
                    <span className="ml-auto text-[10px] uppercase tracking-wide text-zinc-500">
                      Soon
                    </span>
                  )}
                </div>
                {active && (
                  <motion.span
                    layoutId="theme-active"
                    className="absolute right-3 top-3 h-2 w-2 rounded-full bg-aurora-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  />
                )}
              </button>
            )
          })}
        </div>
      </motion.section>

      {/* Notifications */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="glass-strong rounded-2xl p-6"
      >
        <SectionHeader
          eyebrow="Notifications"
          title="When should we reach out?"
        />
        <div className="mt-5 space-y-2">
          <SwitchRow
            icon={Bell}
            label="Security alerts"
            desc="Always on. Notified about new sign-ins and account changes."
            value={true}
            disabled
          />
          <SwitchRow
            icon={Mail}
            label="Email notifications"
            desc="Receive a digest of your weekly activity."
            value={emailNotifs}
            onChange={setEmailNotifs}
          />
          <SwitchRow
            icon={Globe}
            label="Product updates"
            desc="Occasional announcements when we ship something noteworthy."
            value={productUpdates}
            onChange={setProductUpdates}
          />
        </div>
      </motion.section>

      {/* Danger zone */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-6"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-rose-300/80">
          Danger zone
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">
          Delete your workspace
        </h3>
        <p className="mt-1.5 max-w-xl text-sm text-zinc-400">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? 'Deleting...' : 'Delete account'}
        </button>
      </motion.section>
    </div>
  )
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">
        {title}
      </h3>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
    </div>
  )
}

function SwitchRow({ icon: Icon, label, desc, value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06] text-zinc-400">
        <Icon size={14} />
      </span>
      <div className="flex-1">
        <p className="text-sm text-zinc-100">{label}</p>
        <p className="text-xs text-zinc-500">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!value)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
          value
            ? 'bg-grad-aurora ring-1 ring-white/10'
            : 'bg-white/[0.06] ring-1 ring-white/[0.08]'
        } ${disabled ? 'opacity-60' : ''}`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md ${
            value ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function ThemePreview({ variant }) {
  if (variant === 'dark') {
    return (
      <div className="relative h-20 w-full overflow-hidden rounded-lg bg-ink-900 ring-1 ring-white/[0.06]">
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-50" />
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-aurora-violet/40 blur-2xl" />
        <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-aurora-cyan/40 blur-2xl" />
        <div className="absolute inset-3 flex flex-col gap-1">
          <div className="h-1.5 w-12 rounded-full bg-white/20" />
          <div className="h-1.5 w-8 rounded-full bg-white/10" />
        </div>
      </div>
    )
  }
  if (variant === 'light') {
    return (
      <div className="relative h-20 w-full overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-200">
        <div className="absolute inset-0 bg-grid-light bg-grid opacity-60" />
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-aurora-violet/20 blur-2xl" />
        <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-aurora-cyan/20 blur-2xl" />
        <div className="absolute inset-3 flex flex-col gap-1">
          <div className="h-1.5 w-12 rounded-full bg-zinc-400/50" />
          <div className="h-1.5 w-8 rounded-full bg-zinc-300" />
        </div>
      </div>
    )
  }
  return (
    <div className="relative h-20 w-full overflow-hidden rounded-lg ring-1 ring-white/[0.06]">
      <div className="absolute inset-0 left-1/2 bg-zinc-100" />
      <div className="absolute inset-0 right-1/2 bg-ink-900" />
    </div>
  )
}
