import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/auth/authSlice'
import SEO from '../components/common/SEO'
import { orderAPI, authAPI } from '../api/services'
import generateInvoice from '../utils/generateInvoice'
import { ORDER_STATUSES } from '../constants'
import toast from 'react-hot-toast'

export default function Account() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')
  const user = useSelector(selectUser)
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoading(true)
      orderAPI.getMyOrders().then(r => setOrders(r.data?.orders || r.data || [])).finally(() => setLoading(false))
    }
  }, [activeTab])

  const handleTabChange = (tab) => { setActiveTab(tab); setSearchParams({ tab }) }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await authAPI.updateProfile(profile); toast.success('Profile updated!') }
    catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  return (
    <>
      <SEO title="My Account" noIndex />
      <div className="container-site py-8 md:py-12 max-w-4xl">
        <h1 className="section-heading mb-6">My Account</h1>
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-thin">
          {['profile','orders','addresses'].map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-all whitespace-nowrap ${activeTab === tab ? 'border-green-500 text-green-600 font-semibold' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
              {tab === 'orders' ? 'My Orders' : tab === 'addresses' ? 'Addresses' : 'Profile'}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="card p-6 max-w-lg">
            <h2 className="text-lg font-bold text-charcoal mb-5" style={{fontFamily:'var(--font-heading)'}}>Profile Details</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <input type="text" value={profile.name} onChange={e => setProfile(p => ({...p,name:e.target.value}))} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email (cannot change)</label>
                <input type="email" value={user?.email || ''} disabled className="input-field opacity-60 cursor-not-allowed bg-gray-100" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({...p,phone:e.target.value}))} className="input-field" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary btn-sm">{saving ? 'Saving…' : 'Save Changes'}</button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-lg font-bold text-charcoal mb-5" style={{fontFamily:'var(--font-heading)'}}>My Orders</h2>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-4">📦</span>
                <p className="text-gray-500 font-medium">No orders yet</p>
                <p className="text-gray-400 text-sm mt-1">Your orders will appear here after purchase</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const statusInfo = ORDER_STATUSES.find(s => s.value === order.status)
                  return (
                    <div key={order._id} className="card p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-sm font-bold text-charcoal">Order #{order.orderNumber}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
                        </div>
                        <span className={`badge text-xs ${statusInfo?.color || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                      </div>
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        {order.items?.slice(0,4).map((item,i) => (
                          <img key={i} src={item.image||'/placeholder-product.jpg'} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm font-bold" style={{color:'var(--color-primary)'}}>₹{order.total?.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-gray-400">{order.items?.length} item(s)</p>
                          <button onClick={() => generateInvoice(order)} className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
                            📄 Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div>
            <h2 className="text-lg font-bold text-charcoal mb-5" style={{fontFamily:'var(--font-heading)'}}>Saved Addresses</h2>
            <p className="text-sm text-gray-400">Addresses saved during checkout will appear here.</p>
          </div>
        )}
      </div>
    </>
  )
}
