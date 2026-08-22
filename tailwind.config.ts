import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calm, warm, professional palette
        sage: {
          50: "#f2f6f3",
          100: "#e2ebe4",
          200: "#c5d7ca",
          300: "#9fbaa8",
          400: "#739882",
          500: "#547a64",
          600: "#3f7561", // primary
          700: "#345e4e",
          800: "#2b4b40",
          900: "#243e35",
        },
        clay: {
          50: "#fbf5f0",
          100: "#f6e7db",
          200: "#ecccb4",
          300: "#e0ac89",
          400: "#d5926a", // warm accent
          500: "#c67750",
          600: "#b46145",
          700: "#954d3a",
        },
        ink: "#2a302c",
        muted: "#6b7269",
        line: "#e7e2d8",
        canvas: "#faf8f3", // warm off-white background
        cream: "#f4efe6",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(42,48,44,0.04), 0 8px 24px -12px rgba(42,48,44,0.12)",
        lift: "0 2px 4px rgba(42,48,44,0.05), 0 18px 40px -18px rgba(42,48,44,0.18)",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
