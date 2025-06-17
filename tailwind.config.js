/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        breathing: "breathing 3s ease-in-out infinite",
        "spin-slow": "spin 2s linear infinite",
        "spin-fast": "spin 0.5s linear infinite",
      },
      keyframes: {
        breathing: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
      },
      screens: {
        xlg: "1680px",
        clg: { min: "1440px", max: "1679px" },
        lclg: { min: "1280px", max: "1439px" },
        sm1275: { min: "937px", max: "1279px" },
      },

      backgroundImage: (theme) => ({
        "hero-pattern": "url('/src/assets/hero_asset.png')",
        "event-pattern": "url('/src/assets/AttensysEventssection.png')",
        "bootcamp-pattern": "url('/src/assets/bootcampbg.png')",
        "testimonial-gradient":
          "linear-gradient(90deg, rgba(155, 81, 224, 0.2) 0%, rgba(74, 144, 226, 0.2) 100%)",
        "event-gradient":
          "linear-gradient(174.77deg, #2D3A4B 4.2%, #9B51E0 180.81%)",
        "details-gradient": "linear-gradient(90deg, #9B51E0 0%, #4A90E2 100%)",
        "oneclick-gradient":
          "linear-gradient(90deg, rgba(155, 81, 224, 0.4) 0%, rgba(74, 144, 226, 0.4) 100%)",
        "amount-gradient":
          "linear-gradient(90deg, rgba(155, 81, 224, 0.4) 0%, rgba(74, 144, 226, 0.4) 100%)",
        "eventcard-gradient":
          "linear-gradient(90deg, rgba(155, 81, 224, 0.4) 0%, rgba(74, 144, 226, 0.4) 100%)",
        "carousell-gradient":
          "linear-gradient(182.29deg, rgba(4, 4, 4, 0) 1.76%, #000000 97.93%)",
        "create-gradient":
          "linear-gradient(180deg, rgba(155, 81, 224, 0.32) 0%, rgba(74, 144, 226, 0.32) 100%)",
        "bootcreate-gradient":
          "linear-gradient(90deg, #4A90E2 0%, #9B51E0 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      }),
      boxShadow: {
        "custom-blue": "0px 4px 100px 0px rgba(74, 144, 226, 0.5)",
        "custom-1": "0px 4px 4px rgba(0, 0, 0, 0.25)",
        "custom-2": "0px 4px 4px rgba(0, 0, 0, 0.25)",
        "custom-3": "0px 4px 4px rgba(0, 0, 0, 0.25)",
        1: "1px",
        2: "2px",
        3: "3px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
      borderWidth: {
        3: "3px",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
});
