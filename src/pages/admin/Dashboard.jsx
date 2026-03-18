import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, orderAPI } from '../../api/services'
import { ORDER_STATUSES } from '../../constants'

export default function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminAPI.getStats(),
      orderAPI.adminGetAll({ limit: 8, sort: 'newest' }),
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data)
      setOrders(ordersRes.data?.orders || ordersRes.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const cards = [
    { label:'Total Revenue',   value: stats ? `₹${(stats.totalRevenue||0).toLocaleString('en-IN')}` : '—', icon:'💰', color:'from-green-500 to-green-600',   href:'/admin/orders' },
    { label:'Total Orders',    value: stats?.totalOrders    || '—', icon:'📦', color:'from-blue-500 to-blue-600',    href:'/admin/orders' },
    { label:'Total Products',  value: stats?.totalProducts  || '—', icon:'🧴', color:'from-purple-500 to-purple-600', href:'/admin/products' },
    { label:'Total Customers', value: stats?.totalCustomers || '—', icon:'👥', color:'from-amber-500 to-amber-600',  href:'/admin/customers' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary btn-sm text-xs">+ Add Product</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <Link key={card.label} to={card.href} className={`rounded-xl p-5 text-white bg-gradient-to-br ${card.color} hover:opacity-95 hover:shadow-lg transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs text-white/70">→</span>
            </div>
            <p className="text-2xl font-bold mb-1">{loading ? <span className="animate-pulse">…</span> : card.value}</p>
            <p className="text-xs text-white/80">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          {label:'Add Product',href:'/admin/products/new',icon:'➕'},
          {label:'New Blog',   href:'/admin/blogs/new',   icon:'✍️'},
          {label:'Add Coupon', href:'/admin/coupons',     icon:'🏷️'},
          {label:'Add Banner', href:'/admin/banners',     icon:'🖼️'},
        ].map(a => (
          <Link key={a.label} to={a.href} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all text-sm font-medium text-charcoal">
            <span>{a.icon}</span>{a.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-charcoal text-sm">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-green-500 font-semibold hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order #','Customer','Total','Status','Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:5}).map((_,i) => (
                <tr key={i} className="border-b border-gray-50">
                  {[1,2,3,4,5].map(j => <td key={j} className="px-5 py-3"><div className="skeleton h-3 rounded w-20"/></td>)}
                </tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No orders yet</td></tr>
              ) : orders.map(order => {
                const st = ORDER_STATUSES.find(s => s.value === order.status)
                return (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3"><Link to={`/admin/orders/${order._id}`} className="font-semibold text-green-600 hover:underline text-xs">#{order.orderNumber}</Link></td>
                    <td className="px-5 py-3 text-xs text-charcoal">{order.shippingAddress?.fullName || order.user?.name || '—'}</td>
                    <td className="px-5 py-3 font-semibold text-xs text-charcoal">₹{order.total?.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3"><span className={`badge text-xs ${st?.color||'bg-gray-100 text-gray-500'}`}>{order.status}</span></td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
