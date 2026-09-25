import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090c0a",
        foreground: "#f5f5f0",
        onyx: {
          950: "#050706",
          900: "#090c0a",
          850: "#0e1210",
          800: "#141c16",
          700: "#1e2922",
        },
        gold: {
          100: "#fdf8e7",
          200: "#f9ecc2",
          300: "#f3da8c",
          400: "#dfb743",
          500: "#c59b27",
          600: "#a67f1b",
          700: "#805e13",
        },
        amber: {
          honey: "#d97706",
          nectar: "#f59e0b",
          deep: "#92400e",
        },
        forest: {
          dark: "#0b140e",
          deep: "#141c16",
          leaf: "#223327",
        }
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "Playfair Display", "serif"],
        display: ["var(--font-cinzel)", "Cinzel", "serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "Inter", "sans-serif"],
      },
      letterSpacing: {
        monumental: "0.25em",
        luxury: "0.18em",
      },
      boxShadow: {
        gold: "0 0 25px -5px rgba(223, 183, 67, 0.2)",
        "gold-glow": "0 0 50px -10px rgba(223, 183, 67, 0.25)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #dfb743 0%, #c59b27 50%, #805e13 100%)",
        "radial-glow": "radial-gradient(circle at 50% 30%, rgba(223, 183, 67, 0.12) 0%, rgba(9, 12, 10, 0) 70%)",
        "forest-glow": "radial-gradient(circle at 80% 20%, rgba(20, 28, 22, 0.6) 0%, rgba(9, 12, 10, 0) 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
