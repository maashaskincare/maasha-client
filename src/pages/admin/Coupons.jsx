import { useEffect, useState } from 'react'
import { couponAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [form, setForm] = useState({ code:'', type:'percentage', value:'', minOrder:'', expiry:'', usageLimit:'', active:true })

  const load = () => {
    setLoading(true)
    couponAPI.getAll().then(r => setCoupons(r.data?.coupons||r.data||[])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.code||!form.value) { toast.error('Code and value required'); return }
    setSaving(true)
    try {
      await couponAPI.create({ ...form, code:form.code.toUpperCase(), value:Number(form.value), minOrder:Number(form.minOrder)||0, usageLimit:Number(form.usageLimit)||0 })
      toast.success('Coupon created!')
      setForm({ code:'', type:'percentage', value:'', minOrder:'', expiry:'', usageLimit:'', active:true })
      load()
    } catch (err) { toast.error(err.response?.data?.message||'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return
    try { await couponAPI.delete(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold text-charcoal mb-6" style={{fontFamily:'var(--font-heading)'}}>Coupons</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-bold text-charcoal mb-4">Create New Coupon</h3>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Code *</label>
              <input type="text" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))} placeholder="SAVE20" className="input-field font-mono uppercase" required/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="input-field text-sm py-2">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Value *</label>
              <input type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))} placeholder={form.type==='percentage'?'20 (%)':'50 (₹)'} className="input-field" required min="1"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={e=>setForm(f=>({...f,minOrder:e.target.value}))} placeholder="499" className="input-field" min="0"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
              <input type="date" value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))} className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Usage Limit (0 = unlimited)</label>
              <input type="number" value={form.usageLimit} onChange={e=>setForm(f=>({...f,usageLimit:e.target.value}))} placeholder="100" className="input-field" min="0"/>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary btn-sm">{saving?'Creating…':'Create Coupon'}</button>
        </form>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Code','Type','Value','Min Order','Expiry','Uses','Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:3}).map((_,i) => (
                <tr key={i} className="border-b border-gray-50">{[1,2,3,4,5,6,7].map(j => <td key={j} className="px-4 py-3"><div className="skeleton h-3 rounded w-16"/></td>)}</tr>
              )) : coupons.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">No coupons yet</td></tr>
              ) : coupons.map(c => (
                <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-charcoal text-xs">{c.code}</td>
                  <td className="px-4 py-3 text-xs capitalize text-gray-500">{c.type}</td>
                  <td className="px-4 py-3 font-semibold text-xs">{c.type==='percentage'?`${c.value}%`:`₹${c.value}`}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.minOrder?`₹${c.minOrder}`:'—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.expiry?new Date(c.expiry).toLocaleDateString('en-IN'):'No expiry'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.usedCount||0}{c.usageLimit?`/${c.usageLimit}`:''}</td>
                  <td className="px-4 py-3"><button onClick={() => handleDelete(c._id,c.code)} className="text-xs text-red-400 font-semibold hover:text-red-500">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
