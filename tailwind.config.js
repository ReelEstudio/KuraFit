/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Esto asegura que las animaciones que tienes en globals.css funcionen
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
