import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, selectAuthLoading, selectAuthError, selectToken, clearError } from '../features/auth/authSlice'
import SEO from '../components/common/SEO'
import toast from 'react-hot-toast'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading  = useSelector(selectAuthLoading)
  const error    = useSelector(selectAuthError)
  const token    = useSelector(selectToken)
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' })

  useEffect(() => { if (token) navigate('/') }, [token])
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    dispatch(registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password }))
  }

  const f = (key) => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) })

  return (
    <>
      <SEO title="Create Account" noIndex />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-3xl font-bold" style={{fontFamily:'var(--font-heading)',color:'var(--color-primary)'}}>MAASHA</h1>
              <p className="text-xs tracking-[0.3em] font-medium" style={{color:'var(--color-gold)'}}>SKIN CARE</p>
            </Link>
            <p className="text-gray-500 text-sm mt-3">Create your account to get started</p>
          </div>
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label>
                <input type="text" {...f('name')} placeholder="Your full name" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email Address *</label>
                <input type="email" {...f('email')} placeholder="you@example.com" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                <input type="tel" {...f('phone')} placeholder="+91 XXXXX XXXXX" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Password *</label>
                <input type="password" {...f('password')} placeholder="Min 6 characters" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Confirm Password *</label>
                <input type="password" {...f('confirm')} placeholder="Repeat your password" className="input-field" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-green-500 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
