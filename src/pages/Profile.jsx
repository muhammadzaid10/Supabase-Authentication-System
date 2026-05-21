import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Save, Hash, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

export default function Profile() {
  const { user, updateUserMetadata } = useAuth()
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || user?.user_metadata?.name || '',
  )
  const [bio, setBio] = useState(user?.user_metadata?.bio || '')
  const [saving, setSaving] = useState(false)

  const initials =
    (fullName || user?.email || 'A').slice(0, 2).toUpperCase()

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await updateUserMetadata({ full_name: fullName, bio })
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Profile updated')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Account
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-zinc-50">
          Your <span className="font-serif italic text-aurora">profile</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Update how you appear across the Aurora workspace.
        </p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex items-center gap-5">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-grad-aurora text-2xl font-semibold text-white ring-2 ring-white/10">
              {initials}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-100">
              {fullName || 'Add your name'}
            </p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
            {bio ? (
              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                {bio}
              </p>
            ) : (
              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Add a short bio so your profile feels complete.
              </p>
            )}
            <button
              type="button"
              className="mt-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.05]"
            >
              Upload new photo
            </button>
          </div>
        </div>
      </motion.section>

      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        onSubmit={handleSave}
        className="glass-strong space-y-5 rounded-2xl p-6"
      >
        <FormField
          icon={User}
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ada Lovelace"
        />

        <FormField
          icon={Mail}
          label="Email"
          value={user?.email ?? ''}
          disabled
          placeholder="you@company.com"
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            Short bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A short sentence about what you build…"
            className="field !pl-4"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <ReadOnlyMeta user={user} />
          <motion.button
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={saving}
            className="btn-aurora"
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save changes'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  )
}

function ReadOnlyMeta({ user }) {
  if (!user) return null
  return (
    <div className="hidden flex-col gap-1 text-[11px] text-zinc-500 sm:flex">
      <span className="inline-flex items-center gap-1.5">
        <Hash size={11} />
        <span className="font-mono">{user.id?.slice(0, 8)}…</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Calendar size={11} />
        Joined{' '}
        {new Date(user.created_at).toLocaleDateString(undefined, {
          month: 'short',
          year: 'numeric',
        })}
      </span>
    </div>
  )
}
