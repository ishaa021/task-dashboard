/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 45px rgba(30, 41, 59, 0.08)',
        card: '0 8px 24px rgba(15, 23, 42, 0.07)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#fbfaf8',
        ink: '#20184e',
        muted: '#7b7890',
        primary: '#5030e5',
        primarySoft: '#ebe7ff',
        borderSoft: '#e7e1f2',
      },
    },
  },
  plugins: [],
};
