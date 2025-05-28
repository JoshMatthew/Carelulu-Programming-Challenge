import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBg: "#23AAAA",
        secondaryBg: "#97D1D0",
        accent: "#F15786",
        secondaryAccent: "#FEB708",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        lexend: ["Lexend", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
} satisfies Config;
