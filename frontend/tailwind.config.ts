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
        primary: {
          DEFAULT: '#1d4ed8',
          dark: '#1e3a8a',
          light: '#3b82f6',
          50: '#eff6ff',
        },
        secondary: {
          DEFAULT: '#059669',
          light: '#34d399',
        },
        accent: '#dc2626',
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fde68a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
