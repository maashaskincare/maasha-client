import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO, { faqSchema } from '../components/common/SEO'

const QUESTIONS = [
  { id:'skinType', question:'How does your skin feel by midday without any products?',
    options:[{value:'oily',label:'Shiny all over',emoji:'✨'},{value:'dry',label:'Tight or flaky',emoji:'🏜️'},{value:'combination',label:'Oily T-zone, dry cheeks',emoji:'☯️'},{value:'normal',label:'Balanced and comfortable',emoji:'😊'}]},
  { id:'concern', question:'What is your primary skin concern?',
    options:[{value:'acne',label:'Acne & Breakouts',emoji:'🔴'},{value:'pigmentation',label:'Dark Spots & Pigmentation',emoji:'🌑'},{value:'dullness',label:'Dullness & Uneven Tone',emoji:'💛'},{value:'ageing',label:'Fine Lines & Ageing',emoji:'⏰'},{value:'dryness',label:'Dryness & Dehydration',emoji:'💧'}]},
  { id:'age', question:'What is your age group?',
    options:[{value:'teen',label:'Under 20',emoji:'🌱'},{value:'young',label:'20 – 30',emoji:'🌿'},{value:'adult',label:'30 – 45',emoji:'🍃'},{value:'mature',label:'45+',emoji:'🌲'}]},
  { id:'routine', question:'How would you describe your current skincare routine?',
    options:[{value:'none',label:"I don't have one",emoji:'🆕'},{value:'basic',label:'Just wash & moisturise',emoji:'🧼'},{value:'moderate',label:'Cleanser, toner & serum',emoji:'💆'},{value:'advanced',label:'Full multi-step routine',emoji:'🧬'}]},
  { id:'sensitivity', question:'How sensitive is your skin to new products?',
    options:[{value:'not',label:'Not sensitive at all',emoji:'💪'},{value:'little',label:'Occasionally reacts',emoji:'⚠️'},{value:'sensitive',label:'Often gets irritated',emoji:'🚨'}]},
]

const RECOMMENDATIONS = {
  acne:         { products:['Acne Control Serum','Foaming Face Wash'],     slugs:['acne-control-serum','foaming-face-wash'],    tip:'Salicylic Acid and Tea Tree Oil are your best friends for acne-prone skin.' },
  pigmentation: { products:['No Scars Serum','De Pigmentation Serum'],      slugs:['no-scars-serum','de-pigmentation-serum'],    tip:'Vitamin C and Alpha Arbutin work together to visibly fade dark spots in 4–6 weeks.' },
  dullness:     { products:['Hydra Glow Serum','No Scars Serum'],           slugs:['hydra-glow-serum','no-scars-serum'],          tip:'Hyaluronic Acid + Vitamin C is the ultimate glow combo for dull skin.' },
  ageing:       { products:['Hydra Glow Serum','Hydrating Lotion'],         slugs:['hydra-glow-serum','hydrating-lotion'],        tip:'Microcucan Algae and Ceramides help restore skin elasticity and reduce fine lines.' },
  dryness:      { products:['Hydrating Lotion','Hydra Glow Serum'],         slugs:['hydrating-lotion','hydra-glow-serum'],        tip:'Layer a hydrating serum under your moisturiser for maximum moisture retention.' },
}

const quizFaqs = [
  { question:'How accurate is the Maasha Skin Care Know Your Skin?', answer:'Our quiz is based on common skin type indicators and concerns. While it gives a great starting point, we recommend doing a patch test before trying any new product.' },
  { question:'Can I retake the Know Your Skin?', answer:'Yes! Your skin can change with seasons, diet, and age. We recommend taking the quiz every 3–6 months for updated recommendations.' },
  { question:'Are the recommended products suitable for sensitive skin?', answer:'All Maasha Skin Care products are dermatologist-tested. However, we recommend doing a patch test if you have highly sensitive skin.' },
]

