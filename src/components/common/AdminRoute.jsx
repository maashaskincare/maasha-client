import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectToken, selectIsAdmin } from '../../features/auth/authSlice'

export default function AdminRoute({ children }) {
  const token   = useSelector(selectToken)
  const isAdmin = useSelector(selectIsAdmin)
  if (!token)   return <Navigate to="/admin/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
