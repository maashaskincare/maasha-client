import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import { selectUser } from '../features/auth/authSlice'
import SEO, { productSchema, breadcrumbSchema, faqSchema } from '../components/common/SEO'
import StarRating from '../components/common/StarRating'
import ProductCard from '../components/product/ProductCard'
import { productAPI, reviewAPI } from '../api/services'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user     = useSelector(selectUser)
  const [product,      setProduct]      = useState(null)
  const [related,      setRelated]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeImg,    setActiveImg]    = useState(0)
  const [qty,          setQty]          = useState(1)
  const [activeTab,    setActiveTab]    = useState('description')
  const [reviewText,   setReviewText]   = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submitting,   setSubmitting]   = useState(false)

  useEffect(() => {
    setLoading(true); setActiveImg(0)
    productAPI.getBySlug(slug)
      .then(r => {
        const p = r.data?.product || r.data
        setProduct(p)
        const cat = p.category?.slug || p.category
        if (cat) productAPI.getAll({ category: cat, limit: 4 }).then(res => setRelated((res.data?.products||res.data||[]).filter(x => x.slug !== slug)))
      })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return
    dispatch(addToCart({ product, qty }))
    toast.success(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout') }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!reviewText.trim()) return
    setSubmitting(true)
    try {
      await reviewAPI.add(product._id, { rating: reviewRating, text: reviewText })
      toast.success('Review submitted! It will appear after approval.')
      setReviewText(''); setReviewRating(5)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review') }
    finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="container-site py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="skeleton aspect-square rounded-2xl"/>
        <div className="space-y-4">
          <div className="skeleton h-6 w-1/3 rounded"/><div className="skeleton h-10 w-full rounded"/>
          <div className="skeleton h-4 w-2/3 rounded"/><div className="skeleton h-16 w-full rounded"/>
          <div className="skeleton h-12 w-full rounded-xl"/>
        </div>
      </div>
    </div>
  )
  if (!product) return null

  const discount = product.comparePrice ? Math.round(((product.comparePrice-product.price)/product.comparePrice)*100) : 0

  const faqs = [
    { question:`What is ${product.name} used for?`, answer:product.shortDescription||product.description?.substring(0,200)||`${product.name} is a skincare product by Maasha Skin Care.` },
    { question:'How do I use this product?', answer:product.howToUse||'Apply a small amount on clean skin. Use as directed on the packaging.' },
    { question:'Is it suitable for sensitive skin?', answer:`${product.name} is ${product.skinTypes?.includes('sensitive')?'formulated for sensitive skin.':'suitable for most skin types. Do a patch test first if you have very sensitive skin.'}` },
    { question:'Are there any harmful chemicals?', answer:'No. Maasha Skin Care products are free from parabens, sulfates, and harmful chemicals. All ingredients are dermatologist-tested.' },
  ]

  return (
    <>
      <SEO
        title={`${product.name} — Buy Online India`}
        description={`Buy ${product.name} online in India. ${product.shortDescription||''} Key ingredients: ${product.ingredients?.join(', ')||''}. Ships pan-India from Bhopal.`}
        keywords={`buy ${product.name} india, ${product.name} price, ${product.category?.name||''} india, maasha skin care`}
        canonical={`/product/${product.slug}`}
        image={product.images?.[0]?.url}
        type="product"
        schema={[productSchema(product), breadcrumbSchema([{name:'Home',url:'/'},{name:'Shop',url:'/shop'},{name:product.name}]), faqSchema(faqs)]}
      />
      <div className="container-site py-8 md:py-12">
        <nav className="text-xs text-gray-400 mb-6 flex flex-wrap gap-1">
          <Link to="/" className="hover:text-green-500">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-green-500">Shop</Link><span>/</span>
          {product.category && <><Link to={`/shop?category=${product.category.slug}`} className="hover:text-green-500">{product.category.name}</Link><span>/</span></>}
          <span className="text-charcoal line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          <div className="flex flex-col gap-3">
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square">
              <img src={product.images?.[activeImg]?.url||'/placeholder-product.jpg'} alt={`${product.name} image ${activeImg+1}`} className="w-full h-full object-cover"/>
              {discount >= 5 && <span className="absolute top-4 left-4 badge-red text-xs font-bold px-3 py-1">{discount}% OFF</span>}
              {product.stock === 0 && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><span className="font-bold text-gray-500 text-lg">Out of Stock</span></div>}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
                {product.images.map((img,i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i===activeImg?'border-green-500':'border-transparent hover:border-gray-300'}`}>
                    <img src={img.url} alt={`${product.name} view ${i+1}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              {product.category?.name && <Link to={`/shop?category=${product.category.slug}`} className="inline-block text-xs font-semibold uppercase tracking-wider mb-2 hover:underline" style={{color:'var(--color-gold)'}}>{product.category.name}</Link>}
              <h1 className="text-2xl md:text-3xl font-bold text-charcoal leading-tight" style={{fontFamily:'var(--font-heading)'}}>{product.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{product.shortDescription}</p>
            </div>
            {product.ratings?.count > 0 && (
              <div className="flex items-center gap-2">
                <StarRating value={product.ratings.average} size="sm"/>
                <span className="text-sm font-semibold text-charcoal">{product.ratings.average.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.ratings.count} reviews)</span>
              </div>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold" style={{color:'var(--color-primary)'}}>₹{product.price}</span>
              {product.comparePrice && <><span className="text-lg text-gray-400 line-through">₹{product.comparePrice}</span><span className="badge-red text-sm font-bold px-3 py-1">{discount}% OFF</span></>}
            </div>
            <p className="text-xs text-gray-400">Inclusive of all taxes · Free shipping above ₹499</p>
            {product.ingredients?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Key Ingredients</p>
                <div className="flex flex-wrap gap-2">{product.ingredients.map(ing => <span key={ing} className="badge-green text-xs">{ing}</span>)}</div>
              </div>
            )}
            {product.skinTypes?.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium">For:</span>
                {product.skinTypes.map(s => <span key={s} className="capitalize text-charcoal font-medium">{s}</span>)}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-11 h-11 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors font-semibold">−</button>
                <span className="w-12 text-center font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock||10,q+1))} className="w-11 h-11 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors font-semibold">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock===0} className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">{product.stock===0?'Out of Stock':'🛒 Add to Cart'}</button>
              <button onClick={handleBuyNow} disabled={product.stock===0} className="flex-1 btn-gold py-3 disabled:opacity-50 disabled:cursor-not-allowed">Buy Now</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
              {[{icon:'🚚',text:'Pan-India Shipping'},{icon:'🔒',text:'Secure Payment'},{icon:'↩️',text:'Easy Returns'},{icon:'✅',text:'Authentic Product'}].map(b => (
                <div key={b.text} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-[11px] text-gray-500 font-medium leading-tight">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-thin">
            {['description','ingredients','how-to-use','reviews','faq'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all capitalize border-b-2 -mb-px ${activeTab===tab?'border-green-500 text-green-600 font-semibold':'border-transparent text-gray-500 hover:text-charcoal'}`}>
                {tab.replace('-',' ')}
              </button>
            ))}
          </div>
          <div className="py-8 max-w-3xl">
            {activeTab==='description' && <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{__html:product.description||product.shortDescription||''}}/>}
            {activeTab==='ingredients' && (
              <div>
                <h2 className="text-lg font-bold text-charcoal mb-4" style={{fontFamily:'var(--font-heading)'}}>Active Ingredients</h2>
                <div className="space-y-3">
                  {(product.ingredients||[]).map(ing => (
                    <div key={ing} className="flex items-start gap-3 p-4 rounded-xl bg-green-50">
                      <span className="text-green-500 text-lg flex-shrink-0">🌿</span>
                      <div><p className="font-semibold text-charcoal text-sm">{ing}</p><p className="text-xs text-gray-500 mt-0.5">Natural active ingredient</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab==='how-to-use' && (
              <div>
                <h2 className="text-lg font-bold text-charcoal mb-4" style={{fontFamily:'var(--font-heading)'}}>How to Use {product.name}</h2>
                {product.howToUse
                  ? <div className="prose prose-sm text-gray-600" dangerouslySetInnerHTML={{__html:product.howToUse}}/>
                  : <ol className="space-y-3">{['Cleanse your face with a gentle face wash','Pat dry with a clean towel',`Apply ${product.name} as directed`,'Follow with moisturiser if needed','Use SPF 50 sunscreen during daytime'].map((step,i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{background:'var(--color-primary)'}}>{i+1}</span>
                      <p className="text-sm text-gray-600 pt-1">{step}</p>
                    </li>
                  ))}</ol>
                }
              </div>
            )}
            {activeTab==='reviews' && (
              <div>
                <h2 className="text-lg font-bold text-charcoal mb-6" style={{fontFamily:'var(--font-heading)'}}>Customer Reviews</h2>
                {product.ratings?.count > 0 && (
                  <div className="flex items-center gap-6 p-5 bg-gray-50 rounded-xl mb-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold" style={{fontFamily:'var(--font-heading)',color:'var(--color-primary)'}}>{product.ratings.average.toFixed(1)}</p>
                      <StarRating value={product.ratings.average} size="sm"/>
                      <p className="text-xs text-gray-400 mt-1">{product.ratings.count} reviews</p>
                    </div>
                  </div>
                )}
                <div className="border border-gray-200 rounded-xl p-5 mb-6">
                  <h3 className="font-semibold text-charcoal mb-4 text-sm">Write a Review</h3>
                  {!user ? (
                    <p className="text-sm text-gray-500"><Link to="/login" className="text-green-500 font-semibold hover:underline">Login</Link> to write a review</p>
                  ) : (
                    <form onSubmit={handleReview} className="space-y-3">
                      <div><p className="text-xs text-gray-400 mb-1">Your rating</p><StarRating value={reviewRating} size="md" onChange={setReviewRating}/></div>
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience with this product..." rows={3} className="input-field resize-none" required/>
                      <button type="submit" disabled={submitting} className="btn-primary btn-sm">{submitting?'Submitting...':'Submit Review'}</button>
                    </form>
                  )}
                </div>
                {product.reviews?.filter(r=>r.approved).length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.filter(r=>r.approved).map(r => (
                      <div key={r._id} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2"><StarRating value={r.rating} size="xs"/>{r.verifiedPurchase && <span className="badge-green text-[10px]">✓ Verified</span>}</div>
                        <p className="text-sm text-gray-600">{r.text}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span className="font-medium text-charcoal">{r.user?.name||'Anonymous'}</span><span>·</span>
                          <span>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400">No reviews yet. Be the first to review!</p>}
              </div>
            )}
            {activeTab==='faq' && (
              <div>
                <h2 className="text-lg font-bold text-charcoal mb-4" style={{fontFamily:'var(--font-heading)'}}>Frequently Asked Questions</h2>
                <div className="space-y-3">{faqs.map((faq,i) => <FAQItem key={i} question={faq.question} answer={faq.answer}/>)}</div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="section-heading mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.slice(0,4).map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
        <span className="text-sm font-medium text-charcoal pr-4">{question}</span>
        <span className={`text-gray-400 flex-shrink-0 transition-transform ${open?'rotate-180':''}`}>▾</span>
      </button>
      {open && <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{answer}</div>}
    </div>
  )
}
