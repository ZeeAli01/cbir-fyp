/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // make sure it processes your source files
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: "#1E3A5F",
          900: "#0F1D3B",
        },
        blue: {
          100: "#D4E6FF",
          300: "#7FB7FF",
          500: "#0070F3",
        },
      },
    },
  },
  plugins: [],
};
