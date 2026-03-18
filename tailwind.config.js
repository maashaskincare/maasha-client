/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#f0f7ef',
          100: '#d8ebd6',
          200: '#b3d7ae',
          300: '#7dba77',
          400: '#4e9b47',
          500: '#2D5A27',
          600: '#245020',
          700: '#1c3f19',
          800: '#143014',
          900: '#0d200d',
        },
        gold: {
          50:  '#fdf8ed',
          100: '#f9eccc',
          200: '#f3d794',
          300: '#ecbe57',
          400: '#e4a42b',
          500: '#B8860B',
          600: '#9a6f08',
          700: '#7c5806',
          800: '#5e4204',
          900: '#3e2c02',
        },
        cream:    '#F9F9F9',
        charcoal: '#1A1A1A',
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-in-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'slide-down':'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity:'0' },                                    '100%': { opacity:'1' } },
        slideUp:   { '0%': { transform:'translateY(20px)', opacity:'0' },      '100%': { transform:'translateY(0)', opacity:'1' } },
        slideDown: { '0%': { transform:'translateY(-10px)', opacity:'0' },     '100%': { transform:'translateY(0)', opacity:'1' } },
      },
      boxShadow: {
        'card':       '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'nav':        '0 2px 16px rgba(0,0,0,0.1)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
