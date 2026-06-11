/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1A1A2E",
          50: "#F5F5F7",
          100: "#E8E8ED",
          200: "#C4C4D0",
          300: "#9A9AAC",
          400: "#6B6B80",
          500: "#4A4A5E",
          600: "#35354A",
          700: "#26263A",
          800: "#1A1A2E",
          900: "#0F0F1F",
        },
        paper: {
          DEFAULT: "#FAF7F2",
          50: "#FDFCF9",
          100: "#FAF7F2",
          200: "#F3EDE3",
          300: "#E8DFCF",
          400: "#D9CCB4",
          500: "#C9B896",
        },
        vermilion: {
          DEFAULT: "#C84B31",
          50: "#FBECE7",
          100: "#F6D4CA",
          200: "#EDA895",
          300: "#E47C60",
          400: "#DB503B",
          500: "#C84B31",
          600: "#9B3B26",
          700: "#6E2A1B",
        },
        moss: {
          DEFAULT: "#2D4A3E",
          50: "#E8EDEB",
          100: "#D0DBD7",
          200: "#A1B7AE",
          300: "#729386",
          400: "#4A6F5F",
          500: "#2D4A3E",
          600: "#22382F",
          700: "#16261F",
        },
        gold: {
          DEFAULT: "#B8860B",
          50: "#F8EED7",
          100: "#F0DCAE",
          200: "#E6C477",
          300: "#DCA741",
          400: "#CA8B18",
          500: "#B8860B",
          600: "#916A09",
          700: "#6A4F07",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"思源宋体"', "serif"],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', '"思源黑体"', "sans-serif"],
      },
      boxShadow: {
        paper: "0 1px 3px rgba(26, 26, 46, 0.04), 0 4px 12px rgba(26, 26, 46, 0.06)",
        "paper-hover": "0 4px 12px rgba(26, 26, 46, 0.08), 0 8px 24px rgba(26, 26, 46, 0.1)",
        glow: "0 0 0 2px rgba(200, 75, 49, 0.2)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
