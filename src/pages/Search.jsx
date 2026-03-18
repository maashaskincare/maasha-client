import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import SEO from '../components/common/SEO'
import ProductCard from '../components/product/ProductCard'
import { productAPI } from '../api/services'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    productAPI.search(query)
      .then(r => setProducts(r.data?.products || r.data || []))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <>
      <SEO title={`Search: "${query}"`} noIndex />
      <div className="container-site py-10">
        <h1 className="section-heading mb-2">Search Results</h1>
        <p className="text-gray-400 text-sm mb-8">
          {loading ? 'Searching…' : `${products.length} result${products.length !== 1 ? 's' : ''} for "${query}"`}
        </p>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton aspect-square rounded-xl" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-gray-500 font-medium mb-2">No products found for "{query}"</p>
            <p className="text-gray-400 text-sm mb-6">Try searching with different keywords</p>
            <Link to="/shop" className="btn-primary btn-sm">Browse All Products</Link>
          </div>
        ) : null}
      </div>
    </>
  )
}
