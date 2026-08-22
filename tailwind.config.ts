import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, calm, professional palette — warmed neutrals + richer terracotta
        sage: {
          50: "#f1f5ee",
          100: "#e2ebdf",
          200: "#c6d8c3",
          300: "#a1bb9c",
          400: "#769a72",
          500: "#557b56",
          600: "#436b4f", // primary (warmed green)
          700: "#375741",
          800: "#2d4636",
          900: "#26392d",
        },
        clay: {
          50: "#fcf3ea",
          100: "#f8e5d3",
          200: "#efc8a4",
          300: "#e5a875",
          400: "#dc8c52", // warm accent (terracotta)
          500: "#cd6f3b",
          600: "#b85a30",
          700: "#97472a",
        },
        ink: "#2a2822",
        muted: "#786f62",
        line: "#ece3d4",
        canvas: "#faf5ec", // warm off-white background
        cream: "#f4ebdd",
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
