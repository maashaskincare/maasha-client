import { Link } from 'react-router-dom'
import { BRAND, NAV_LINKS } from '../../constants'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-charcoal text-white">
      <div className="border-b border-white/10">
        <div className="container-site py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="mb-4">
                <p className="text-2xl font-bold tracking-wide" style={{fontFamily:'var(--font-heading)',color:'var(--color-gold)'}}>MAASHA</p>
                <p className="text-[9px] tracking-[0.3em] font-medium text-white/50 -mt-0.5">SKIN CARE</p>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-5 max-w-xs">
                Science-backed, affordable skincare with natural active ingredients. Crafted for Indian skin, shipped pan-India from Bhopal.
              </p>
              <div className="flex flex-wrap gap-2">
                {['🌿 Natural','🔬 Dermatologist Tested','🇮🇳 Made in India'].map(b => (
                  <span key={b} className="text-xs px-2.5 py-1 rounded-full border border-white/20 text-white/60">{b}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors block">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Information</h3>
              <ul className="space-y-2.5">
                {[
                  {label:'About Us',href:'/about'},
                  {label:'Contact Us',href:'/contact'},
                  {label:'Privacy Policy',href:'/privacy-policy'},
                  {label:'Terms of Service',href:'/terms'},
                  {label:'Shipping Policy',href:'/terms#shipping'},
                  {label:'Return & Refund',href:'/terms#returns'},
                ].map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors block">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h3>
              <address className="not-italic space-y-3">
                <p className="text-sm text-white/60 leading-relaxed">30, Patarkaar Colony,<br />Link Road No. 3,<br />Bhopal, MP – 462003</p>
                <div className="space-y-0.5">
                  {BRAND.phone.map(p => (
                    <a key={p} href={`tel:${p.replace(/\s/g,'')}`} className="block text-sm text-white/60 hover:text-white transition-colors">{p}</a>
                  ))}
                </div>
                <a href={`mailto:${BRAND.email}`} className="text-sm text-white/60 hover:text-white transition-colors block">{BRAND.email}</a>
                <a href={`https://wa.me/${BRAND.phone[0].replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{background:'#25D366'}}>
                  💬 Chat on WhatsApp
                </a>
              </address>
            </div>
          </div>
        </div>
      </div>
      <div className="container-site py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center sm:text-left">© {year} Maasha Skin Care (Beauty Secret). All rights reserved. ® Registered Trademark</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 mr-1">Secure payments:</span>
            {['UPI','Visa','MC','RuPay','NetB'].map(p => (
              <span key={p} className="px-2 py-1 bg-white/10 rounded text-[10px] font-semibold text-white/50">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
