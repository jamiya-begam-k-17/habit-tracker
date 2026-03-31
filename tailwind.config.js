/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blossom: {
          50: '#fff0f5',
          100: '#ffe0ec',
          200: '#ffc2d9',
          300: '#ff94bb',
          400: '#ff5c96',
          500: '#ff2d75',
          600: '#f0005a',
          700: '#cc0049',
          800: '#a8003e',
          900: '#8c0036',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}