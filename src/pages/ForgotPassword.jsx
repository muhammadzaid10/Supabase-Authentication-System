import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return setError('Email is required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError('Enter a valid email')
    setError('')
    setSubmitting(true)
    const { error: err } = await sendPasswordReset(email)
    setSubmitting(false)
    if (err) {
      toast.error(err.message)
      return
    }
    setSent(true)
    toast.success('Reset link sent')
  }

  return (
    <div className="space-y-7">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-7"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
                Forgot your{' '}
                <span className="font-serif italic text-aurora">password</span>?
              </h1>
              <p className="text-sm text-zinc-500">
                Enter your email and we'll send you a secure link to reset it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                icon={Mail}
                label="Email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                autoComplete="email"
              />

              <motion.button
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitting}
                className="btn-aurora w-full"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> Sending…
                  </span>
                ) : (
                  <>
                    Send reset link <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
            >
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-grad-aurora-soft ring-1 ring-white/10">
              <MailCheck className="text-aurora-cyan" size={24} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
                Check your inbox
              </h1>
              <p className="mx-auto max-w-xs text-sm text-zinc-500">
                We sent a reset link to{' '}
                <span className="text-zinc-200">{email}</span>. It expires in 60
                minutes.
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/login" className="btn-ghost inline-flex w-full">
                Back to sign in
              </Link>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-zinc-500 transition-colors hover:text-zinc-200"
              >
                Use a different email
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
