import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/tsx/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

