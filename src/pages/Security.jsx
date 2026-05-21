import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, KeyRound, Smartphone, Globe, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

export default function Security() {
  const { updatePassword } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    const err = {}
    if (!newPassword) err.new = 'Required'
    else if (newPassword.length < 8) err.new = 'At least 8 characters'
    if (newPassword !== confirm) err.confirm = "Passwords don't match"
    setErrors(err)
    if (Object.keys(err).length) return

    setSaving(true)
    const { error } = await updatePassword(newPassword)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Password updated')
    setNewPassword('')
    setConfirm('')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Account
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-zinc-50">
          <span className="font-serif italic text-aurora">Security</span>{' '}
          center
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage how you sign in, and review trusted devices.
        </p>
      </header>

      {/* Change password */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-grad-aurora-soft ring-1 ring-white/10 text-aurora-cyan">
            <KeyRound size={16} />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-50">
              Change password
            </h3>
            <p className="text-xs text-zinc-500">
              Pick a fresh one at least every 90 days.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
          <FormField
            icon={Lock}
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.new}
            autoComplete="new-password"
          />
          <FormField
            icon={Lock}
            label="Confirm new password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            error={errors.confirm}
            autoComplete="new-password"
          />
          <div className="flex justify-end">
            <motion.button
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={saving}
              className="btn-aurora"
            >
              {saving ? 'Updating…' : 'Update password'}
            </motion.button>
          </div>
        </form>
      </motion.section>

      {/* 2FA */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-grad-aurora-soft ring-1 ring-white/10 text-aurora-violet">
              <ShieldCheck size={16} />
            </span>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-zinc-50">
                Two-factor authentication
              </h3>
              <p className="text-xs text-zinc-500">
                Add a one-time code from an authenticator app.
              </p>
            </div>
          </div>
          <button className="btn-ghost">Enable</button>
        </div>
      </motion.section>

      {/* Sessions */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-strong overflow-hidden rounded-2xl"
      >
        <div className="border-b border-white/[0.05] p-6">
          <h3 className="text-base font-semibold tracking-tight text-zinc-50">
            Active sessions
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Devices currently signed in to your account.
          </p>
        </div>
        <ul className="divide-y divide-white/[0.04]">
          <SessionRow
            icon={Globe}
            device="Chrome · macOS"
            location="Karachi, PK"
            current
          />
          <SessionRow
            icon={Smartphone}
            device="iOS Safari"
            location="Karachi, PK · 2 days ago"
          />
        </ul>
      </motion.section>
    </div>
  )
}

function SessionRow({ icon: Icon, device, location, current }) {
  return (
    <li className="flex items-center gap-4 px-6 py-4">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-zinc-400">
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-100">{device}</p>
        <p className="truncate text-xs text-zinc-500">{location}</p>
      </div>
      {current ? (
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
          This device
        </span>
      ) : (
        <button className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200">
          <MoreHorizontal size={14} />
        </button>
      )}
    </li>
  )
}
