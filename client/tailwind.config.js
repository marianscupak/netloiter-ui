/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    fontSize: {
      base: "18px",
      header: "40px",
      subheader: "35px",
      subsubheader: "30px",
    },
    colors: {
      gray: "#404040",
      "dark-gray": "#414C58",
      "light-gray": "#C8CCD0",
      black: "#1F262E",
      primary: "#64D22D",
      "light-primary": "#B2E896",
      white: "#F2F2F3",
      error: "#D41121",
      warning: "#FFBA1A",
    },
    fontFamily: {
      sans: ['"Poppins"', "sans-serif"],
    },
  },
  plugins: [],
};
