/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        zoomPan: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "25%": { transform: "scale(1.1) translate(10px, -10px)" },
          "50%": { transform: "scale(1.2) translate(-10px, 10px)" },
          "75%": { transform: "scale(1.1) translate(10px, 10px)" },
          "100%": { transform: "scale(1) translate(0, 0)" },
        },
      },
      animation: {
        zoomPan: "zoomPan 10s infinite ease-in-out",
      }
    },
  },
  plugins: [],
}