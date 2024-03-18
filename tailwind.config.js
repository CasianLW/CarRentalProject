/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "app-black": {
          200: "#0B0D10",
          300: "#03050C",
        },
        "app-white": {
          100: "#FFFFFF",
          200: "#EFEFF0",
        },
        "app-copper": {
          100: "#CCA373",
          200: "#B08451",
          300: "#9A6B36",
        },
      },
    },
  },
  plugins: [],
};
