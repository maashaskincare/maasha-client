import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    setLoading(true)
    productAPI.adminGetAll({ limit: 100 }).then(r => setProducts(r.data?.products||r.data||[])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try { await productAPI.delete(id); toast.success('Product deleted'); setProducts(p => p.filter(x => x._id !== id)) }
    catch { toast.error('Failed to delete') }
    finally { setDeleting(null) }
  }

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary btn-sm">+ Add Product</Link>
      </div>
      <div className="mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU…" className="input-field max-w-sm"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Product','SKU','Price','Stock','Status','Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:6}).map((_,i) => (
                <tr key={i} className="border-b border-gray-50">{[1,2,3,4,5,6].map(j => <td key={j} className="px-4 py-3"><div className="skeleton h-3 rounded w-24"/></td>)}</tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">{search?'No products match your search':'No products yet'}</td></tr>
              ) : filtered.map(p => (
                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url||'/placeholder-product.jpg'} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"/>
                      <div><p className="font-semibold text-charcoal text-xs">{p.name}</p><p className="text-[11px] text-gray-400">{p.category?.name}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{p.sku||'—'}</td>
                  <td className="px-4 py-3"><p className="font-semibold text-charcoal text-xs">₹{p.price}</p>{p.comparePrice&&<p className="text-[11px] text-gray-400 line-through">₹{p.comparePrice}</p>}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold ${p.stock>10?'text-green-600':p.stock>0?'text-yellow-600':'text-red-500'}`}>{p.stock} units</span></td>
                  <td className="px-4 py-3"><span className={`badge text-[10px] ${p.status==='published'?'bg-green-100 text-green-700':p.status==='draft'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-500'}`}>{p.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/${p._id}`} state={{ product: p }} className="text-xs text-blue-500 hover:text-blue-600 font-semibold">Edit</Link>
                      <button onClick={() => handleDelete(p._id,p.name)} disabled={deleting===p._id} className="text-xs text-red-400 hover:text-red-500 font-semibold">{deleting===p._id?'…':'Delete'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
