import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems, selectCartSubtotal, selectCartDiscount, selectCoupon, removeFromCart, updateQty, clearCart, applyCoupon, removeCoupon } from '../features/cart/cartSlice'
import SEO from '../components/common/SEO'
import { couponAPI } from '../api/services'
import { FREE_SHIPPING_THRESHOLD } from '../constants'
import toast from 'react-hot-toast'

export default function Cart() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const items     = useSelector(selectCartItems)
  const subtotal  = useSelector(selectCartSubtotal)
  const discount  = useSelector(selectCartDiscount)
  const coupon    = useSelector(selectCoupon)
  const [couponCode,    setCouponCode]    = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 60
  const total    = Math.max(0, subtotal - discount + shipping)

  const handleCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await couponAPI.validate(couponCode.trim().toUpperCase(), subtotal)
      dispatch(applyCoupon({ code: couponCode.toUpperCase(), discount: data.discountAmount || data.discount }))
      toast.success(`Coupon applied! You saved ₹${data.discountAmount || data.discount}`)
      setCouponCode('')
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon code') }
    finally { setCouponLoading(false) }
  }

  if (items.length === 0) return (
    <>
      <SEO title="Your Cart — Empty" noIndex />
      <div className="container-site py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-charcoal mb-3" style={{fontFamily:'var(--font-heading)'}}>Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet. Let's fix that!</p>
        <Link to="/shop" className="btn-primary px-8">Browse Products</Link>
      </div>
    </>
  )

  return (
    <>
      <SEO title="Your Cart" noIndex />
      <div className="container-site py-8 md:py-12">
        <h1 className="section-heading mb-8">Your Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-green-700 font-medium">🚚 Add ₹{FREE_SHIPPING_THRESHOLD - subtotal} more for free shipping!</span>
                  <span className="text-green-600 font-semibold">{Math.round((subtotal/FREE_SHIPPING_THRESHOLD)*100)}%</span>
                </div>
                <div className="h-1.5 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{width:`${Math.min(100,(subtotal/FREE_SHIPPING_THRESHOLD)*100)}%`}} />
                </div>
              </div>
            )}
            {items.map(item => (
              <div key={item._id} className="card p-4 flex gap-4">
                <Link to={`/product/${item.slug}`} className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <img src={item.images?.[0]?.url||'/placeholder-product.jpg'} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/product/${item.slug}`} className="font-semibold text-sm text-charcoal hover:text-green-500 transition-colors line-clamp-2" style={{fontFamily:'var(--font-heading)'}}>
                      {item.name}
                    </Link>
                    <button onClick={() => dispatch(removeFromCart(item._id))} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.category?.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => dispatch(updateQty({id:item._id,qty:item.qty-1}))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-sm font-bold">−</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => dispatch(updateQty({id:item._id,qty:item.qty+1}))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-sm font-bold">+</button>
                    </div>
                    <span className="font-bold text-sm" style={{color:'var(--color-primary)'}}>₹{(item.price*item.qty).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared') }} className="text-xs text-red-400 hover:text-red-500 transition-colors font-medium">Clear cart</button>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-charcoal mb-5" style={{fontFamily:'var(--font-heading)'}}>Order Summary</h2>
              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-4 border border-green-200">
                  <div><p className="text-xs font-bold text-green-700">{coupon}</p><p className="text-xs text-green-600">Saved ₹{discount}</p></div>
                  <button onClick={() => dispatch(removeCoupon())} className="text-red-400 hover:text-red-500 text-xs font-semibold">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code" className="input-field flex-1 py-2.5 text-xs uppercase"
                    onKeyDown={e => e.key==='Enter' && handleCoupon()} />
                  <button onClick={handleCoupon} disabled={couponLoading} className="btn-secondary btn-sm text-xs px-3">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              <div className="space-y-2.5 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount ({coupon})</span><span>-₹{discount}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shipping===0?'font-semibold text-green-500':''}>{shipping===0?'FREE 🎉':`₹${shipping}`}</span></div>
                <div className="border-t border-gray-200 pt-2.5 flex justify-between font-bold text-base"><span>Total</span><span style={{color:'var(--color-primary)'}}>₹{total.toLocaleString('en-IN')}</span></div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-5 py-3.5 text-sm font-bold">Proceed to Checkout →</button>
              <Link to="/shop" className="block text-center text-xs text-gray-400 hover:text-green-500 mt-3 transition-colors">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
