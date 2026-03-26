import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartCount } from '../../features/cart/cartSlice'
import { selectUser, logout } from '../../features/auth/authSlice'
import { NAV_LINKS } from '../../constants'

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchRef   = useRef(null)
  const userMenuRef = useRef(null)
  const navigate    = useNavigate()
  const dispatch    = useDispatch()
  const cartCount   = useSelector(selectCartCount)
  const user        = useSelector(selectUser)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-nav border-b border-gray-100' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="container-site">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo-navbar.png" alt="Maasha Skin Care" className="h-7 md:h-8 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} to={link.href}
                  className={({ isActive }) => `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-green-500 bg-green-50' : 'text-charcoal hover:text-green-500 hover:bg-green-50'}`}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1 md:gap-2">
              <div className="relative" ref={searchRef}>
                <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg text-charcoal hover:text-green-500 hover:bg-green-50 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </button>
                {searchOpen && (
                  <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-card-hover border border-gray-100 p-3 animate-slide-down z-50">
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search serums, face wash..." className="input-field flex-1 py-2 text-sm" autoFocus />
                      <button type="submit" className="btn-primary btn-sm px-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              <Link to="/cart" className="relative p-2 rounded-lg text-charcoal hover:text-green-500 hover:bg-green-50 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white rounded-full" style={{background:'var(--color-primary)'}}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-green-50 transition-all">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background:'var(--color-primary)'}}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-card-hover border border-gray-100 py-2 animate-slide-down z-50">
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs font-semibold text-charcoal truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-green-50 hover:text-green-500 transition-colors">My Account</Link>
                        <Link to="/account?tab=orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-green-50 hover:text-green-500 transition-colors">My Orders</Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-green-50 hover:text-green-500 transition-colors">Admin Panel</Link>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login" className="hidden md:flex btn-primary btn-sm px-4 py-2 text-xs">Login</Link>
                )}
              </div>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-charcoal hover:bg-green-50 transition-all">
                {mobileOpen
                  ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 top-[105px]" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative bg-white w-full shadow-card-hover animate-slide-down" onClick={e => e.stopPropagation()}>
            <div className="container-site py-4">
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..." className="input-field flex-1 py-2.5 text-sm" />
                <button type="submit" className="btn-primary btn-sm px-4">Go</button>
              </form>
              <nav className="space-y-1">
                {NAV_LINKS.map(link => (
                  <NavLink key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-green-50 text-green-500' : 'text-charcoal hover:bg-gray-50'}`}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-gray-100 mt-4 pt-4 flex gap-3">
                {user ? (
                  <button onClick={handleLogout} className="btn-secondary btn-sm flex-1 text-xs">Logout</button>
                ) : (
                  <>
                    <Link to="/login"    onClick={() => setMobileOpen(false)} className="btn-secondary btn-sm flex-1 text-xs text-center">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary  btn-sm flex-1 text-xs text-center">Register</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}