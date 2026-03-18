import SEO from '../components/common/SEO'

export default function Terms() {
  return (
    <>
      <SEO title="Terms of Service & Shipping Policy — Maasha Skin Care" description="Terms of service, shipping policy, and return policy for Maasha Skin Care." canonical="/terms" />
      <div className="container-site py-12 max-w-3xl mx-auto">
        <h1 className="section-heading mb-2">Terms of Service</h1>
        <p className="text-xs text-gray-400 mb-8">Last updated: March 2026</p>
        <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
          {[
            {id:'general',  title:'1. General Terms',     body:'By accessing or using the Maasha Skin Care website, you agree to be bound by these terms. Maasha Skin Care is operated by Beauty Secret, registered in Bhopal, Madhya Pradesh, India.'},
            {id:'products', title:'2. Products & Pricing', body:'All product descriptions and prices are accurate to the best of our knowledge. We reserve the right to change prices at any time. Product images are for illustration; actual packaging may vary slightly.'},
            {id:'shipping', title:'3. Shipping Policy',   body:'We ship pan-India from Bhopal, MP. Orders are processed within 1–2 business days. Standard delivery takes 3–7 working days. Free shipping on orders above ₹499. A shipping charge of ₹60 applies to orders below ₹499.'},
            {id:'returns',  title:'4. Returns & Refunds', body:'We accept returns within 7 days of delivery for damaged, defective, or incorrect products. Products must be unused and in original packaging. Email maashaskincare@gmail.com with your order number and photo evidence. Refunds are processed within 5–7 business days.'},
            {id:'payment',  title:'5. Payment',           body:'We accept UPI, credit/debit cards, net banking, wallets, and Cash on Delivery via Razorpay. All transactions are encrypted and PCI-DSS compliant. We do not store your payment details.'},
            {id:'contact',  title:'6. Contact',           body:'For any queries, contact us at maashaskincare@gmail.com or call +91 9646233903 (Mon–Sat, 10 AM–7 PM).'},
          ].map(s => (
            <div key={s.id} id={s.id}>
              <h2 className="text-base font-bold text-charcoal mb-2" style={{fontFamily:'var(--font-heading)'}}>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
