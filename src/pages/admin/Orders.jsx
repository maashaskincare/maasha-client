import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI } from '../../api/services'
import { ORDER_STATUSES } from '../../constants'

export default function Orders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    setLoading(true)
    const params = { limit: 100, ...(filter !== 'all' && { status: filter }) }
    orderAPI.adminGetAll(params).then(r => setOrders(r.data?.orders||r.data||[])).finally(() => setLoading(false))
  }, [filter])

  const filtered = orders.filter(o => !search || String(o.orderNumber).includes(search) || o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} orders</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-4">
        {['all',...ORDER_STATUSES.map(s=>s.value)].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter===s?'btn-primary':'border border-gray-200 text-gray-500 hover:border-green-300'}`}>
            {s==='all'?'All Orders':s}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order number or customer name…" className="input-field max-w-sm"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Order #','Customer','Items','Total','Payment','Status','Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:6}).map((_,i) => (
                <tr key={i} className="border-b border-gray-50">{[1,2,3,4,5,6,7].map(j => <td key={j} className="px-4 py-3"><div className="skeleton h-3 rounded w-20"/></td>)}</tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders found</td></tr>
              ) : filtered.map(order => {
                const st = ORDER_STATUSES.find(s => s.value === order.status)
                return (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><Link to={`/admin/orders/${order._id}`} className="font-bold text-green-600 hover:underline text-xs">#{order.orderNumber}</Link></td>
                    <td className="px-4 py-3 text-xs"><p className="font-medium text-charcoal">{order.shippingAddress?.fullName||'—'}</p><p className="text-gray-400">{order.shippingAddress?.phone}</p></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{order.items?.length} item(s)</td>
                    <td className="px-4 py-3 font-bold text-charcoal text-xs">₹{order.total?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><span className={`badge text-[10px] ${order.paymentStatus==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{order.paymentStatus||order.paymentMethod}</span></td>
                    <td className="px-4 py-3"><span className={`badge text-[10px] ${st?.color||'bg-gray-100 text-gray-500'}`}>{order.status}</span></td>
                    <td className="px-4 py-3 text-[11px] text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'})}</td>
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
