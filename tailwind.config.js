/* eslint-env node */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Syne Variable", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.5rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-react-aria-components"),
  ],
};
