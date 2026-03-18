import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, selectToken, selectIsAdmin, selectAuthLoading, selectAuthError, clearError } from '../../features/auth/authSlice'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const token     = useSelector(selectToken)
  const isAdmin   = useSelector(selectIsAdmin)
  const loading   = useSelector(selectAuthLoading)
  const error     = useSelector(selectAuthError)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => { if (token && isAdmin) navigate('/admin', { replace: true }) }, [token, isAdmin])
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser({ email, password })) }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:'linear-gradient(135deg, #1c3f19 0%, #2D5A27 100%)'}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide" style={{fontFamily:'var(--font-heading)'}}>MAASHA</h1>
          <p className="text-xs tracking-[0.3em] font-medium mt-0.5" style={{color:'rgba(184,134,11,0.9)'}}>SKIN CARE · ADMIN</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-bold text-charcoal mb-6 text-center">Admin Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="maashaskincare@gmail.com" className="input-field" required autoComplete="email"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="input-field" required autoComplete="current-password"/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Signing in…' : 'Sign In to Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
