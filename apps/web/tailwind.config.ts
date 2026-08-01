import type { Config } from "tailwindcss";

// Palette approximated from the brand sheet (Learnova.pdf) swatch names.
// Swap for exact hex once the design file's real values are exported.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "sage-green": "#8FA98B",
        "deep-blue": "#1F3A5F",
        "sky-blue": "#8FBEDD",
        "soft-blue": "#C7DDEE",
        beige: "#F1E9DD",
        "off-white": "#FAF9F6",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
