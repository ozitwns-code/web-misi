import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F1EA",
        ink: {
          DEFAULT: "#241C15",
          soft: "#5A5044",
        },
        teal: {
          DEFAULT: "#176D5D",
          dark: "#0F4F44",
          light: "#DCEDE8",
        },
        amber: {
          DEFAULT: "#B9752D",
          light: "#F1DFC4",
        },
        bubble: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "Manrope", "sans-serif"],
        chat: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        thread: "26rem",
      },
      keyframes: {
        "bubble-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "dot-bounce": {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-3px)" },
        },
        "step-in": {
          "0%": { opacity: "0", transform: "translateX(14px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "bubble-in": "bubble-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "dot-bounce": "dot-bounce 1.1s ease-in-out infinite",
        "step-in": "step-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
