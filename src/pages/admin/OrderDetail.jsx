import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderAPI } from '../../api/services'
import { ORDER_STATUSES } from '../../constants'
import toast from 'react-hot-toast'

export default function OrderDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [order,    setOrder]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [updating, setUpdating] = useState(false)
  const [note,     setNote]     = useState('')

  useEffect(() => {
    orderAPI.adminGetAll({ limit: 200 })
      .then(r => {
        const orders = r.data?.orders || r.data || []
        const found  = orders.find(o => o._id === id)
        setOrder(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusUpdate = async (status) => {
    setUpdating(true)
    try {
      await orderAPI.updateStatus(id, status, note)
      setOrder(o => ({ ...o, status }))
      toast.success(`Status updated to ${status}`)
      setNote('')
    } catch { toast.error('Failed to update status') }
    finally { setUpdating(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-t-green-500 border-green-100 animate-spin"/></div>
  if (!order)  return <div className="text-center py-20 text-gray-400">Order not found</div>

  const st = ORDER_STATUSES.find(s => s.value === order.status)

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <button onClick={() => navigate('/admin/orders')} className="text-xs text-gray-400 hover:text-green-500 mb-1 flex items-center gap-1">← Back to Orders</button>
          <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>Order #{order.orderNumber}</h1>
        </div>
        <span className={`badge ${st?.color}`}>{order.status}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Customer</h3>
          <p className="font-semibold text-charcoal">{order.shippingAddress?.fullName}</p>
          <p className="text-sm text-gray-500">{order.shippingAddress?.phone}</p>
          <p className="text-sm text-gray-500">{order.shippingAddress?.email}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Delivery Address</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {order.shippingAddress?.line1}{order.shippingAddress?.line2?`, ${order.shippingAddress.line2}`:''}<br/>
            {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items?.map((item,i) => (
            <div key={i} className="flex gap-3 items-center">
              <img src={item.image||'/placeholder-product.jpg'} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0"/>
              <div className="flex-1"><p className="text-sm font-medium text-charcoal">{item.name}</p><p className="text-xs text-gray-400">Qty: {item.qty}</p></div>
              <p className="font-bold text-sm text-charcoal">₹{(item.price*item.qty).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
          {order.discount>0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
          <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shipping===0?'FREE':`₹${order.shipping}`}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span style={{color:'var(--color-primary)'}}>₹{order.total?.toLocaleString('en-IN')}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Update Status</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {ORDER_STATUSES.map(s => (
            <button key={s.value} onClick={() => handleStatusUpdate(s.value)} disabled={updating||s.value===order.status}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize border ${s.value===order.status?'opacity-50 cursor-not-allowed border-gray-200':'hover:border-green-300 border-gray-200 hover:bg-green-50'}`}>
              {s.label}
            </button>
          ))}
        </div>
        <input type="text" value={note} onChange={e => setNote(e.target.value)}
          placeholder="Optional note for customer (e.g. tracking number)" className="input-field text-sm mt-2"/>
      </div>
    </div>
  )
}
