export default function StarRating({ value = 0, max = 5, size = 'sm', onChange }) {
  const sizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  const sz = sizes[size] || sizes.sm
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value)
        return (
          <button key={i} type="button"
            onClick={onChange ? () => onChange(i + 1) : undefined}
            className={onChange ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}>
            <svg className={sz} viewBox="0 0 24 24" fill="none">
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={filled ? '#F59E0B' : '#D1D5DB'}
                stroke={filled ? '#F59E0B' : '#D1D5DB'}
                strokeWidth="1"
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
