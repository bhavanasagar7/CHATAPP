/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure it includes your components
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
};
