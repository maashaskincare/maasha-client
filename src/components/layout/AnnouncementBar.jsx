import { useState } from 'react'

const messages = [
  '🌿 Free shipping on orders above ₹499 across India',
  '✨ New Arrivals: Hydra Glow Serum now available!',
  '🔬 Dermatologist tested • No harmful chemicals • Made in India',
  '📦 Ships pan-India from Bhopal, MP — 3–7 working days',
]

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="announcement-bar relative">
      <div className="container-site flex items-center justify-between">
        <div className="flex-1 text-center text-xs sm:text-sm tracking-wide font-medium py-0.5">
          {messages[current]}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="hidden sm:flex gap-1">
            {messages.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
          <button onClick={() => setVisible(false)} className="text-white/70 hover:text-white ml-2 text-lg leading-none">×</button>
        </div>
      </div>
    </div>
  )
}
