/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0098a5',
        LightPrimary: '#F3FAFB',
        secondary: '#e30613',
        DarkGray: '#111619',
        LightGray: '#667085',
      },
    },
  },
  plugins: [],
};

