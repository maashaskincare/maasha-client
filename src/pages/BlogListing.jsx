import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO, { breadcrumbSchema } from '../components/common/SEO'
import { blogAPI } from '../api/services'
import { BLOG_CATEGORIES, BLOGS_PER_PAGE } from '../constants'

export default function BlogListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogs,   setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [pages,   setPages]   = useState(1)
  const [total,   setTotal]   = useState(0)
  const category = searchParams.get('category') || ''

  useEffect(() => {
    setLoading(true)
    blogAPI.getAll({ page, limit: BLOGS_PER_PAGE, ...(category && { category }), sort: 'newest' })
      .then(r => { const d = r.data; setBlogs(d?.blogs||d||[]); setTotal(d?.total||0); setPages(d?.pages||1) })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [page, category])

  return (
    <>
      <SEO
        title="Skincare Blog — Tips, Guides & Expert Advice"
        description="Read expert skincare tips, ingredient guides, acne solutions, and sun protection advice on the Maasha Skin Care blog. For Indian skin types."
        keywords="skincare tips india, best serum for acne prone skin india, vitamin c serum benefits, how to remove dark spots naturally india"
        canonical="/blog"
        schema={breadcrumbSchema([{name:'Home',url:'/'},{name:'Blog',url:'/blog'}])}
      />
      <section className="py-12 md:py-16" style={{background:'linear-gradient(135deg, #f0f7ef 0%, #e8f5e9 100%)'}}>
        <div className="container-site text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{color:'var(--color-gold)'}}>Skincare Knowledge</p>
          <h1 className="section-heading mb-3">The Maasha Skin Care Blog</h1>
          <p className="text-gray-500">Expert tips, ingredient deep-dives, and personalised advice for every Indian skin type.</p>
        </div>
      </section>
      <div className="container-site py-10">
        <div className="flex gap-2 flex-wrap mb-8 overflow-x-auto pb-1 scrollbar-thin">
          <button onClick={() => { setSearchParams({}); setPage(1) }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${!category ? 'btn-primary' : 'border border-gray-200 text-gray-500 hover:border-green-300'}`}>
            All Articles
          </button>
          {BLOG_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setSearchParams({category:cat}); setPage(1) }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${category===cat ? 'btn-primary' : 'border border-gray-200 text-gray-500 hover:border-green-300'}`}>
              {cat}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="skeleton aspect-video" />
                <div className="p-5 space-y-3"><div className="skeleton h-3 w-1/3 rounded"/><div className="skeleton h-5 w-full rounded"/><div className="skeleton h-3 w-2/3 rounded"/></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20"><span className="text-5xl block mb-4">✍️</span><p className="text-gray-500">No articles yet. Check back soon!</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(post => (
              <article key={post._id} className="card group overflow-hidden">
                <Link to={`/blog/${post.slug}`}>
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                    {post.featuredImage
                      ? <img src={post.featuredImage} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      : <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                    }
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {post.category && <span className="badge-green text-[10px]">{post.category}</span>}
                      <span className="text-[11px] text-gray-400">{new Date(post.publishedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </div>
                    <h2 className="font-bold text-charcoal leading-snug group-hover:text-green-500 transition-colors line-clamp-2 mb-2" style={{fontFamily:'var(--font-heading)',fontSize:'1rem'}}>{post.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs font-semibold mt-4" style={{color:'var(--color-primary)'}}>Read Article →</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-secondary btn-sm text-xs disabled:opacity-40">← Prev</button>
            {Array.from({length:pages},(_,i)=>i+1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p===page?'btn-primary':'hover:bg-gray-100 text-gray-600'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="btn-secondary btn-sm text-xs disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </>
  )
}
