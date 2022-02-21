module.exports = {
 content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui'],
        mono: ['IBM Plex Mono', 'system-ui'],
      }
    }
  },
  plugins: [],
}
