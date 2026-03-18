import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, selectAuthLoading, selectAuthError, selectToken, clearError } from '../features/auth/authSlice'
import SEO from '../components/common/SEO'
import toast from 'react-hot-toast'

export default function Login() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const loading   = useSelector(selectAuthLoading)
  const error     = useSelector(selectAuthError)
  const token     = useSelector(selectToken)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const from = location.state?.from?.pathname || '/'

  useEffect(() => { if (token) navigate(from, { replace: true }) }, [token])
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

  return (
    <>
      <SEO title="Login" noIndex />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-3xl font-bold" style={{fontFamily:'var(--font-heading)',color:'var(--color-primary)'}}>MAASHA</h1>
              <p className="text-xs tracking-[0.3em] font-medium" style={{color:'var(--color-gold)'}}>SKIN CARE</p>
            </Link>
            <p className="text-gray-500 text-sm mt-3">Welcome back! Sign in to your account.</p>
          </div>
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input-field" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-500 font-semibold hover:underline">Register free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
