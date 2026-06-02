/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        velo: {
          dark: "#1a1a2e",
          primary: "#0f3460",
          accent: "#e94560",
          steel: "#c0c0c0",
          light: "#f5f5f5",
          white: "#ffffff",
          text: "#333333",
        },
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      borderRadius: {
        velo: "4px",
      },
    },
  },
  plugins: [],
}
