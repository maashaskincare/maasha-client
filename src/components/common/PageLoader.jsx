export default function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-green-500 animate-spin"></div>
      </div>
      <p className="text-sm text-gray-400 font-medium" style={{fontFamily:'var(--font-heading)'}}>Loading…</p>
    </div>
  )
}
