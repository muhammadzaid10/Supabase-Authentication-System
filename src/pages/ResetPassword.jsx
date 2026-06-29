import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

export default function ResetPassword() {
  const { updatePassword, session } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'At least 8 characters'
    if (!confirm) e.confirm = 'Please confirm your password'
    else if (confirm !== password) e.confirm = "Passwords don't match"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    if (!session) {
      toast.error('Session missing or expired. Please verify your OTP again.')
      navigate('/forgot-password', { replace: true })
      return
    }

    setSubmitting(true)
    const { data, error } = await updatePassword(password)
    setSubmitting(false)
    if (error) {
      console.error('Password update error:', error)
      toast.error(error.message || 'Failed to update password. Please try a different one.')
      return
    }
    
    toast.success('Password updated successfully')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          Set a new <span className="font-serif italic text-aurora">password</span>
        </h1>
        <p className="text-sm text-zinc-500">
          Make it strong — at least 8 characters with a mix of letters,
          numbers, and symbols.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          icon={Lock}
          label="New password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <FormField
          icon={Lock}
          label="Confirm new password"
          name="confirm"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <motion.button
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={submitting}
          className="btn-aurora w-full"
        >
          {submitting ? 'Updating…' : (
            <>
              Update password <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}
