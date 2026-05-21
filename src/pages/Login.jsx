import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

export default function Login() {
  const { signInWithPassword, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? '/dashboard'

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const { error } = await signInWithPassword(email, password)
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Welcome back')
    navigate(redirectTo, { replace: true })
  }

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle()
    if (error) toast.error(error.message)
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          Welcome <span className="font-serif italic text-aurora">back</span>.
        </h1>
        <p className="text-sm text-zinc-500">
          Sign in to continue to your workspace.
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={handleGoogle}
        className="btn-ghost w-full"
      >
        <GoogleIcon /> Continue with Google
      </motion.button>

      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-zinc-600">
        <span className="h-px flex-1 bg-white/[0.06]" />
        or with email
        <span className="h-px flex-1 bg-white/[0.06]" />
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
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          icon={Lock}
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 text-zinc-500">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-white/20 bg-white/[0.02] text-aurora-blue focus:ring-aurora-blue/40"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Forgot password?
          </Link>
        </div>

        <motion.button
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={submitting}
          className="btn-aurora w-full"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> Signing in…
            </span>
          ) : (
            <>
              Sign in <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-zinc-200 transition-colors hover:text-aurora-cyan"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 10.2v3.84h5.46c-.24 1.32-1.62 3.84-5.46 3.84-3.3 0-5.94-2.7-5.94-6s2.64-6 5.94-6c1.86 0 3.12.78 3.84 1.5L18.78 4.5C16.98 2.82 14.7 1.8 12 1.8 6.42 1.8 1.92 6.3 1.92 12s4.5 10.2 10.08 10.2c5.82 0 9.66-4.08 9.66-9.84 0-.66-.06-1.16-.16-1.66H12z"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
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
