/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        panel: "#18181b",
        accent: "#e50914",
      },
    },
  },
  plugins: [],
};
