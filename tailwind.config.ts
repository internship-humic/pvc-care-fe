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
        primary: {
          DEFAULT: "#3b82f6", // brand blue (blue-500)
          hover: "#2563eb",   // brand blue hover (blue-600)
          dark: "#2064B7",    // dark brand blue from login page
          darkHover: "#1A539B", // hover state for dark brand blue
        },
        secondary: {
          DEFAULT: "#10b981", // emerald green (emerald-500)
        },
        accent: {
          DEFAULT: "#eff6ff", // light blue background (blue-50)
        }
      },
    },
  },
  plugins: [],
};

export default config;
