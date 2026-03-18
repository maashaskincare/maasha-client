import { useLocation, Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

export default function OrderSuccess() {
  const { state } = useLocation()
  return (
    <>
      <SEO title="Order Placed Successfully" noIndex />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center card p-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{background:'#e8f5e9'}}>✅</div>
          <h1 className="text-2xl font-bold text-charcoal mb-2" style={{fontFamily:'var(--font-heading)'}}>Order Placed!</h1>
          <p className="text-gray-500 mb-4">Thank you for shopping with Maasha Skin Care. Your order has been confirmed and will be shipped soon.</p>
          {state?.orderNumber && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200 mb-6">
              <p className="text-xs text-gray-500">Order Number</p>
              <p className="text-lg font-bold text-green-600">#{state.orderNumber}</p>
            </div>
          )}
          <p className="text-sm text-gray-400 mb-8">You'll receive an email confirmation shortly. Order usually ships in 1–2 business days.</p>
          <div className="flex flex-col gap-3">
            <Link to="/account?tab=orders" className="btn-primary w-full py-3">Track My Order</Link>
            <Link to="/shop" className="btn-secondary w-full py-3">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  )
}
