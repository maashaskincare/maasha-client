import { useEffect, useState } from 'react'
import { bannerAPI, uploadAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function Banners() {
  const [banners,   setBanners]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title:'', subtitle:'', link:'', image:'', active:true, order:0 })

  const load = () => {
    setLoading(true)
    bannerAPI.getAll().then(r => setBanners(r.data?.banners||r.data||[])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('image', file)
      const { data } = await uploadAPI.uploadImage(fd)
      setForm(f => ({ ...f, image:data.url||data.secure_url }))
      toast.success('Banner image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title||!form.image) { toast.error('Title and image are required'); return }
    setSaving(true)
    try {
      await bannerAPI.create(form)
      toast.success('Banner created!')
      setForm({ title:'', subtitle:'', link:'', image:'', active:true, order:0 })
      load()
    } catch (err) { toast.error(err.response?.data?.message||'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return
    try { await bannerAPI.delete(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold text-charcoal mb-6" style={{fontFamily:'var(--font-heading)'}}>Homepage Banners</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-bold text-charcoal mb-4">Add New Banner</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Headline *</label>
              <input type="text" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Reveal Your Natural Radiance" className="input-field" required/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
              <input type="text" value={form.subtitle} onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))} placeholder="Science-backed skincare for Indian skin" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">CTA Link</label>
              <input type="text" value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} placeholder="/shop" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Display Order</label>
              <input type="number" value={form.order} onChange={e=>setForm(f=>({...f,order:Number(e.target.value)}))} className="input-field" min="0"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Banner Image * (recommended: 1440×600px)</label>
            {form.image ? (
              <div className="relative rounded-xl overflow-hidden aspect-[21/6] mb-2">
                <img src={form.image} alt="Banner preview" className="w-full h-full object-cover"/>
                <button type="button" onClick={() => setForm(f=>({...f,image:''}))} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600">×</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all">
                <span className="text-3xl mb-2">🖼️</span>
                <span className="text-sm text-gray-500">Click to upload banner image</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG · Recommended: 1440×600px</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
              </label>
            )}
            {uploading && <p className="text-xs text-green-500 mt-1">Uploading…</p>}
            <div className="mt-2">
              <input type="url" value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))} placeholder="Or paste image URL directly" className="input-field text-xs py-2"/>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} className="w-4 h-4 accent-green-500"/>
            <span className="text-sm text-gray-600">Active (show on homepage)</span>
          </label>
          <button type="submit" disabled={saving} className="btn-primary btn-sm">{saving?'Saving…':'Add Banner'}</button>
        </form>
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="skeleton h-24 rounded-xl"/>)}</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-200">
          <span className="text-4xl block mb-2">🖼️</span>
          <p className="text-sm">No banners yet. Add your first hero banner above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map(banner => (
            <div key={banner._id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center">
              <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-charcoal text-sm truncate">{banner.title}</p>
                <p className="text-xs text-gray-400 truncate">{banner.subtitle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge text-[10px] ${banner.active?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{banner.active?'Active':'Inactive'}</span>
                  {banner.link && <span className="text-[10px] text-gray-400 font-mono">{banner.link}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(banner._id)} className="text-xs text-red-400 font-semibold hover:text-red-500 flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
