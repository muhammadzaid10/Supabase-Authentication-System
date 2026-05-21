import { motion } from 'framer-motion'
import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * A polished input with leading icon, animated focus ring, optional password
 * visibility toggle, and inline error display.
 */
const FormField = forwardRef(function FormField(
  {
    icon: Icon,
    label,
    type = 'text',
    error,
    rightAddon,
    className = '',
    ...props
  },
  ref,
) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              focused ? 'text-aurora-blue' : 'text-zinc-500'
            }`}
          />
        )}
        <input
          ref={ref}
          type={inputType}
          className="field"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {focused && (
          <motion.div
            layoutId={`focus-${label || props.name}`}
            className="pointer-events-none absolute inset-0 rounded-[0.875rem] ring-1 ring-aurora-blue/40"
            transition={{ duration: 0.2 }}
          />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition-colors hover:text-zinc-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {rightAddon}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-rose-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

export default FormField
