/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#FFFFFF',
          gray: '#E5E5E5',
          gold: '#FCA311',
          amber: '#FCA311',
          navy: '#14213D',
          oxford: '#14213D',
          black: '#000000',
          50: '#FFFDF2',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FCA311', // Exact user swatch #FCA311 (Hero Accent)
          600: '#D97706',
          700: '#B45309',
          800: '#1D2E54',
          900: '#14213D', // Exact user swatch #14213D (Oxford Navy)
          950: '#000000', // Exact user swatch #000000 (Black)
          DEFAULT: '#FCA311',
        },
        indigo: {
          50: '#FFFDF2',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FCA311', // Exact user swatch #FCA311
          600: '#D97706',
          700: '#B45309',
          800: '#1D2E54',
          900: '#14213D', // Exact user swatch #14213D
          950: '#000000', // Exact user swatch #000000
        },
        oxford: {
          50: '#F4F6FB',
          100: '#E8ECF6',
          200: '#C7D2EB',
          300: '#9FB3DC',
          400: '#6886C4',
          500: '#3D5FA7',
          600: '#2A4480',
          700: '#1F325E',
          800: '#1A294A',
          900: '#14213D', // Exact user swatch #14213D
          950: '#000000', // Exact user swatch #000000
          DEFAULT: '#14213D',
        },
        halfwhite: {
          DEFAULT: '#F5F6F8',
          cream: '#FAF9F6',
          ivory: '#FDFBF7',
          soft: '#F8F9FA',
          muted: '#EBECEF',
        },
        slate: {
          50: '#F5F6F8', // Half-white / off-white background
          100: '#EBECEF',
          200: '#E5E5E5',
          800: '#1A284A',
          900: '#14213D', // Oxford Navy card background
          950: '#000000', // Black background
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
