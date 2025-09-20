/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ bắt buộc để next-themes hoạt động
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
