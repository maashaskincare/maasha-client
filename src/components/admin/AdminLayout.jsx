import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../../features/auth/authSlice'

const MENU = [
  { label: 'Dashboard',  href: '/admin',           icon: '📊' },
  { label: 'Orders',     href: '/admin/orders',     icon: '📦' },
  { label: 'Products',   href: '/admin/products',   icon: '🧴' },
  { label: 'Categories', href: '/admin/categories', icon: '🗂️' },
  { label: 'Blogs',      href: '/admin/blogs',      icon: '✍️' },
  { label: 'Coupons',    href: '/admin/coupons',    icon: '🏷️' },
  { label: 'Banners',    href: '/admin/banners',    icon: '🖼️' },
  { label: 'Customers',  href: '/admin/customers',  icon: '👥' },
  { label: 'Settings',   href: '/admin/settings',   icon: '⚙️' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user     = useSelector(selectUser)

  const handleLogout = () => { dispatch(logout()); navigate('/admin/login') }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col admin-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-5 border-b border-white/10">
          <Link to="/" target="_blank" className="flex flex-col">
            <span className="text-xl font-bold text-white tracking-wide" style={{fontFamily:'var(--font-heading)'}}>MAASHA</span>
            <span className="text-[9px] tracking-[0.3em] text-white/40">SKIN CARE · ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {MENU.map(item => (
            <NavLink key={item.href} to={item.href} end={item.href === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-xs text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-all text-left flex items-center gap-2">
            🚪 Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
            </button>
            <h1 className="text-sm font-semibold text-gray-600">Admin Panel</h1>
          </div>
          <Link to="/" target="_blank" className="text-xs text-gray-400 hover:text-green-500 transition-colors">View Site →</Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
