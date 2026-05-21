import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import LoadingScreen from '../components/LoadingScreen'

/**
 * Supabase parses the OAuth fragment automatically (detectSessionInUrl: true).
 * Once the session resolves we just need to redirect.
 */
export default function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true

    async function finishOAuth() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!alive) return

        if (error) {
          toast.error(error.message)
          navigate('/login', { replace: true })
          return
        }

        navigate('/dashboard', { replace: true })
        return
      }

      if (!loading) {
        navigate(user ? '/dashboard' : '/login', { replace: true })
      }
    }

    finishOAuth()

    return () => {
      alive = false
    }
  }, [user, loading, navigate])

  return <LoadingScreen label="Completing sign-in" />
}
