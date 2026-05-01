import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      nav('/dashboard')
    } catch {
      setError('Invalid credentials')
    }
  }

  const google = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/auth/google`
  }

  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center p-6">
      <form onSubmit={onSubmit} className="surface-card w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-slate-500">Continue to your dashboard.</p>
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <input className="input-field" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn-primary w-full" type="submit">Login</button>
        <button type="button" className="btn-secondary w-full" onClick={google}>Sign in with Google</button>
      </form>
    </div>
  )
}
export default Login


