import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        border: "border 4s linear infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        hacker: {
          "primary": "#00ff00",
          "secondary": "#00ffff",
          "accent": "#ff00ff",
          "neutral": "#1a1a1a",
          "base-100": "#050505",
          "base-200": "#0a0a0a",
          "base-300": "#121212",
          "info": "#00e1ff",
          "success": "#00ff9d",
          "warning": "#e6ff00",
          "error": "#ff003c",
        },
      },
    ],
  },
};
