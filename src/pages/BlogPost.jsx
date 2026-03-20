import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import SEO, { articleSchema, breadcrumbSchema } from '../components/common/SEO'
import { blogAPI } from '../api/services'
import { BRAND } from '../constants'

export default function BlogPost() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const contentRef = useRef(null)
  const [post,     setPost]     = useState(null)
  const [related,  setRelated]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [toc,      setToc]      = useState([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    setLoading(true)
    blogAPI.getBySlug(slug)
      .then(r => {
        const p = r.data?.blog || r.data
        setPost(p)
        blogAPI.getAll({ category: p.category?.name || p.category, limit: 3 })
          .then(res => setRelated((res.data?.blogs||res.data||[]).filter(b => b.slug !== slug).slice(0,3)))
      })
      .catch(() => navigate('/blog'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!post?.content || !contentRef.current) return
    setTimeout(() => {
      const headings = contentRef.current?.querySelectorAll('h2, h3') || []
      const items = Array.from(headings).map((el, i) => {
        if (!el.id) el.id = `heading-${i}`
        return { id: el.id, text: el.textContent, level: el.tagName }
      })
      setToc(items)
    }, 100)
  }, [post])

  useEffect(() => {
    if (!toc.length) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id) }),
      { rootMargin: '-20% 0% -70% 0%' }
    )
    toc.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [toc])

  const readingTime = post?.content
    ? Math.max(1, Math.ceil(post.content.replace(/<[^>]+>/g,'').split(/\s+/).length / 200)) : 3

  if (loading) return (
    <div className="container-site py-12 max-w-3xl mx-auto space-y-4">
      <div className="skeleton h-8 w-3/4 rounded"/><div className="skeleton h-4 w-1/3 rounded"/>
      <div className="skeleton aspect-video rounded-2xl"/>
      {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-4 w-full rounded"/>)}
    </div>
  )
  if (!post) return null

  const shareUrl  = `${BRAND.website}/blog/${post.slug}`
  const shareText = encodeURIComponent(post.title)

  return (
    <>
      <SEO
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords || Array.isArray(post.tags) ? post.tags.join(', ') : post.tags||''}
        canonical={`/blog/${post.slug}`}
        image={post.featuredImage}
        type="article"
        schema={[
          articleSchema(post),
          breadcrumbSchema([{name:'Home',url:'/'},{name:'Blog',url:'/blog'},{name:post.title}]),
        ]}
      />
      {post.featuredImage && (
        <div className="w-full max-h-[480px] overflow-hidden">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" loading="eager"/>
        </div>
      )}
      <div className="container-site py-10">
        <div className="flex gap-10 max-w-6xl mx-auto">
          <article className="flex-1 min-w-0 max-w-3xl">
            <nav className="text-xs text-gray-400 mb-5 flex flex-wrap gap-1">
              <Link to="/" className="hover:text-green-500">Home</Link> <span>/</span>
              <Link to="/blog" className="hover:text-green-500">Blog</Link> <span>/</span>
              {post.category && <><Link to={`/blog?category=${typeof post.category === 'object' ? post.category.name : post.category}`} className="hover:text-green-500">{typeof post.category === 'object' ? post.category.name : post.category}</Link><span>/</span></>}
              <span className="text-charcoal line-clamp-1">{post.title}</span>
            </nav>
            <header className="mb-8">
              {post.category && <Link to={`/blog?category=${typeof post.category === 'object' ? post.category.name : post.category}`} className="inline-block badge-green text-xs mb-3">{typeof post.category === 'object' ? post.category.name : post.category}</Link>}
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal leading-tight mb-4" style={{fontFamily:'var(--font-heading)'}}>{post.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span>By <strong className="text-charcoal">{typeof post.author === 'object' ? post.author?.name || 'Maasha Skin Care' : post.author || 'Maasha Skin Care'}</strong></span>
                <span>·</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
                <span>·</span>
                <span>{readingTime} min read</span>
              </div>
            </header>
            {post.excerpt && (
              <div className="p-5 rounded-xl border-l-4 mb-8 text-gray-600 text-base italic" style={{borderColor:'var(--color-primary)',background:'#f0f7ef'}}>
                {post.excerpt}
              </div>
            )}
            {toc.length > 2 && (
              <div className="xl:hidden mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">In This Article</p>
                <ul className="space-y-1.5">
                  {toc.map(item => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className={`text-sm hover:text-green-500 transition-colors block ${item.level==='H3'?'pl-4 text-xs text-gray-400':'text-charcoal font-medium'}`}>{item.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div ref={contentRef}
              className="prose prose-base max-w-none text-gray-700 leading-relaxed prose-headings:font-heading prose-headings:text-charcoal prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-green-600 prose-a:font-medium prose-img:rounded-xl prose-img:my-6 prose-strong:text-charcoal"
              dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon.</p>' }}
            />
            {(Array.isArray(post.tags) ? post.tags.length > 0 : !!post.tags) && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-gray-400 mr-1">Tags:</span>
                {(Array.isArray(post.tags) ? post.tags : (post.tags||'').split(',').map(s=>s.trim())).filter(Boolean).map(tag => (
                  <Link key={tag} to={`/search?q=${tag}`} className="badge-green text-xs hover:bg-green-100 transition-colors">#{tag}</Link>
                ))}
              </div>
            )}
            <div className="mt-8 p-5 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-charcoal mb-3">Share this article:</p>
              <div className="flex gap-3 flex-wrap">
                <a href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{background:'#25D366'}}>WhatsApp</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{background:'#1877F2'}}>Facebook</a>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{background:'#000'}}>Twitter/X</a>
                <button onClick={() => navigator.clipboard?.writeText(shareUrl)} className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">Copy Link</button>
              </div>
            </div>
          </article>
          {toc.length > 2 && (
            <aside className="hidden xl:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">In This Article</p>
                <ul className="space-y-1.5">
                  {toc.map(item => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className={`block text-xs transition-colors leading-snug py-0.5 ${item.level==='H3'?'pl-3':''} ${activeId===item.id?'text-green-600 font-semibold':'text-gray-400 hover:text-green-500'}`}>{item.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
        {related.length > 0 && (
          <section className="mt-16 max-w-6xl mx-auto">
            <h2 className="section-heading mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(post => (
                <article key={post._id} className="card group overflow-hidden">
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-video overflow-hidden bg-green-50">
                      {post.featuredImage
                        ? <img src={post.featuredImage} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        : <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
                      }
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-charcoal group-hover:text-green-500 transition-colors line-clamp-2" style={{fontFamily:'var(--font-heading)'}}>{post.title}</h3>
                      <p className="text-xs font-semibold mt-3" style={{color:'var(--color-primary)'}}>Read →</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
