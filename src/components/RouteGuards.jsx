import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './LoadingScreen'

/** Wraps routes that require an authenticated session. */
export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen label="Verifying session" />
  if (!session?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

/** Redirects already-authenticated users away from auth pages. */
export function PublicRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <LoadingScreen label="Preparing" />
  if (session?.user) return <Navigate to="/dashboard" replace />
  return children
}
