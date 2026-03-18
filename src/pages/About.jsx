import { Link } from 'react-router-dom'
import SEO, { organizationSchema, breadcrumbSchema } from '../components/common/SEO'
import { BRAND } from '../constants'

export default function About() {
  return (
    <>
      <SEO
        title="About Maasha Skin Care — Our Story & Mission"
        description="Maasha Skin Care is a science-backed, affordable skincare brand from Bhopal, MP. We create natural skincare products for Indian skin types. Learn our story."
        keywords="about maasha skin care, beauty secret bhopal, skincare brand india, natural skincare bhopal"
        canonical="/about"
        schema={[organizationSchema(), breadcrumbSchema([{name:'Home',url:'/'},{name:'About Us'}])]}
      />
      <div className="container-site py-12 md:py-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{color:'var(--color-gold)'}}>Our Story</p>
          <h1 className="section-heading mb-4">About Maasha Skin Care</h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">Science-backed, affordable skincare with natural active ingredients. Crafted for Indian skin, in India.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-4" style={{fontFamily:'var(--font-heading)'}}>Rooted in Bhopal, Made for India</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Maasha Skin Care was born from a simple belief: every Indian deserves effective, safe, and affordable skincare. We are a registered brand operating as Beauty Secret, based in Bhopal, Madhya Pradesh.</p>
            <p className="text-gray-600 leading-relaxed mb-4">Our formulations are built on science — combining proven active ingredients like Vitamin C, Hyaluronic Acid, Salicylic Acid, and Niacinamide with natural extracts trusted for generations in Indian beauty traditions.</p>
            <p className="text-gray-600 leading-relaxed">Every product is dermatologist-tested, free from harmful chemicals, and designed specifically for the unique needs of Indian skin — from humid summers to dry winters, from oily T-zones to hyperpigmentation concerns common in South Asian skin tones.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {icon:'🌿',title:'100% Natural',    desc:'Active ingredients from nature'},
              {icon:'🔬',title:'Science-Backed',  desc:'Clinically proven formulas'},
              {icon:'🇮🇳',title:'Made in India',  desc:'For Indian skin types'},
              {icon:'💚',title:'No Harmful Chemicals',desc:'Clean, safe beauty'},
            ].map(v => (
              <div key={v.title} className="card p-5 text-center">
                <span className="text-3xl block mb-2">{v.icon}</span>
                <p className="font-semibold text-sm text-charcoal">{v.title}</p>
                <p className="text-xs text-gray-400 mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8 text-center" style={{background:'linear-gradient(135deg, #f0f7ef, #e8f5e9)'}}>
          <h2 className="text-xl font-bold text-charcoal mb-6" style={{fontFamily:'var(--font-heading)'}}>Business Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div><p className="text-gray-400 text-xs uppercase font-semibold mb-1">Brand Name</p><p className="font-semibold text-charcoal">Maasha Skin Care ®</p></div>
            <div><p className="text-gray-400 text-xs uppercase font-semibold mb-1">Business</p><p className="font-semibold text-charcoal">Beauty Secret</p></div>
            <div><p className="text-gray-400 text-xs uppercase font-semibold mb-1">Location</p><p className="font-semibold text-charcoal">Bhopal, MP</p></div>
          </div>
          <div className="mt-6"><Link to="/contact" className="btn-primary btn-sm">Get in Touch</Link></div>
        </div>
      </div>
    </>
  )
}
