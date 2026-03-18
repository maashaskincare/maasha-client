import { useEffect, useState } from 'react'
import { categoryAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function Categories() {
  const [cats,    setCats]    = useState([])
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState({ name:'', slug:'', description:'', seoTitle:'', seoDescription:'' })
  const [editing, setEditing] = useState(null)
  const [saving,  setSaving]  = useState(false)

  const load = () => {
    setLoading(true)
    categoryAPI.getAll().then(r => setCats(r.data?.categories||r.data||[])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleNameChange = (val) => {
    setForm(f => ({
      ...f, name: val,
      slug: !editing ? val.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,'-').trim() : f.slug,
      seoTitle: !f.seoTitle ? `${val} Products — Maasha Skin Care` : f.seoTitle,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name) return
    setSaving(true)
    try {
      if (editing) { await categoryAPI.update(editing, form); toast.success('Category updated!') }
      else         { await categoryAPI.create(form);          toast.success('Category created!') }
      setForm({ name:'', slug:'', description:'', seoTitle:'', seoDescription:'' })
      setEditing(null)
      load()
    } catch (err) { toast.error(err.response?.data?.message||'Failed') }
    finally { setSaving(false) }
  }

  const handleEdit = (cat) => {
    setEditing(cat._id)
    setForm({ name:cat.name, slug:cat.slug, description:cat.description||'', seoTitle:cat.seoTitle||'', seoDescription:cat.seoDescription||'' })
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try { await categoryAPI.delete(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-charcoal mb-6" style={{fontFamily:'var(--font-heading)'}}>Categories</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-bold text-charcoal mb-4">{editing?'Edit Category':'Add New Category'}</h3>
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e=>handleNameChange(e.target.value)} placeholder="e.g. Face Serum" className="input-field" required/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-')}))} placeholder="face-serum" className="input-field font-mono"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} className="input-field resize-none" placeholder="Short category description"/>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">🔍 SEO</p>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SEO Title <span className="text-gray-300">({form.seoTitle.length}/60)</span></label>
                <input type="text" value={form.seoTitle} onChange={e=>setForm(f=>({...f,seoTitle:e.target.value}))} placeholder="Buy Face Serums Online India — Maasha Skin Care" className="input-field text-sm py-2" maxLength={70}/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description <span className="text-gray-300">({form.seoDescription.length}/160)</span></label>
                <textarea value={form.seoDescription} onChange={e=>setForm(f=>({...f,seoDescription:e.target.value}))} placeholder="Shop face serums for acne, pigmentation, glow..." rows={2} className="input-field text-sm resize-none" maxLength={170}/>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="btn-primary btn-sm">{saving?'Saving…':editing?'Update':'Add Category'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({name:'',slug:'',description:'',seoTitle:'',seoDescription:''}) }} className="btn-secondary btn-sm">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Name','Slug','Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({length:4}).map((_,i) => (
              <tr key={i} className="border-b border-gray-50">{[1,2,3].map(j => <td key={j} className="px-4 py-3"><div className="skeleton h-3 rounded w-24"/></td>)}</tr>
            )) : cats.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-sm">No categories yet</td></tr>
            ) : cats.map(cat => (
              <tr key={cat._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal text-sm">{cat.name}</td>
                <td className="px-4 py-3 text-xs font-mono text-gray-400">{cat.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(cat)} className="text-xs text-blue-500 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(cat._id,cat.name)} className="text-xs text-red-400 font-semibold">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
