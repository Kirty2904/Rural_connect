import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="app-shell py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute


