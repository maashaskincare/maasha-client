import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems, selectCartSubtotal, selectCartDiscount, selectCoupon, clearCart } from '../features/cart/cartSlice'
import { selectUser } from '../features/auth/authSlice'
import SEO from '../components/common/SEO'
import { orderAPI } from '../api/services'
import { RAZORPAY_KEY, FREE_SHIPPING_THRESHOLD, BRAND } from '../constants'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const items     = useSelector(selectCartItems)
  const subtotal  = useSelector(selectCartSubtotal)
  const discount  = useSelector(selectCartDiscount)
  const coupon    = useSelector(selectCoupon)
  const user      = useSelector(selectUser)
  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 60
  const total     = Math.max(0, subtotal - discount + shipping)
  const [step,      setStep]      = useState(1)
  const [loading,   setLoading]   = useState(false)
  const [payMethod, setPayMethod] = useState('razorpay')
  const [address, setAddress] = useState({
    fullName: user?.name||'', phone: user?.phone||'', email: user?.email||'',
    line1:'', line2:'', city:'', state:'', pincode:'',
  })

  useEffect(() => { if (items.length === 0) navigate('/cart') }, [items.length])

  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    document.body.appendChild(s)
    return () => { if (document.body.contains(s)) document.body.removeChild(s) }
  }, [])

  const handleAddress = (e) => {
    e.preventDefault()
    const { fullName, phone, line1, city, state, pincode } = address
    if (!fullName||!phone||!line1||!city||!state||!pincode) { toast.error('Please fill all required fields'); return }
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        items: items.map(i => ({ product:i._id, name:i.name, price:i.price, qty:i.qty, image:i.images?.[0]?.url||'' })),
        shippingAddress: address, paymentMethod: payMethod,
        subtotal, discount, shipping, total, coupon: coupon||'',
      }
      const { data } = await orderAPI.create(orderData)
      if (payMethod === 'cod') {
        dispatch(clearCart())
        navigate('/order-success', { state: { orderId: data.order._id, orderNumber: data.order.orderNumber } })
        return
      }
      const options = {
        key: RAZORPAY_KEY,
        amount: data.razorpayOrder.amount,
        currency: 'INR',
        name: BRAND.name,
        description: 'Maasha Skin Care Order',
        order_id: data.razorpayOrder.id,
        prefill: { name: address.fullName, email: address.email, contact: address.phone },
        theme: { color: '#2D5A27' },
        handler: async (response) => {
          try {
            await orderAPI.verifyPayment({
              orderId: data.order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            dispatch(clearCart())
            navigate('/order-success', { state: { orderId: data.order._id, orderNumber: data.order.orderNumber } })
          } catch { toast.error('Payment verification failed. Contact support.') }
        },
        modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled') } }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Checkout" noIndex />
      <div className="container-site py-8 md:py-12 max-w-5xl">
        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {['Delivery Address','Payment'].map((s,i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-gray-200"/>}
              <div className={`flex items-center gap-2 ${step>i+1?'text-green-500':step===i+1?'text-charcoal':'text-gray-300'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step>i+1?'bg-green-500 border-green-500 text-white':step===i+1?'border-green-500 text-green-500':'border-gray-200 text-gray-300'}`}>
                  {step>i+1?'✓':i+1}
                </span>
                <span className="text-sm font-medium hidden sm:block">{s}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleAddress} className="space-y-5">
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-charcoal mb-5" style={{fontFamily:'var(--font-heading)'}}>Delivery Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {label:'Full Name *',key:'fullName',placeholder:'Your full name'},
                      {label:'Phone *',key:'phone',placeholder:'+91 XXXXX XXXXX'},
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                        <input type="text" value={address[f.key]} onChange={e => setAddress(a=>({...a,[f.key]:e.target.value}))} placeholder={f.placeholder} className="input-field"/>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <input type="email" value={address.email} onChange={e => setAddress(a=>({...a,email:e.target.value}))} placeholder="email@example.com" className="input-field"/>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Address Line 1 *</label>
                      <input type="text" value={address.line1} onChange={e => setAddress(a=>({...a,line1:e.target.value}))} placeholder="House No., Street Name" className="input-field"/>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Address Line 2</label>
                      <input type="text" value={address.line2} onChange={e => setAddress(a=>({...a,line2:e.target.value}))} placeholder="Area, Landmark (optional)" className="input-field"/>
                    </div>
                    {[
                      {label:'City *',key:'city',placeholder:'City'},
                      {label:'State *',key:'state',placeholder:'State'},
                      {label:'Pincode *',key:'pincode',placeholder:'6-digit pincode'},
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                        <input type="text" value={address[f.key]} onChange={e => setAddress(a=>({...a,[f.key]:e.target.value}))} placeholder={f.placeholder} className="input-field"/>
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn-primary w-full mt-6 py-3.5">Continue to Payment →</button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="card p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Delivering to</p>
                    <p className="text-sm font-semibold text-charcoal">{address.fullName}</p>
                    <p className="text-xs text-gray-500">{address.line1}, {address.city}, {address.state} – {address.pincode}</p>
                    <p className="text-xs text-gray-500">{address.phone}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs text-green-500 font-semibold hover:underline flex-shrink-0">Change</button>
                </div>
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-charcoal mb-5" style={{fontFamily:'var(--font-heading)'}}>Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      {value:'razorpay',label:'Pay Online',desc:'UPI, Cards, Net Banking, Wallets',icon:'💳'},
                      {value:'cod',label:'Cash on Delivery',desc:'Pay when your order arrives',icon:'💵'},
                    ].map(m => (
                      <label key={m.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod===m.value?'border-green-500 bg-green-50':'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value={m.value} checked={payMethod===m.value} onChange={() => setPayMethod(m.value)} className="accent-green-500"/>
                        <span className="text-2xl">{m.icon}</span>
                        <div><p className="font-semibold text-charcoal text-sm">{m.label}</p><p className="text-xs text-gray-400">{m.desc}</p></div>
                      </label>
                    ))}
                  </div>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-gold w-full mt-6 py-4 text-base font-bold disabled:opacity-60">
                    {loading?'Processing…':`Place Order — ₹${total.toLocaleString('en-IN')}`}
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-3">🔒 100% Secure · SSL Encrypted</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card p-5 sticky top-24">
              <h3 className="font-bold text-charcoal mb-4 text-sm" style={{fontFamily:'var(--font-heading)'}}>Order Summary ({items.length} items)</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                {items.map(item => (
                  <div key={item._id} className="flex gap-3">
                    <img src={item.images?.[0]?.url||'/placeholder-product.jpg'} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-50"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-charcoal line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <p className="text-xs font-bold text-charcoal">₹{(item.price*item.qty).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{discount}</span></div>}
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span className={shipping===0?'text-green-600 font-semibold':''}>{shipping===0?'FREE':`₹${shipping}`}</span></div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-gray-100"><span>Total</span><span style={{color:'var(--color-primary)'}}>₹{total.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
