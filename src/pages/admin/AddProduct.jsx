import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { productAPI, categoryAPI, uploadAPI } from '../../api/services'
import { SKIN_TYPES } from '../../constants'
import toast from 'react-hot-toast'

export default function AddProduct({ editMode = false }) {
  const navigate = useNavigate()
  const { id }      = useParams()
  const { state }   = useLocation()
  const [loading,    setLoading]    = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [categories, setCategories] = useState([])
  const [uploading,  setUploading]  = useState(false)
  const [form, setForm] = useState({
    name:'', slug:'', shortDescription:'', description:'', ingredients:'', howToUse:'',
    category:'', price:'', comparePrice:'', sku:'', stock:'', skinTypes:[], tags:'',
    featured:false, bestSeller:false, status:'published', images:[],
    seoTitle:'', seoDescription:'', seoKeywords:'',
  })

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data?.categories||r.data||[]))
    if (!editMode || !id) return
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
    })
  }, [editMode, id])

  const handleNameChange = (val) => {
    setForm(f => ({
      ...f, name: val,
      slug: !editMode||!f.slug ? val.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,'-').trim() : f.slug,
      seoTitle: !f.seoTitle ? `${val} — Buy Online India` : f.seoTitle,
    }))
  }

  const toggleSkinType = (val) => {
    setForm(f => ({ ...f, skinTypes: f.skinTypes.includes(val) ? f.skinTypes.filter(s => s!==val) : [...f.skinTypes,val] }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    if (form.images.length + files.length > 5) { toast.error('Maximum 5 images allowed'); return }
    setUploading(true)
    try {
      const uploads = await Promise.all(files.map(file => {
        const fd = new FormData(); fd.append('image', file)
        return uploadAPI.uploadImage(fd).then(r => ({ url:r.data.url||r.data.secure_url, publicId:r.data.public_id||'' }))
      }))
      setForm(f => ({ ...f, images: [...f.images, ...uploads] }))
      toast.success(`${uploads.length} image(s) uploaded!`)
    } catch { toast.error('Image upload failed') }
    finally { setUploading(false) }
  }

  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_,idx) => idx!==i) }))

  const handleSave = async () => {
    if (!form.name||!form.price||!form.stock) { toast.error('Name, price and stock are required'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.split(',').map(s=>s.trim()).filter(Boolean),
        tags:        form.tags.split(',').map(s=>s.trim()).filter(Boolean),
        price:       Number(form.price),
        comparePrice:Number(form.comparePrice)||undefined,
        stock:       Number(form.stock),
      }
      if (editMode&&id) { await productAPI.update(id,payload); toast.success('Product updated!') }
      else              { await productAPI.create(payload);    toast.success('Product created!') }
      navigate('/admin/products')
    } catch (err) { toast.error(err.response?.data?.message||'Failed to save product') }
    finally { setSaving(false) }
  }

  const seoTitleLen = form.seoTitle.length
  const seoDescLen  = form.seoDescription.length

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-t-green-500 border-green-100 animate-spin"/></div>

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-charcoal" style={{fontFamily:'var(--font-heading)'}}>{editMode?'Edit Product':'Add New Product'}</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/products')} className="btn-secondary btn-sm text-xs">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">{saving?'Saving…':editMode?'Update Product':'Create Product'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <Section title="Basic Information">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Product Name *"><input type="text" value={form.name} onChange={e=>handleNameChange(e.target.value)} placeholder="e.g. Acne Control Serum" className="input-field" required/></Field>
              <Field label="SKU"><input type="text" value={form.sku} onChange={e=>setForm(f=>({...f,sku:e.target.value}))} placeholder="MSC-ACS-001" className="input-field"/></Field>
            </div>
            <Field label="Short Description"><textarea value={form.shortDescription} onChange={e=>setForm(f=>({...f,shortDescription:e.target.value}))} placeholder="One-line selling description" rows={2} className="input-field resize-none"/></Field>
            <Field label="Full Description"><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Full product description (HTML supported)" rows={5} className="input-field resize-none font-mono text-xs"/></Field>
          </Section>

          <Section title="Product Images (max 5)">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {form.images.map((img,i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
                  <img src={img.url} alt={`Product ${i+1}`} className="w-full h-full object-cover"/>
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                  {i===0 && <span className="absolute bottom-1 left-1 text-[9px] bg-green-500 text-white px-1 rounded">Main</span>}
                </div>
              ))}
              {form.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all">
                  {uploading ? <span className="text-xs text-green-500 animate-pulse">Uploading…</span> : <><span className="text-2xl text-gray-300">+</span><span className="text-[10px] text-gray-400 text-center mt-1">Add Image</span></>}
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden"/>
                </label>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">First image is the main image. JPG/PNG/WebP. Max 5MB each.</p>
          </Section>

          <Section title="Ingredients & How to Use">
            <Field label="Key Ingredients (comma separated)"><input type="text" value={form.ingredients} onChange={e=>setForm(f=>({...f,ingredients:e.target.value}))} placeholder="Vitamin C, Hyaluronic Acid, Niacinamide" className="input-field"/></Field>
            <Field label="How to Use"><textarea value={form.howToUse} onChange={e=>setForm(f=>({...f,howToUse:e.target.value}))} placeholder="Step-by-step usage instructions" rows={4} className="input-field resize-none"/></Field>
          </Section>

          <Section title="Skin Types">
            <div className="flex flex-wrap gap-2">
              {SKIN_TYPES.filter(s=>s.value!=='all').map(s => (
                <button key={s.value} type="button" onClick={() => toggleSkinType(s.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.skinTypes.includes(s.value)?'bg-green-500 text-white border-green-500':'border-gray-200 text-gray-500 hover:border-green-300'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Pricing & Inventory">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Selling Price (₹) *"><input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="499" className="input-field" min="0"/></Field>
              <Field label="MRP / Compare Price (₹)"><input type="number" value={form.comparePrice} onChange={e=>setForm(f=>({...f,comparePrice:e.target.value}))} placeholder="699" className="input-field" min="0"/></Field>
            </div>
            <Field label="Stock Quantity *"><input type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} placeholder="100" className="input-field" min="0"/></Field>
            {form.price&&form.comparePrice&&Number(form.comparePrice)>Number(form.price)&&(
              <p className="text-xs text-green-600 font-medium">✓ {Math.round(((form.comparePrice-form.price)/form.comparePrice)*100)}% discount badge will show</p>
            )}
          </Section>

          <Section title="Category & Tags">
            <Field label="Category *">
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="input-field text-sm py-2">
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Tags (comma separated)"><input type="text" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="serum, acne, oily skin" className="input-field"/></Field>
          </Section>

          <Section title="Visibility">
            <Field label="Status">
              <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="input-field text-sm py-2">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <div className="flex flex-col gap-2 mt-2">
              {[{key:'featured',label:'⭐ Featured (show on homepage)'},{key:'bestSeller',label:'🔥 Best Seller badge'}].map(opt => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[opt.key]} onChange={e=>setForm(f=>({...f,[opt.key]:e.target.checked}))} className="w-4 h-4 rounded accent-green-500"/>
                  <span className="text-sm text-gray-600">{opt.label}</span>
                </label>
              ))}
            </div>
          </Section>

          <div className="bg-white rounded-xl border-2 border-green-200 p-5">
            <div className="flex items-center gap-2 mb-4"><span>🔍</span><h3 className="text-sm font-bold text-charcoal">SEO Meta Fields</h3></div>
            <Field label={<>SEO Title <span className={`ml-1 font-semibold text-xs ${seoTitleLen>60?'text-red-500':seoTitleLen>50?'text-yellow-500':'text-green-500'}`}>{seoTitleLen}/60</span></>}>
              <input type="text" value={form.seoTitle} onChange={e=>setForm(f=>({...f,seoTitle:e.target.value}))} placeholder="Buy Acne Control Serum Online India" className="input-field text-sm py-2" maxLength={70}/>
              <p className="text-[10px] text-gray-400 mt-1">Ideal: 50–60 chars. Include main keyword.</p>
            </Field>
            <Field label={<>Meta Description <span className={`ml-1 font-semibold text-xs ${seoDescLen>160?'text-red-500':seoDescLen>140?'text-yellow-500':'text-green-500'}`}>{seoDescLen}/160</span></>}>
              <textarea value={form.seoDescription} onChange={e=>setForm(f=>({...f,seoDescription:e.target.value}))} placeholder="Compelling description for Google search results" rows={3} className="input-field text-sm resize-none" maxLength={170}/>
            </Field>
            <Field label="SEO Keywords">
              <input type="text" value={form.seoKeywords} onChange={e=>setForm(f=>({...f,seoKeywords:e.target.value}))} placeholder="buy acne serum india, best acne control serum" className="input-field text-sm py-2"/>
            </Field>
            <Field label="URL Slug">
              <input type="text" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-')}))} placeholder="acne-control-serum" className="input-field text-sm py-2 font-mono"/>
            </Field>
            {(form.seoTitle||form.name) && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Google Preview</p>
                <p className="text-sm font-medium text-blue-700 truncate">{form.seoTitle||form.name+' — Buy Online India'}</p>
                <p className="text-[10px] text-green-700 font-mono">maasha-client.onrender.com/product/{form.slug}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.seoDescription||form.shortDescription||'No description set'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EditProduct() { return <AddProduct editMode={true}/> }

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-charcoal mb-4 pb-2 border-b border-gray-100">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
function Field({ label, children }) {
  return <div><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>{children}</div>
}
