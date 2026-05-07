/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      boxShadow: {
        soft:    '0 1px 2px rgba(15,23,42,.04), 0 4px 16px -4px rgba(15,23,42,.06)',
        ring:    '0 0 0 4px rgba(16,185,129,.12)',
        glow:    '0 8px 24px -8px rgba(16,185,129,.45)',
        elevated:'0 8px 32px -12px rgba(15,23,42,.18)',
      },
      backgroundImage: {
        'brand-gradient':  'linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)',
        'mesh':            'radial-gradient(at 0% 0%, rgba(16,185,129,.18) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(20,184,166,.16) 0, transparent 45%), radial-gradient(at 100% 0%, rgba(5,150,105,.10) 0, transparent 40%)',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
