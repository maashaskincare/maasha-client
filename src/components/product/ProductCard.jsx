import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../features/cart/cartSlice'
import StarRating from '../common/StarRating'
import toast from 'react-hot-toast'

export default function ProductCard({ product, view = 'grid' }) {
  const [wishlist, setWishlist] = useState(() => {
    try { const wl = JSON.parse(localStorage.getItem('maasha_wishlist') || '[]'); return wl.includes(product._id) }
    catch { return false }
  })
  const [adding, setAdding] = useState(false)
  const dispatch = useDispatch()

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0

  const toggleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation()
    try {
      const wl = JSON.parse(localStorage.getItem('maasha_wishlist') || '[]')
      const updated = wishlist ? wl.filter(id => id !== product._id) : [...wl, product._id]
      localStorage.setItem('maasha_wishlist', JSON.stringify(updated))
      setWishlist(!wishlist)
      toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist ♥')
    } catch {}
  }

  const handleAddToCart = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (product.stock === 0) return
    setAdding(true)
    dispatch(addToCart({ product, qty: 1 }))
    toast.success(`${product.name} added to cart!`)
    setTimeout(() => setAdding(false), 600)
  }

  if (view === 'list') return (
    <article className="card flex flex-row gap-4 p-4">
      <Link to={`/product/${product.slug}`} className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
        <img src={product.images?.[0]?.url || '/placeholder-product.jpg'} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div>
          {product.category?.name && <span className="text-[10px] font-medium uppercase tracking-wide" style={{color:'var(--color-gold)'}}>{product.category.name}</span>}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-charcoal hover:text-green-500 transition-colors line-clamp-2" style={{fontFamily:'var(--font-heading)'}}>{product.name}</h3>
          </Link>
          {product.ratings?.count > 0 && (
            <div className="flex items-center gap-1 mt-1"><StarRating value={product.ratings.average} size="xs" /><span className="text-[10px] text-gray-400">({product.ratings.count})</span></div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{color:'var(--color-primary)'}}>₹{product.price}</span>
            {product.comparePrice && <span className="text-xs text-gray-400 line-through">₹{product.comparePrice}</span>}
            {discount >= 5 && <span className="badge-red text-[10px] px-1.5">{discount}% off</span>}
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0 || adding}
            className={`btn-primary btn-sm text-xs px-3 py-1.5 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {adding ? '✓' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  )

  return (
    <article className="card group relative flex flex-col">
      <button onClick={toggleWishlist} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-card transition-all hover:scale-110">
        <svg className="w-4 h-4" fill={wishlist ? '#E53935' : 'none'} stroke={wishlist ? '#E53935' : '#9CA3AF'} strokeWidth={2} viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      {discount >= 5 && <span className="absolute top-3 left-3 z-10 badge-red text-[10px] font-bold px-2 py-0.5">-{discount}%</span>}
      {product.stock === 0 && <span className="absolute top-3 left-3 z-10 badge text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500">Out of Stock</span>}
      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-gray-50 aspect-square">
        <img src={product.images?.[0]?.url || '/placeholder-product.jpg'} alt={product.name} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="p-4 flex flex-col flex-1 gap-2">
        {product.category?.name && <span className="text-[11px] font-medium tracking-wide uppercase" style={{color:'var(--color-gold)'}}>{product.category.name}</span>}
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-charcoal leading-snug line-clamp-2 hover:text-green-500 transition-colors" style={{fontFamily:'var(--font-heading)'}}>{product.name}</h3>
        </Link>
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-1.5"><StarRating value={product.ratings.average} size="xs" /><span className="text-[11px] text-gray-400">({product.ratings.count})</span></div>
        )}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-base font-bold" style={{color:'var(--color-primary)'}}>₹{product.price}</span>
          {product.comparePrice && <span className="text-xs text-gray-400 line-through">₹{product.comparePrice}</span>}
        </div>
        <button onClick={handleAddToCart} disabled={product.stock === 0 || adding}
          className={`w-full mt-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : adding ? 'bg-green-400 text-white' : 'btn-primary'}`}>
          {product.stock === 0 ? 'Out of Stock' : adding ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}
