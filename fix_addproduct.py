with open('src/pages/admin/AddProduct.jsx', 'r') as f:
    content = f.read()

# Add useLocation import
content = content.replace(
    "import { useNavigate, useParams } from 'react-router-dom'",
    "import { useNavigate, useParams, useLocation } from 'react-router-dom'"
)

# Use location state instead of API call
old = """  const { id }   = useParams()
  const [loading,    setLoading]    = useState(editMode)
  const [saving,     setSaving]     = useState(false)
  const [categories, setCategories] = useState([])
  const [uploading,  setUploading]  = useState(false)"""

new = """  const { id }      = useParams()
  const { state }   = useLocation()
  const [loading,    setLoading]    = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [categories, setCategories] = useState([])
  const [uploading,  setUploading]  = useState(false)"""

content = content.replace(old, new)

# Replace the fetch logic with state-based logic
old = """    if (!editMode || !id) return
    productAPI.adminGetAll().then(r => {
      const products = r.data?.products||r.data||[]
      const p = products.find(x => x._id === id)
      if (!p) { toast.error('Product not found'); navigate('/admin/products'); return }
      setForm({
        name:p.name||'', slug:p.slug||'', shortDescription:p.shortDescription||'', description:p.description||'',
        ingredients:(p.ingredients||[]).join(', '), howToUse:p.howToUse||'',
        category:p.category?._id||p.category||'', price:p.price||'', comparePrice:p.comparePrice||'',
        sku:p.sku||'', stock:p.stock||'', skinTypes:p.skinTypes||[], tags:(p.tags||[]).join(', '),
        featured:p.featured||false, bestSeller:p.bestSeller||false, status:p.status||'published',
        images:p.images||[], seoTitle:p.seoTitle||'', seoDescription:p.seoDescription||'', seoKeywords:p.seoKeywords||'',
      })
      setLoading(false)
    }).catch(() => setLoading(false))"""

new = """    if (!editMode || !id) return
    const p = state?.product
    if (!p) { toast.error('Product not found'); navigate('/admin/products'); return }
    const ingredientsVal = Array.isArray(p.ingredients) ? p.ingredients.join(', ') : p.ingredients||''
    const tagsVal = Array.isArray(p.tags) ? p.tags.join(', ') : p.tags||''
    setForm({
      name:p.name||'', slug:p.slug||'', shortDescription:p.shortDescription||'', description:p.description||'',
      ingredients:ingredientsVal, howToUse:p.howToUse||'',
      category:p.category?._id||p.category||'', price:p.price||'', comparePrice:p.comparePrice||'',
      sku:p.sku||'', stock:p.stock||'', skinTypes:p.skinTypes||[], tags:tagsVal,
      featured:p.featured||false, bestSeller:p.bestSeller||false, status:p.status||'published',
      images:p.images||[], seoTitle:p.seoTitle||'', seoDescription:p.seoDescription||'', seoKeywords:p.seoKeywords||'',
    })"""

content = content.replace(old, new)

with open('src/pages/admin/AddProduct.jsx', 'w') as f:
    f.write(content)
print("AddProduct.jsx fixed!")
