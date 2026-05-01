import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employer' })
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      nav('/dashboard')
    } catch {
      setError('Registration failed')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center p-6">
      <form onSubmit={onSubmit} className="surface-card w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Sign Up</h1>
        <p className="text-sm text-slate-500">Create your account in under a minute.</p>
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <input className="input-field" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input-field" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <select className="input-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="employer">Employer</option>
          <option value="worker">Worker</option>
        </select>
        <button className="btn-primary w-full" type="submit">Create Account</button>
      </form>
    </div>
  )
}

export default Register


