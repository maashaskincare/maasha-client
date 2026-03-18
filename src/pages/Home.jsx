import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeaturedProducts, selectFeatured, selectProductLoading } from '../features/product/productSlice'
import SEO, { organizationSchema } from '../components/common/SEO'
import ProductCard from '../components/product/ProductCard'
import { USPS, FREE_SHIPPING_THRESHOLD } from '../constants'
import { blogAPI, bannerAPI } from '../api/services'

const STATIC_PRODUCTS = [
  { slug:'hydrating-lotion',      name:'Hydrating Lotion',      category:'Moisturiser', price:349, emoji:'🌿' },
  { slug:'no-scars-serum',        name:'No Scars Serum',         category:'Face Serum',  price:499, emoji:'✨' },
  { slug:'acne-control-serum',    name:'Acne Control Serum',     category:'Face Serum',  price:449, emoji:'💧' },
  { slug:'gel-sunscreen-spf50',   name:'SPF 50 Gel Sunscreen',   category:'Sunscreen',   price:399, emoji:'☀️' },
  { slug:'foaming-face-wash',     name:'Foaming Face Wash',      category:'Face Wash',   price:299, emoji:'🫧' },
  { slug:'de-pigmentation-serum', name:'De Pigmentation Serum',  category:'Face Serum',  price:549, emoji:'💫' },
  { slug:'hydra-glow-serum',      name:'Hydra Glow Serum',       category:'Face Serum',  price:599, emoji:'⭐' },
]

const STATIC_BLOGS = [
  { title:'How to Choose the Right Serum for Your Skin Type', slug:'choose-right-serum-skin-type', category:'Skincare Tips', excerpt:"With so many serums available, finding the right one for your skin can be overwhelming. This guide breaks it down simply.", publishedAt: new Date().toISOString() },
  { title:'Vitamin C Serum Benefits for Indian Skin — Complete Guide', slug:'vitamin-c-serum-benefits-indian-skin', category:'Ingredients', excerpt:"Vitamin C is one of the most powerful skincare ingredients. Here's everything you need to know about using it for glowing skin.", publishedAt: new Date().toISOString() },
  { title:'Best Sunscreen for Oily Skin in India — No White Cast', slug:'best-sunscreen-oily-skin-india', category:'Sun Protection', excerpt:"Finding a sunscreen that doesn't leave a white cast or feel greasy is a challenge for oily skin types. Here are our top picks.", publishedAt: new Date().toISOString() },
]

const TESTIMONIALS = [
  { name:'Priya Sharma',  location:'Bhopal',   text:'The No Scars Serum has genuinely transformed my skin. Dark spots from acne have visibly faded in just 3 weeks. I recommend it to all my friends!' },
  { name:'Ankit Verma',   location:'Indore',   text:"Finally a sunscreen that doesn't leave white cast on my wheatish skin. The SPF 50 gel feels so light. Maasha Skin Care is my go-to brand now." },
  { name:'Meena Patel',   location:'Jabalpur', text:'Hydrating lotion is perfect for my combination skin. It absorbs quickly, no greasiness. My skin feels soft and plump all day.' },
  { name:'Ravi Kumar',    location:'Delhi',    text:'Acne Control Serum worked wonders for my oily T-zone. No more breakouts after 4 weeks of use. Super affordable too!' },
  { name:'Sneha Joshi',   location:'Mumbai',   text:'The Foaming Face Wash is so gentle yet deeply cleanses. My skin glows after each wash. Will definitely repurchase!' },
  { name:'Divya Mishra',  location:'Bhopal',   text:'De Pigmentation Serum is brilliant! My skin tone has become much more even and brighter. Highly recommend for hyperpigmentation.' },
]

