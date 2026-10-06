/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yunque: {
          50:  '#fffbea',
          100: '#fff3c4',
          200: '#fce588',
          300: '#fadb5f',
          400: '#f7c948',
          500: '#f0b429',
          600: '#de911d',
          700: '#cb6e17',
          800: '#b44d12',
          900: '#8d2b0b',
        },
        ink: {
          100: '#f3f4f6',
          200: '#d1d5db',
          300: '#9ca3af',
          400: '#6b7280',
          500: '#4a5263',
          600: '#343a49',
          700: '#232733',
          800: '#181b22',
          900: '#0f1115',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}