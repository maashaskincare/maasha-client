import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectToken } from '../../features/auth/authSlice'

export default function ProtectedRoute() {
  const token = useSelector(selectToken)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}
