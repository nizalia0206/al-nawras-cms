/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bgdark: "#122a52",
        bgdarker: "#0c1c3d",
        panel: "#17305e",
        panel2: "#1d3a70",
        steel: "#93a1c2",
        steellight: "#d3daea",
        flame1: "#ee6c2f",
        flame2: "#f28a45",
        ember: "#c8501c",
        gold: "#f7941d",
        paper: "#f4f6fa",
        paper2: "#eceff5",
        ink: "#131c33",
        inksoft: "#4b5670",
        navy: "#122a52",
        navydeep: "#0c1c3d",
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        flame: "0 8px 24px -8px rgba(255,91,30,.55)",
      },
    },
  },
  plugins: [],
};
