/** @type {import('tailwindcss').Config} */
// Design system: "Property Management" palette
// Base blacks/greys, Army + Dark/Soft Greens, Purple, Beige, Tosca, Red.
// The default Tailwind families used across the app (slate, emerald, blue,
// purple, amber, red, ...) are remapped onto this palette so the entire UI
// stays on-system.
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"General Sans"', 'Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"General Sans"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', '"General Sans"', 'system-ui', 'sans-serif']
      },
      colors: {
        // Base neutrals — warm grey-greens from the design system
        slate: {
          50: '#F5F7F4',
          100: '#EBEFEA',
          200: '#DCE3DC',
          300: '#BCC6BE',
          400: '#8D9891',
          500: '#596269', // Grey 200
          600: '#43515C', // Grey 300
          700: '#333F48',
          800: '#201F23', // Black 200
          900: '#121212'  // Black 300
        },
        // Primary greens — Army + Dark Green + Soft Green
        emerald: {
          50: '#E6EFEA',  // Soft Green 00
          100: '#D8E6DD',
          200: '#A4C8AE', // Soft Green 200
          300: '#8AB697',
          400: '#617C6C', // Dark Green 200
          500: '#4C6C5A', // Dark Green 300
          600: '#47663B',
          700: '#395917', // Army
          800: '#2C450F',
          900: '#20330B'
        },
        green: {
          50: '#E6EFEA',
          100: '#D8E6DD',
          200: '#A4C8AE',
          300: '#8AB697',
          400: '#617C6C',
          500: '#4C6C5A',
          600: '#47663B',
          700: '#395917',
          800: '#2C450F',
          900: '#20330B'
        },
        // Tosca
        teal: {
          50: '#EDF4F5',
          100: '#DCEAEB',
          200: '#C1D8DA', // Tosca
          300: '#A3C4C7',
          400: '#7FA6AA',
          500: '#5F878B',
          600: '#4A6C70',
          700: '#3B565A',
          800: '#2C4143',
          900: '#1E2C2E'
        },
        // Info tones fold into the grey-blue base
        blue: {
          50: '#EEF1F5',
          100: '#DEE4EC',
          200: '#C2CCD9',
          300: '#9DACBF',
          400: '#6E8299',
          500: '#536779',
          600: '#43515C',
          700: '#364351',
          800: '#2A343F',
          900: '#121212'
        },
        sky: {
          50: '#EDF4F5',
          100: '#DCEAEB',
          200: '#C1D8DA',
          300: '#A3C4C7',
          400: '#7FA6AA',
          500: '#5F878B',
          600: '#4A6C70',
          700: '#3B565A',
          800: '#2C4143',
          900: '#1E2C2E'
        },
        // Purple family
        purple: {
          50: '#EFF0F5',
          100: '#E3E4EA', // Purple 100
          200: '#B8BED5', // Purple 200
          300: '#9BA2C0',
          400: '#7A80A0',
          500: '#676C8A',
          600: '#595D75', // Purple 300
          700: '#484C60',
          800: '#383B4B',
          900: '#262833'
        },
        violet: {
          50: '#EFF0F5',
          100: '#E3E4EA',
          200: '#B8BED5',
          300: '#9BA2C0',
          400: '#7A80A0',
          500: '#676C8A',
          600: '#595D75',
          700: '#484C60',
          800: '#383B4B',
          900: '#262833'
        },
        indigo: {
          50: '#EFF0F5',
          100: '#E3E4EA',
          200: '#B8BED5',
          300: '#9BA2C0',
          400: '#7A80A0',
          500: '#676C8A',
          600: '#595D75',
          700: '#484C60',
          800: '#383B4B',
          900: '#262833'
        },
        // Beige family
        amber: {
          50: '#F7F2E7',
          100: '#F0E7D2',
          200: '#E5D6B8', // Beige 200
          300: '#D4BF97',
          400: '#BFA87F',
          500: '#A39170', // Beige 300
          600: '#8A7857',
          700: '#6F6046',
          800: '#554A36',
          900: '#3B3325'
        },
        orange: {
          50: '#F7F2E7',
          100: '#F0E7D2',
          200: '#E5D6B8',
          300: '#D4BF97',
          400: '#BFA87F',
          500: '#A39170',
          600: '#8A7857',
          700: '#6F6046',
          800: '#554A36',
          900: '#3B3325'
        },
        yellow: {
          50: '#F7F2E7',
          100: '#F0E7D2',
          200: '#E5D6B8',
          300: '#D4BF97',
          400: '#BFA87F',
          500: '#A39170',
          600: '#8A7857',
          700: '#6F6046',
          800: '#554A36',
          900: '#3B3325'
        },
        // Red family
        red: {
          50: '#F9EAE8',
          100: '#F3D6D3',
          200: '#E5ACA6',
          300: '#D57F76',
          400: '#C25246',
          500: '#AC2E20',
          600: '#9B140B', // Red
          700: '#7D100A',
          800: '#5E0C07',
          900: '#400805'
        },
        rose: {
          50: '#F9EAE8',
          100: '#F3D6D3',
          200: '#E5ACA6',
          300: '#D57F76',
          400: '#C25246',
          500: '#AC2E20',
          600: '#9B140B',
          700: '#7D100A',
          800: '#5E0C07',
          900: '#400805'
        }
      },
      borderRadius: {
        '4xl': '2rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 18, 18, 0.04), 0 10px 30px -14px rgba(18, 18, 18, 0.12)',
        'card-lg': '0 2px 4px rgba(18, 18, 18, 0.05), 0 20px 44px -18px rgba(18, 18, 18, 0.18)',
        pill: '0 8px 20px -8px rgba(57, 89, 23, 0.45)'
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.45s ease-out both',
        'slide-up': 'slide-up 0.4s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
        in: 'fade-in 0.3s ease-out both'
      }
    }
  },
  plugins: []
}
