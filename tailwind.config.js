/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        chic: {
          cream: "#FFF8F2",
          blush: "#F6D6D3",
          burgundy: "#6A0D2A",
          rosewood: "#8B3B46",
          latte: "#E9DCC9",
          slate: "#475569"
        }
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
}
