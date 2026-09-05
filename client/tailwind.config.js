/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        creme: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F4ECE1',
          300: '#EAE0D1',
          400: '#DFCDBB',
          500: '#CCAFA3',
        },
        sand: {
          50: '#FBF9F5',
          100: '#F5EFE6',
          200: '#EADBCA',
          300: '#DCBFA6',
          400: '#C9A384',
          500: '#B08866',
          600: '#946F4E',
          700: '#755439',
          800: '#5A3E28',
          900: '#412B1B',
        },
        dustypink: {
          50: '#FDF6F6',
          100: '#FAECEB',
          200: '#F3D9D7',
          300: '#E8BEBC',
          400: '#D99B9A',
          500: '#C27475',
          600: '#A75558',
          700: '#8A4043',
          800: '#703336',
          900: '#572528',
        },
        burgundy: {
          50: '#FBF2F4',
          100: '#F6DFE4',
          200: '#ECC0C9',
          300: '#DC96A5',
          400: '#C35D74',
          500: '#9E2C48',
          600: '#7B1832',
          700: '#5F0E23',
          800: '#480818',
          900: '#32040F',
          950: '#1F0208',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(95, 14, 35, 0.06), 0 2px 6px -1px rgba(95, 14, 35, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(95, 14, 35, 0.1), 0 4px 12px -2px rgba(95, 14, 35, 0.06)',
        'soft-xl': '0 20px 40px -8px rgba(95, 14, 35, 0.15)',
        'glow-burgundy': '0 0 25px rgba(123, 24, 50, 0.35)',
        'glow-pink': '0 0 20px rgba(217, 155, 154, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
