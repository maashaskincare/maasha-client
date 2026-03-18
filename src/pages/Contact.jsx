import { useState } from 'react'
import SEO, { organizationSchema } from '../components/common/SEO'
import { BRAND } from '../constants'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      toast.success("Message sent! We'll reply within 24 hours.")
      setForm({ name:'', email:'', phone:'', subject:'', message:'' })
      setSending(false)
    }, 1200)
  }

  const f = (key) => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) })

  return (
    <>
      <SEO
        title="Contact Us — Maasha Skin Care"
        description="Contact Maasha Skin Care (Beauty Secret, Bhopal). Reach us by phone, email, or WhatsApp for product queries, orders, and support."
        keywords="contact maasha skin care, beauty secret bhopal contact, skincare support india"
        canonical="/contact"
        schema={organizationSchema()}
      />
      <div className="container-site py-12 md:py-16 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="section-heading mb-3">Get in Touch</h1>
          <p className="text-gray-500">We're here to help with your skincare journey.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="card p-8">
            <h2 className="text-lg font-bold text-charcoal mb-5" style={{fontFamily:'var(--font-heading)'}}>Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
                  <input type="text" {...f('name')} placeholder="Your name" className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <input type="tel" {...f('phone')} placeholder="+91 XXXXX" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
                <input type="email" {...f('email')} placeholder="you@example.com" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                <select {...f('subject')} className="input-field text-sm py-2.5">
                  <option value="">Select subject</option>
                  {['Product Query','Order Support','Wholesale Enquiry','Feedback','Other'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Message *</label>
                <textarea {...f('message')} rows={5} placeholder="Tell us how we can help..." className="input-field resize-none" required />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full py-3">
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="font-bold text-charcoal mb-4" style={{fontFamily:'var(--font-heading)'}}>Our Office</h3>
              <address className="not-italic space-y-3 text-sm text-gray-600">
                <p className="font-semibold text-charcoal">Beauty Secret</p>
                <p>30, Patarkaar Colony,<br />Link Road No. 3,<br />Bhopal, MP – 462003, India</p>
                <div className="pt-2 space-y-2">
                  {BRAND.phone.map(p => (
                    <a key={p} href={`tel:${p.replace(/\s/g,'')}`} className="flex items-center gap-2 hover:text-green-600 transition-colors">📞 <span>{p}</span></a>
                  ))}
                  <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 hover:text-green-600 transition-colors">✉️ <span>{BRAND.email}</span></a>
                </div>
              </address>
            </div>
            <a href={`https://wa.me/${BRAND.phone[0].replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
              className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:'rgba(37,211,102,0.1)'}}>💬</div>
              <div>
                <p className="font-semibold text-charcoal text-sm group-hover:text-green-600 transition-colors">Chat on WhatsApp</p>
                <p className="text-xs text-gray-400">Usually replies within 1 hour</p>
              </div>
              <span className="ml-auto text-gray-300 group-hover:text-green-500 transition-colors">→</span>
            </a>
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal mb-3 text-sm">Support Hours</h3>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between"><span>Monday – Saturday</span><span className="font-medium text-charcoal">10 AM – 7 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="font-medium text-charcoal">Closed</span></div>
                <div className="flex justify-between"><span>Public Holidays</span><span className="font-medium text-charcoal">WhatsApp only</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
