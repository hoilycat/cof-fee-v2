/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: { 
    extend: {
      backgroundImage: {
        // 별빛이 내림
        'stars': 'radial-gradient(0.5px 0.5px at 10px 10px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 20px 50px, #fff, rgba(0,0,0,0)), radial-gradient(0.5px 0.5px at 40px 90px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 80px 10px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 120px 60px, #fff, rgba(0,0,0,0)), radial-gradient(0.5px 0.5px at 150px 130px, #fff, rgba(0,0,0,0))'
      },
      backgroundSize: {
        // 500px마다 반복
        'stars': '500px 500px',
      }
    }, 
  },
  plugins: [],
}
