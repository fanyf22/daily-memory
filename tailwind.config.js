/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Montserrat Variable'", "sans-serif"],
        serif: ["'Rokkitt Variable'", "serif"],
        mono: ["'Fira Code Variable'", "monospace"],
      },
    },
  },
  plugins: [],
};
