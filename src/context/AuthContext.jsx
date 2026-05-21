import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

function getStoredLoginCount() {
  try {
    const stored = localStorage.getItem('aurora_login_count')
    return stored ? parseInt(stored, 10) : 0
  } catch {
    return 0
  }
}

function storeLoginCount(count) {
  try {
    localStorage.setItem('aurora_login_count', String(count))
  } catch {
    // Ignore storage failures; the counter can remain in memory.
  }
}

function getCachedUser() {
  try {
    const stored = localStorage.getItem('aurora_cached_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function storeCachedUser(user) {
  try {
    if (user) localStorage.setItem('aurora_cached_user', JSON.stringify(user))
    else localStorage.removeItem('aurora_cached_user')
  } catch {
    // Cached profile is only a display fallback.
  }
}

async function syncProfile(user) {
  if (!user?.id) return

  const metadata = user.user_metadata || {}
  const fullName =
    metadata.full_name ||
    metadata.name ||
    user.email?.split('@')[0] ||
    'User'

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email,
      full_name: fullName,
      bio: metadata.bio || '',
      avatar_url: metadata.avatar_url || metadata.picture || '',
      provider: user.app_metadata?.provider || 'email',
      last_sign_in_at: user.last_sign_in_at,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not sync profile:', error.message)
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(getCachedUser)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const manualSignOutRef = useRef(false)
  // Mock "total logins" — incremented on each sign-in event in this session.
  // For a real product this would live in a `profiles` table.
  const [loginCount, setLoginCount] = useState(getStoredLoginCount)

  useEffect(() => {
    let alive = true

    async function hydrateSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!alive) return
        if (error) setAuthError(error)
        setSession(session)
        if (session?.user) {
          setUser(session.user)
          storeCachedUser(session.user)
          syncProfile(session.user)
        } else {
          setUser(null)
          storeCachedUser(null)
        }
      } catch (error) {
        if (!alive) return
        setAuthError(error)
        setSession(null)
      } finally {
        if (alive) setLoading(false)
      }
    }

    // 1. Hydrate from existing session (auto-login on refresh).
    hydrateSession()

    // 2. Listen for auth state changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!alive) return

      setAuthError(null)

      if (event === 'SIGNED_OUT') {
        setSession(null)
        if (manualSignOutRef.current) {
          setUser(null)
          storeCachedUser(null)
          manualSignOutRef.current = false
        }
        setLoading(false)
        return
      }

      if (session) {
        setSession(session)
        setUser(session.user)
        storeCachedUser(session.user)
        syncProfile(session.user)
      }

      setLoading(false)

      if (event === 'SIGNED_IN') {
        setLoginCount((prev) => {
          const next = prev + 1
          storeLoginCount(next)
          return next
        })
      }
    })

    return () => {
      alive = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithPassword = useCallback(async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password })
  }, [])

  const signUp = useCallback(async (email, password, metadata = {}) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }, [])

const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // 🔥 Yeh line live Vercel URL aur localhost dono par automatic sahi chalegi
        redirectTo: `${window.location.origin}/login`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Google Auth Error:", error.message)
    return { data: null, error }
  }
}

  const sendPasswordReset = useCallback(async (email) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  }, [])

  const updatePassword = useCallback(async (newPassword) => {
    return supabase.auth.updateUser({ password: newPassword })
  }, [])

  const updateUserMetadata = useCallback(async (metadata) => {
    const result = await supabase.auth.updateUser({ data: metadata })
    if (result.data?.user) syncProfile(result.data.user)
    return result
  }, [])

  const deleteAccount = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) return { error: userError }

    if (user?.id) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (error) return { error }
    }

    manualSignOutRef.current = true
    const result = await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    storeCachedUser(null)
    return result
  }, [])

  const signOut = useCallback(async () => {
    manualSignOutRef.current = true
    const result = await supabase.auth.signOut()
    if (result.error) manualSignOutRef.current = false
    return result
  }, [])

  const value = {
    session,
    user,
    loading,
    authError,
    loginCount,
    signInWithPassword,
    signUp,
    signInWithGoogle,
    sendPasswordReset,
    updatePassword,
    updateUserMetadata,
    deleteAccount,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
