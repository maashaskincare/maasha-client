import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { blogAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function Blogs() {
  const [blogs,   setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [del,     setDel]     = useState(null)

  const load = () => {
    setLoading(true)
    blogAPI.adminGetAll({ limit: 100 }).then(r => setBlogs(r.data?.blogs||r.data||[])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    setDel(id)
    try { await blogAPI.delete(id); toast.success('Blog deleted'); setBlogs(b => b.filter(x => x._id !== id)) }
    catch { toast.error('Failed to delete') }
    finally { setDel(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>Blog Posts</h1>
          <p className="text-sm text-gray-400 mt-0.5">{blogs.length} posts</p>
        </div>
        <Link to="/admin/blogs/new" className="btn-primary btn-sm">+ New Post</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Title','Category','Status','Date','Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:4}).map((_,i) => (
                <tr key={i} className="border-b border-gray-50">{[1,2,3,4,5].map(j => <td key={j} className="px-4 py-3"><div className="skeleton h-3 rounded w-24"/></td>)}</tr>
              )) : blogs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No blog posts yet</td></tr>
              ) : blogs.map(blog => (
                <tr key={blog._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal text-xs line-clamp-1 max-w-xs">{blog.title}</p>
                    <p className="text-[11px] text-gray-400 font-mono">/blog/{blog.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{blog.category||'—'}</td>
                  <td className="px-4 py-3"><span className={`badge text-[10px] ${blog.status==='published'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{blog.status}</span></td>
                  <td className="px-4 py-3 text-[11px] text-gray-400">{blog.publishedAt?new Date(blog.publishedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'}):'—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/blogs/${blog._id}`} className="text-xs text-blue-500 font-semibold hover:underline">Edit</Link>
                      <Link to={`/blog/${blog.slug}`} target="_blank" className="text-xs text-gray-400 font-semibold hover:text-green-500">View</Link>
                      <button onClick={() => handleDelete(blog._id,blog.title)} disabled={del===blog._id} className="text-xs text-red-400 font-semibold hover:text-red-500">{del===blog._id?'…':'Delete'}</button>
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
