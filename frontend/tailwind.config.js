/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFD400',
          ink: '#111111',
          muted: '#666666',
          secondary: '#555555',
          cream: '#FFF9DB',
          footer: '#F6F4EC',
          border: '#E7E5E0',
          sale: '#C2410C',
        },
        pastel: {
          yellow: '#FFF3B0',
          grey: '#E8E8E8',
          blue: '#DDEBFF',
          peach: '#FFE0D6',
          green: '#E3F2E1',
          purple: '#EADFFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'hero': '16px',
        'btn': '8px',
      },
      letterSpacing: {
        'wide-logo': '0.18em',
      },
      padding: {
        'desktop': '15%',
        'tablet': '6%',
        'mobile': '16px',
      }
    },
  },
  plugins: [],
}

