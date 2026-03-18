import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { BRAND } from '../../constants'
import toast from 'react-hot-toast'

export default function Settings() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    storeName:'Maasha Skin Care', storeTagline:'Reveal Your Natural Radiance',
    storeEmail:BRAND.email, storePhone:BRAND.phone[0], storeAddress:BRAND.address,
    seoTitle:'Maasha Skin Care — Reveal Your Natural Radiance | Bhopal',
    seoDescription:'Science-backed skincare with natural active ingredients for Indian skin. Shop serums, face wash, sunscreen & more. Ships pan-India from Bhopal, MP.',
    seoKeywords:'maasha skin care, skincare bhopal, face serum india',
    whatsapp:BRAND.phone[0], instagram:'', facebook:'',
    freeShippingAbove:499, shippingCharge:60, codAvailable:true,
    announcementText:'Free shipping on orders above ₹499 across India', announcementActive:true,
  })

  useEffect(() => {
    api.get('/api/admin/settings').then(r => { if (r.data?.settings) setSettings(s => ({...s,...r.data.settings})) }).catch(() => {})
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await api.put('/api/admin/settings', settings); toast.success('Settings saved!') }
    catch (err) { toast.error(err.response?.data?.message||'Failed to save settings') }
    finally { setSaving(false) }
  }

  const f = (key) => ({ value:settings[key]??'', onChange:e => setSettings(s=>({...s,[key]:e.target.value})) })

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-charcoal mb-6" style={{fontFamily:'var(--font-heading)'}}>Store Settings</h1>
      <form onSubmit={handleSave} className="space-y-6">

        <Section title="🏪 Store Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store Name"><input type="text" {...f('storeName')} className="input-field"/></Field>
            <Field label="Tagline"><input type="text" {...f('storeTagline')} className="input-field"/></Field>
            <Field label="Email"><input type="email" {...f('storeEmail')} className="input-field"/></Field>
            <Field label="Phone"><input type="text" {...f('storePhone')} className="input-field"/></Field>
          </div>
          <Field label="Address"><textarea {...f('storeAddress')} rows={2} className="input-field resize-none"/></Field>
        </Section>

        <Section title="🔍 SEO Settings (Site-Wide Defaults)">
          <p className="text-xs text-gray-400 mb-3">These are the fallback SEO values when a page doesn't have its own meta fields set.</p>
          <Field label={<>Default SEO Title <span className="text-gray-300 font-normal">({settings.seoTitle?.length}/60)</span></>}>
            <input type="text" {...f('seoTitle')} className="input-field" maxLength={70}/>
            <p className="text-[10px] text-gray-400 mt-1">Shown in browser tab and Google results for pages without custom SEO title.</p>
          </Field>
          <Field label={<>Default Meta Description <span className="text-gray-300 font-normal">({settings.seoDescription?.length}/160)</span></>}>
            <textarea {...f('seoDescription')} rows={3} className="input-field resize-none" maxLength={170}/>
          </Field>
          <Field label="Default Keywords"><input type="text" {...f('seoKeywords')} className="input-field" placeholder="comma separated keywords"/></Field>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Google Preview (Homepage)</p>
            <p className="text-sm font-medium text-blue-700 truncate">{settings.seoTitle}</p>
            <p className="text-[10px] text-green-700 font-mono">maasha-client.onrender.com</p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{settings.seoDescription}</p>
          </div>
        </Section>

        <Section title="📢 Announcement Bar">
          <Field label="Announcement Text"><input type="text" {...f('announcementText')} className="input-field" placeholder="Free shipping on orders above ₹499 across India"/></Field>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" checked={settings.announcementActive} onChange={e=>setSettings(s=>({...s,announcementActive:e.target.checked}))} className="w-4 h-4 accent-green-500"/>
            <span className="text-sm text-gray-600">Show announcement bar</span>
          </label>
        </Section>

        <Section title="🚚 Shipping & Payments">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Free Shipping Above (₹)"><input type="number" value={settings.freeShippingAbove} onChange={e=>setSettings(s=>({...s,freeShippingAbove:Number(e.target.value)}))} className="input-field" min="0"/></Field>
            <Field label="Shipping Charge (₹)"><input type="number" value={settings.shippingCharge} onChange={e=>setSettings(s=>({...s,shippingCharge:Number(e.target.value)}))} className="input-field" min="0"/></Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" checked={settings.codAvailable} onChange={e=>setSettings(s=>({...s,codAvailable:e.target.checked}))} className="w-4 h-4 accent-green-500"/>
            <span className="text-sm text-gray-600">Cash on Delivery (COD) available</span>
          </label>
        </Section>

        <Section title="📱 Social & Contact Links">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="WhatsApp Number"><input type="text" {...f('whatsapp')} placeholder="+91 XXXXX XXXXX" className="input-field"/></Field>
            <Field label="Instagram URL"><input type="url" {...f('instagram')} placeholder="https://instagram.com/maashaskincare" className="input-field"/></Field>
            <Field label="Facebook URL"><input type="url" {...f('facebook')} placeholder="https://facebook.com/maashaskincare" className="input-field"/></Field>
          </div>
        </Section>

        <div className="pt-2">
          <button type="submit" disabled={saving} className="btn-primary px-8 py-3">{saving?'Saving…':'Save All Settings'}</button>
        </div>
      </form>
    </div>
  )
}

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
