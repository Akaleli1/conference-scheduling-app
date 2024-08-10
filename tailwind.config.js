/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        header: '#27293c', // h1-h2-h3.. header color
        text: '#2b2d42', // p, span, text color
        component: {
          DEFAULT: '#8d99ae', // Component background
          light: '#bdc6d1', // Component background lightened
          lighter: '#d5dce3', // Component background lightened more
        },
        background: '#edf2f4', // App background
        primary: '#0077b6', // Default (primary) color (buttons, icons)
        success: '#24c497', // Success operations
        danger: '#ef233c', // Danger, crucial operations
      },
    },
  },
  plugins: [],
};