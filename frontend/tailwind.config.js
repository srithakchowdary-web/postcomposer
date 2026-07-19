/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#fff5f8",
          100: "#ffe4ec",
          200: "#ffc9db",
          300: "#ffa6c4",
          400: "#ff7fa8",
          500: "#f26191",
        },
      },
    },
  },
  plugins: [],
};