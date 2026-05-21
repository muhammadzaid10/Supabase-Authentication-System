import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

export default function Register() {
  const { signUp, signInWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const navigate = useNavigate()

  // Live password strength heuristic
  const strength = computeStrength(password)

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Tell us what to call you'
    if (!email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'At least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    const normalizedEmail = email.trim().toLowerCase()
    setSubmitting(true)
    setErrors({}) // Purane errors clear karein

    // 🔥 Cleaned Up: Supabase ka official direct signup flow
    const { data, error } = await signUp(normalizedEmail, password, { full_name: name })
    
    setSubmitting(false)

    if (error) {
      // Agar email pehle se exist karti hogi, Supabase khud error message dega
      toast.error(error.message)
      if (error.message.toLowerCase().includes('exists') || error.message.toLowerCase().includes('registered')) {
        setErrors({ email: 'User already exists' })
      }
      return
    }

    // Checking if user registration was successful
    if (data?.user) {
      // Supabase agar Email Confirmation ON rakhta hai toh session nahi milta, confirm link inbox me jata hai
      if (data.session) {
        toast.success('Account created successfully!')
        navigate('/dashboard', { replace: true })
      } else {
        toast.success('Registration successful! Please check your inbox to confirm your email.')
        navigate('/login', { replace: true })
      }
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handleGoogle = async () => {
    setGoogleSubmitting(true)
    const { error } = await signInWithGoogle()
    if (error) {
      toast.error(error.message)
      setGoogleSubmitting(false)
    }
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          Create your{' '}
          <span className="font-serif italic text-aurora">workspace</span>
        </h1>
        <p className="text-sm text-zinc-500">
          Free forever for personal projects. No card required.
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={handleGoogle}
        disabled={submitting || googleSubmitting}
        className="btn-ghost w-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {googleSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner /> Connecting Google...
          </span>
        ) : (
          <>
            <GoogleIcon /> Sign up with Google
          </>
        )}
      </motion.button>

      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-zinc-600">
        <span className="h-px flex-1 bg-white/[0.06]" />
        or with email
        <span className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          icon={User}
          label="Full name"
          name="name"
          placeholder="Ada Lovelace"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
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
        <div>
          <FormField
            icon={Lock}
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />
          {password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex items-center gap-1.5"
            >
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < strength.score
                      ? strength.color
                      : 'bg-white/[0.05]'
                  }`}
                />
              ))}
              <span className="ml-2 text-[11px] text-zinc-500">
                {strength.label}
              </span>
            </motion.div>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={submitting || googleSubmitting}
          className="btn-aurora w-full"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2 justify-center w-full">
              <Spinner /> Creating account…
            </span>
          ) : (
            <span className="inline-flex items-center justify-center gap-2 w-full">
              Create account <ArrowRight size={16} />
            </span>
          )}
        </motion.button>

        <p className="text-center text-[11px] text-zinc-500">
          By signing up you agree to our{' '}
          <a href="#" className="text-zinc-400 underline-offset-2 hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="text-zinc-400 underline-offset-2 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-zinc-200 transition-colors hover:text-aurora-cyan"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

function computeStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent']
  const colors = [
    'bg-rose-500/70',
    'bg-amber-500/70',
    'bg-yellow-400/80',
    'bg-emerald-500/80',
    'bg-grad-aurora',
  ]
  return { score, label: labels[score], color: colors[Math.max(0, score - 1)] }
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