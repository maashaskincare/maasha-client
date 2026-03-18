import SEO from '../components/common/SEO'

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Policy — Maasha Skin Care" description="Privacy policy for Maasha Skin Care. Learn how we collect, use, and protect your personal data." canonical="/privacy-policy" />
      <div className="container-site py-12 max-w-3xl mx-auto">
        <h1 className="section-heading mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mb-8">Last updated: March 2026</p>
        <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
          {[
            {title:'1. Information We Collect',body:'We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, delivery address, and payment information processed securely by Razorpay.'},
            {title:'2. How We Use Your Information',body:'We use the information we collect to process and fulfil your orders, send order confirmations and shipping updates, respond to your comments and questions, and improve our products and services. We do not sell your personal information to third parties.'},
            {title:'3. Data Security',body:'We implement industry-standard security measures to protect your personal information. All payment transactions are processed through Razorpay\'s secure PCI-compliant platform. Our website uses SSL encryption to protect data in transit.'},
            {title:'4. Cookies',body:'We use cookies and similar tracking technologies to improve your browsing experience, remember your preferences, and analyse site traffic. You can control cookies through your browser settings.'},
            {title:'5. Your Rights',body:'You have the right to access, correct, or delete your personal information. You can update your profile in your account settings, or contact us at maashaskincare@gmail.com to request data deletion.'},
            {title:'6. Contact',body:'For privacy-related queries, contact us at maashaskincare@gmail.com or write to: Beauty Secret, 30 Patarkaar Colony, Link Road No. 3, Bhopal, MP – 462003.'},
          ].map(s => (
            <div key={s.title}>
              <h2 className="text-base font-bold text-charcoal mb-2" style={{fontFamily:'var(--font-heading)'}}>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
