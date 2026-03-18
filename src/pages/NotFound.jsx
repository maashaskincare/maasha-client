import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found — 404" noIndex />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-20 px-4">
        <p className="text-9xl font-black mb-2" style={{color:'var(--color-primary)',opacity:0.1,fontFamily:'var(--font-heading)',lineHeight:1}}>404</p>
        <h1 className="text-2xl font-bold text-charcoal -mt-8 mb-3" style={{fontFamily:'var(--font-heading)'}}>Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-sm text-sm leading-relaxed">The page you're looking for doesn't exist or may have been moved.</p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/" className="btn-primary">← Go Home</Link>
          <Link to="/shop" className="btn-secondary">Browse Products</Link>
        </div>
      </div>
    </>
  )
}
