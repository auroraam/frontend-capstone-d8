module.exports = {
  content: [
    "./pages//*.{js,jsx}",
    "./components//*.{js,jsx}",
    "./app//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['var(--font-comic)'],
      },
    },
  },
  plugins: [],
}