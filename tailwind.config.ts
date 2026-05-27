import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        graphite: "#0E0E0E",
        bronze: {
          dark: "#1A1512",
          DEFAULT: "#B08D57",
          light: "#D8C7A3",
        },
        burgundy: "#6F1D1B",
        warm: "#F4EFE6",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "gradient-shift": "gradient-shift 12s ease-in-out infinite",
        "light-drift": "light-drift 8s ease-in-out infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "light-drift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(20px, -10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
