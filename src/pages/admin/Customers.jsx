import { useEffect, useState } from 'react'
import { adminAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  const load = () => {
    setLoading(true)
    adminAPI.getCustomers({ limit:100 }).then(r => setCustomers(r.data?.customers||r.data||[])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleBlock = async (id, blocked) => {
    try { await adminAPI.blockCustomer(id); toast.success(blocked?'Customer unblocked':'Customer blocked'); load() }
    catch { toast.error('Failed') }
  }

  const filtered = customers.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search))

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>Customers</h1>
          <p className="text-sm text-gray-400 mt-0.5">{customers.length} registered customers</p>
        </div>
      </div>
      <div className="mb-4">
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email or phone…" className="input-field max-w-sm"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Customer','Email','Phone','Orders','Total Spent','Joined','Status','Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:5}).map((_,i) => (
                <tr key={i} className="border-b border-gray-50">{[1,2,3,4,5,6,7,8].map(j => <td key={j} className="px-4 py-3"><div className="skeleton h-3 rounded w-20"/></td>)}</tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">{search?'No customers match your search':'No customers yet'}</td></tr>
              ) : filtered.map(c => (
                <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:'var(--color-primary)'}}>
                        {c.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-charcoal text-xs">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.phone||'—'}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-charcoal">{c.orderCount||0}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{color:'var(--color-primary)'}}>{c.totalSpent?`₹${c.totalSpent.toLocaleString('en-IN')}`:'₹0'}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-400">{new Date(c.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'})}</td>
                  <td className="px-4 py-3"><span className={`badge text-[10px] ${c.blocked?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{c.blocked?'Blocked':'Active'}</span></td>
                  <td className="px-4 py-3"><button onClick={() => handleBlock(c._id,c.blocked)} className={`text-xs font-semibold ${c.blocked?'text-green-500 hover:text-green-600':'text-red-400 hover:text-red-500'}`}>{c.blocked?'Unblock':'Block'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