export default function SkinQuiz() {
  const [step,      setStep]      = useState('start')
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [animating, setAnimating] = useState(false)

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    setAnimating(true)
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) { setCurrent(c => c + 1) }
      else { setStep('result') }
      setAnimating(false)
    }, 300)
  }

  const handleRestart = () => { setStep('start'); setCurrent(0); setAnswers({}) }
  const reco = RECOMMENDATIONS[answers.concern] || RECOMMENDATIONS.dullness

  return (
    <>
      <SEO
        title="Know Your Skin Free — Find Your Perfect Skincare Routine"
        description="Take our free 60-second Know Your Skin to discover your skin type and get personalised product recommendations from Maasha Skin Care."
        keywords="skin type quiz india, free skin quiz, what skin type am i, best skincare routine for my skin india"
        canonical="/skin-quiz"
        schema={faqSchema(quizFaqs)}
      />
      <div className="min-h-screen py-12" style={{background:'linear-gradient(135deg, #f0f7ef 0%, #f9f9f9 100%)'}}>
        <div className="container-site max-w-2xl mx-auto">

          {step === 'start' && (
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-6">🧬</div>
              <h1 className="section-heading mb-4">Know Your Skin Free</h1>
              <p className="text-gray-500 mb-3 text-base leading-relaxed">Answer 5 quick questions and get personalised product recommendations crafted specifically for your skin type, concerns, and goals.</p>
              <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-gray-400">
                <span>⏱️ 60 seconds</span><span>🆓 Free</span><span>📧 No sign-up needed</span>
              </div>
              <button onClick={() => setStep('quiz')} className="btn-primary px-12 py-4 text-base font-bold shadow-lg">Start My KYS →</button>
            </div>
          )}

          {step === 'quiz' && (
            <div className={`transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Question {current + 1} of {QUESTIONS.length}</span>
                  <span>{Math.round((current / QUESTIONS.length) * 100)}% complete</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{width:`${(current/QUESTIONS.length)*100}%`,background:'var(--color-primary)'}} />
                </div>
              </div>
              <div className="card p-8">
                <h2 className="text-xl font-bold text-charcoal mb-6 text-center" style={{fontFamily:'var(--font-heading)'}}>{QUESTIONS[current].question}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUESTIONS[current].options.map(opt => (
                    <button key={opt.value} onClick={() => handleAnswer(QUESTIONS[current].id, opt.value)}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 text-left hover:border-green-400 hover:bg-green-50 transition-all text-sm font-medium text-charcoal group">
                      <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                      <span className="group-hover:text-green-600 transition-colors">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {current > 0 && (
                <button onClick={() => { setCurrent(c => c-1); setAnswers(a => { const n={...a}; delete n[QUESTIONS[current].id]; return n }) }}
                  className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back</button>
              )}
            </div>
          )}

          {step === 'result' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="section-heading mb-2">Your Personalised Routine</h2>
                <p className="text-gray-500">Based on your answers, here are our expert recommendations</p>
              </div>
              <div className="card p-6 mb-6">
                <h3 className="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">Your Skin Profile</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(answers).map(([key, val]) => (
                    <div key={key} className="p-3 bg-green-50 rounded-xl text-center">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{key}</p>
                      <p className="text-sm font-bold text-charcoal capitalize mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 rounded-xl border-l-4 mb-6" style={{borderColor:'var(--color-gold)',background:'rgba(184,134,11,0.06)'}}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{color:'var(--color-gold)'}}>Expert Tip</p>
                <p className="text-sm text-gray-600">{reco.tip}</p>
              </div>
              <div className="card p-6 mb-6">
                <h3 className="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">Recommended For You</h3>
                <div className="space-y-3">
                  {reco.products.map((name, i) => (
                    <Link key={i} to={`/product/${reco.slugs[i]}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style={{background:'rgba(45,90,39,0.08)'}}>
                        {i === 0 ? '💧' : '✨'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-charcoal group-hover:text-green-600 transition-colors">{name}</p>
                        <p className="text-xs text-gray-400">Maasha Skin Care</p>
                      </div>
                      <span className="text-green-500 font-bold text-sm">→</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/shop" className="btn-primary flex-1 text-center py-3">Shop All Products</Link>
                <button onClick={handleRestart} className="btn-secondary flex-1 py-3">Retake Quiz</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <section className="section-py bg-white">
        <div className="container-site max-w-2xl mx-auto">
          <h2 className="section-heading mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {quizFaqs.map((faq, i) => <FAQItem key={i} question={faq.question} answer={faq.answer} />)}
          </div>
        </div>
      </section>
    </>
  )
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
        <span className="text-sm font-medium text-charcoal pr-4">{question}</span>
        <span className={`text-gray-400 flex-shrink-0 transition-transform ${open?'rotate-180':''}`}>▾</span>
      </button>
      {open && <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{answer}</div>}
    </div>
  )
}