export default function Home() {
  const dispatch  = useDispatch()
  const featured  = useSelector(selectFeatured)
  const loading   = useSelector(selectProductLoading)
  const [blogs,      setBlogs]      = useState([])
  const [banners,    setBanners]    = useState([])
  const [heroBanner, setHeroBanner] = useState(0)

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
    blogAPI.getRecent().then(r => setBlogs(r.data?.blogs || r.data || [])).catch(() => {})
    bannerAPI.getAll().then(r => setBanners(r.data?.banners || r.data || [])).catch(() => {})
  }, [dispatch])

  useEffect(() => {
    if (banners.length < 2) return
    const t = setInterval(() => setHeroBanner(p => (p+1) % banners.length), 4500)
    return () => clearInterval(t)
  }, [banners.length])

  return (
    <>
      <SEO
        title="Maasha Skin Care — Reveal Your Natural Radiance"
        description="Shop science-backed skincare with natural active ingredients for Indian skin. Serums, face wash, sunscreen & moisturisers. Ships pan-India from Bhopal, MP. Dermatologist tested, no harmful chemicals."
        keywords="maasha skin care, best face serum india, vitamin c serum bhopal, acne control serum india, hydrating lotion india, sunscreen spf 50 india, skincare bhopal madhya pradesh"
        canonical="/"
        schema={organizationSchema()}
      />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{minHeight:'clamp(380px, 55vw, 600px)'}}>
        {banners.length > 0 ? (
          <div className="absolute inset-0">
            <img src={banners[heroBanner]?.image} alt={banners[heroBanner]?.title||'Maasha Skin Care'} className="w-full h-full object-cover" loading="eager"/>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"/>
          </div>
        ) : (
          <div className="absolute inset-0" style={{background:'linear-gradient(135deg, #1c3f19 0%, #2D5A27 40%, #4e9b47 100%)'}}>
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10 bg-white"/>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-10 bg-white"/>
          </div>
        )}
        <div className="relative z-10 container-site h-full flex items-center" style={{minHeight:'clamp(380px, 55vw, 600px)'}}>
          <div className="max-w-lg py-16 animate-slide-up">
            <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4 px-3 py-1 rounded-full" style={{background:'rgba(184,134,11,0.3)',color:'#f9d87a',border:'1px solid rgba(184,134,11,0.4)'}}>
              ® Registered Brand
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" style={{fontFamily:'var(--font-heading)'}}>
              {banners[heroBanner]?.title || 'Reveal Your Natural Radiance'}
            </h1>
            <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed max-w-md">
              {banners[heroBanner]?.subtitle || 'Science-backed skincare with natural active ingredients. Crafted for every Indian skin type — oily, dry, sensitive, or combination.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="btn-gold px-8 py-3.5 text-sm font-bold shadow-lg">Shop Now →</Link>
              <Link to="/skin-quiz" className="px-8 py-3.5 text-sm font-semibold rounded-lg transition-all border-2 border-white/40 text-white hover:bg-white hover:text-green-700">Take Skin Quiz</Link>
            </div>
          </div>
        </div>
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_,i) => (
              <button key={i} onClick={() => setHeroBanner(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i===heroBanner?'w-6 bg-white':'w-1.5 bg-white/40'}`}/>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="py-10 border-b border-gray-100">
        <div className="container-site">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              {label:'Face Serum',  slug:'face-serum',  emoji:'💧',color:'#e8f5e9'},
              {label:'Face Wash',   slug:'face-wash',   emoji:'🫧',color:'#e3f2fd'},
              {label:'Moisturiser', slug:'moisturiser', emoji:'🌿',color:'#f1f8e9'},
              {label:'Sunscreen',   slug:'sunscreen',   emoji:'☀️',color:'#fffde7'},
              {label:'Combo',       slug:'combo',       emoji:'🎁',color:'#fce4ec'},
              {label:'New Arrivals',slug:'new-arrivals',emoji:'✨',color:'#f3e5f5'},
            ].map(cat => (
              <Link key={cat.slug} to={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1"
                style={{background:cat.color}}>
                <span className="text-2xl sm:text-3xl">{cat.emoji}</span>
                <span className="text-xs font-semibold text-charcoal text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-py">
        <div className="container-site">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{color:'var(--color-gold)'}}>Our Products</p>
              <h2 className="section-heading">Featured Skincare</h2>
              <p className="section-subheading">Handpicked products for your skin's best health</p>
            </div>
            <Link to="/shop" className="hidden sm:flex btn-secondary btn-sm text-xs">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <div className="skeleton aspect-square w-full"/>
                  <div className="p-4 space-y-2"><div className="skeleton h-3 w-3/4 rounded"/><div className="skeleton h-4 w-full rounded"/><div className="skeleton h-3 w-1/2 rounded"/></div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.slice(0,8).map(product => <ProductCard key={product._id} product={product}/>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {STATIC_PRODUCTS.map(p => (
                <Link key={p.slug} to="/shop" className="card group">
                  <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    <span className="text-4xl">{p.emoji}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide mb-1" style={{color:'var(--color-gold)'}}>{p.category}</p>
                    <h3 className="text-sm font-semibold text-charcoal leading-snug mb-2" style={{fontFamily:'var(--font-heading)'}}>{p.name}</h3>
                    <p className="font-bold text-sm" style={{color:'var(--color-primary)'}}>₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="sm:hidden text-center mt-6"><Link to="/shop" className="btn-secondary btn-sm text-sm">View All Products →</Link></div>
        </div>
      </section>

      {/* USP Strip */}
      <section className="py-10" style={{background:'var(--color-primary)'}}>
        <div className="container-site">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {USPS.map(usp => (
              <div key={usp.title} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <span className="text-3xl flex-shrink-0">{usp.icon}</span>
                <div><p className="font-bold text-white text-sm">{usp.title}</p><p className="text-white/70 text-xs mt-0.5">{usp.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skin Quiz CTA */}
      <section className="section-py" style={{background:'linear-gradient(135deg, #f9f9f9 0%, #f0f7ef 100%)'}}>
        <div className="container-site">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block text-2xl mb-4">🧬</span>
            <h2 className="section-heading mb-3">Not Sure What Your Skin Needs?</h2>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">Take our free 60-second skin quiz and get personalised product recommendations tailored to your skin type, concerns, and goals.</p>
            <Link to="/skin-quiz" className="btn-primary px-10 py-4 text-sm font-bold shadow-lg">Start Free Skin Quiz →</Link>
            <p className="text-xs text-gray-400 mt-3">Takes less than 60 seconds · Free · No sign-up required</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-py bg-white">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{color:'var(--color-gold)'}}>Happy Customers</p>
            <h2 className="section-heading">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="card p-6 flex flex-col gap-3">
                <div className="flex text-yellow-400 gap-0.5">{'★★★★★'.split('').map((s,j) => <span key={j} className="text-sm">{s}</span>)}</div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{background:'var(--color-primary)'}}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location} · Verified Purchase</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Previews */}
      <section className="section-py" style={{background:'#f9f9f9'}}>
        <div className="container-site">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{color:'var(--color-gold)'}}>Skincare Knowledge</p>
              <h2 className="section-heading">Latest from Our Blog</h2>
              <p className="section-subheading">Expert skincare tips, ingredient guides & more</p>
            </div>
            <Link to="/blog" className="hidden sm:flex btn-secondary btn-sm text-xs">All Articles →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(blogs.length > 0 ? blogs.slice(0,3) : STATIC_BLOGS).map((post,i) => (
              <article key={post._id||i} className="card group overflow-hidden">
                <Link to={`/blog/${post.slug||'#'}`}>
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                    {post.featuredImage
                      ? <img src={post.featuredImage} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      : <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                    }
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {post.category && <span className="badge-green text-[10px]">{post.category}</span>}
                      <span className="text-[11px] text-gray-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : ''}</span>
                    </div>
                    <h3 className="font-semibold text-charcoal leading-snug group-hover:text-green-500 transition-colors mb-2 line-clamp-2" style={{fontFamily:'var(--font-heading)',fontSize:'1rem'}}>{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <p className="text-xs font-semibold mt-4" style={{color:'var(--color-primary)'}}>Read Article →</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className="sm:hidden text-center mt-6"><Link to="/blog" className="btn-secondary btn-sm text-sm">All Articles →</Link></div>
        </div>
      </section>

      {/* Free Shipping CTA */}
      <section className="py-12" style={{background:'#1A1A1A'}}>
        <div className="container-site">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-2" style={{fontFamily:'var(--font-heading)'}}>Free Shipping on Orders Above ₹{FREE_SHIPPING_THRESHOLD}</h2>
            <p className="text-white/60 text-sm mb-6">Ships pan-India from Bhopal, MP · 3–7 working days</p>
            <Link to="/shop" className="btn-gold px-8 py-3.5 text-sm font-bold">Shop Now & Save</Link>
          </div>
        </div>
      </section>
    </>
  )
}
