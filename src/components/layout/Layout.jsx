import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from '../../features/auth/authSlice'
import Navbar from './Navbar'
import Footer from './Footer'
import AnnouncementBar from './AnnouncementBar'

export default function Layout() {
  const dispatch = useDispatch()
  useEffect(() => {
    const token = localStorage.getItem('maasha_token')
    if (token) dispatch(loadUser())
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 page-enter">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
