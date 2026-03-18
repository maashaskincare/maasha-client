import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO, { breadcrumbSchema } from '../components/common/SEO'
import ProductCard from '../components/product/ProductCard'
import { productAPI, categoryAPI } from '../api/services'
import { SKIN_TYPES, PRODUCTS_PER_PAGE } from '../constants'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [pages,      setPages]      = useState(1)
  const [view,       setView]       = useState('grid')
  const [sidebarOpen,setSidebarOpen]= useState(false)

  const category = searchParams.get('category') || ''
  const skinType = searchParams.get('skinType') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sort     = searchParams.get('sort')     || 'newest'
  const search   = searchParams.get('q')        || ''

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value); else p.delete(key)
    p.delete('page'); setPage(1); setSearchParams(p)
  }

  const clearFilters = () => { setSearchParams({}); setPage(1) }

  const activeFilterCount = [category, skinType, minPrice, maxPrice].filter(Boolean).length

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data?.categories || r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page, limit: PRODUCTS_PER_PAGE, ...(category&&{category}), ...(skinType&&{skinType}), ...(minPrice&&{minPrice}), ...(maxPrice&&{maxPrice}), ...(sort&&{sort}), ...(search&&{search}) }
    productAPI.getAll(params)
      .then(r => { const d = r.data; setProducts(d?.products||d||[]); setTotal(d?.total||d?.length||0); setPages(d?.pages||1) })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, skinType, minPrice, maxPrice, sort, search, page])

  return (
    <>
      <SEO
        title={search ? `Search: "${search}" — Shop` : category ? `${category.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} — Shop` : 'Shop All Skincare Products'}
        description={`Shop ${total||'all'} skincare products${category?` in ${category}`:''} at Maasha Skin Care. Science-backed serums, face wash, sunscreen & moisturisers for Indian skin. Ships pan-India.`}
        keywords={`buy skincare india, ${category||'face serum'} india, maasha skin care shop`}
        canonical={`/shop${category?`?category=${category}`:''}`}
        schema={breadcrumbSchema([{name:'Home',url:'/'},{name:'Shop',url:'/shop'}])}
      />
      <div className="container-site py-8">
        <div className="mb-6">
          <nav className="text-xs text-gray-400 mb-2">
            <span>Home</span><span className="mx-1">/</span><span className="text-charcoal">Shop</span>
            {category && <><span className="mx-1">/</span><span className="capitalize text-charcoal">{category.replace(/-/g,' ')}</span></>}
          </nav>
          <h1 className="section-heading">{search?`Results for "${search}"`:category?category.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()):'All Products'}</h1>
          <p className="text-sm text-gray-400 mt-1">{loading?'...': `${total} products found`}</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl p-6 overflow-y-auto transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:bg-transparent lg:shadow-none lg:p-0 lg:translate-x-0 lg:overflow-visible ${sidebarOpen?'translate-x-0':'-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="font-semibold text-charcoal">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="w-full mb-4 text-xs font-semibold text-red-500 hover:text-red-600 text-left flex items-center gap-1">✕ Clear all filters ({activeFilterCount})</button>
            )}
            <FilterGroup title="Category">
              <button onClick={() => updateFilter('category','')} className={`filter-option ${!category?'active':''}`}>All Categories</button>
              {categories.map(c => (
                <button key={c._id} onClick={() => updateFilter('category',c.slug)} className={`filter-option ${category===c.slug?'active':''}`}>{c.name}</button>
              ))}
              {categories.length === 0 && ['Face Serum','Face Wash','Moisturiser','Sunscreen'].map(c => (
                <button key={c} onClick={() => updateFilter('category',c.toLowerCase().replace(' ','-'))} className={`filter-option ${category===c.toLowerCase().replace(' ','-')?'active':''}`}>{c}</button>
              ))}
            </FilterGroup>
            <FilterGroup title="Skin Type">
              {SKIN_TYPES.map(s => (
                <button key={s.value} onClick={() => updateFilter('skinType',s.value==='all'?'':s.value)} className={`filter-option ${(s.value==='all'?!skinType:skinType===s.value)?'active':''}`}>{s.label}</button>
              ))}
            </FilterGroup>
            <FilterGroup title="Price Range">
              {[{label:'Under ₹299',min:'',max:'299'},{label:'₹299 – ₹499',min:'299',max:'499'},{label:'₹499 – ₹699',min:'499',max:'699'},{label:'Above ₹699',min:'699',max:''}].map(r => (
                <button key={r.label} onClick={() => { updateFilter('minPrice',r.min); updateFilter('maxPrice',r.max) }} className={`filter-option ${minPrice===r.min&&maxPrice===r.max?'active':''}`}>{r.label}</button>
              ))}
            </FilterGroup>
          </aside>

          {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>}

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-2 btn-secondary btn-sm text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <select value={sort} onChange={e => updateFilter('sort',e.target.value)} className="input-field py-2 text-xs w-auto">
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="bestselling">Best Selling</option>
                  <option value="top-rated">Top Rated</option>
                </select>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view==='grid'?'bg-green-500 text-white':'text-gray-400 hover:bg-gray-50'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  </button>
                  <button onClick={() => setView('list')} className={`p-2 transition-colors ${view==='list'?'bg-green-500 text-white':'text-gray-400 hover:bg-gray-50'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {category && <FilterChip label={`Category: ${category}`} onRemove={() => updateFilter('category','')}/>}
                {skinType  && <FilterChip label={`Skin: ${skinType}`}    onRemove={() => updateFilter('skinType','')}/>}
                {(minPrice||maxPrice) && <FilterChip label={`Price: ${minPrice?'₹'+minPrice:''}${minPrice&&maxPrice?'–':''}${maxPrice?'₹'+maxPrice:'+'}`} onRemove={() => { updateFilter('minPrice',''); updateFilter('maxPrice','') }}/>}
              </div>
            )}

            {loading ? (
              <div className={view==='grid'?'grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6':'space-y-4'}>
                {Array.from({length:6}).map((_,i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <div className="skeleton aspect-square"/>
                    <div className="p-4 space-y-2"><div className="skeleton h-3 w-2/3 rounded"/><div className="skeleton h-4 w-full rounded"/><div className="skeleton h-8 w-full rounded-lg"/></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">🔍</span>
                <h3 className="text-lg font-semibold text-charcoal mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary btn-sm">Clear Filters</button>
              </div>
            ) : (
              <div className={view==='grid'?'grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6':'space-y-4'}>
                {products.map(p => <ProductCard key={p._id} product={p} view={view}/>)}
              </div>
            )}

            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-secondary btn-sm text-xs disabled:opacity-40">← Prev</button>
                {Array.from({length:pages},(_,i)=>i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p===page?'btn-primary':'hover:bg-gray-100 text-gray-600'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="btn-secondary btn-sm text-xs disabled:opacity-40">Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`.filter-option{display:block;width:100%;text-align:left;padding:6px 10px;border-radius:6px;font-size:13px;color:#444;transition:all 0.15s}.filter-option:hover{background:#f0f7ef;color:#2D5A27}.filter-option.active{background:#2D5A27;color:white;font-weight:600}`}</style>
    </>
  )
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="mb-6">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-semibold text-charcoal mb-3 hover:text-green-500 transition-colors">
        {title}<span className={`transition-transform ${open?'rotate-180':''}`}>▾</span>
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  )
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
      {label}<button onClick={onRemove} className="hover:text-red-500 transition-colors ml-0.5">✕</button>
    </span>
  )
}
