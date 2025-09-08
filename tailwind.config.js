/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220 89% 46%)',
        accent: 'hsl(208 92% 52%)',
        bg: 'hsl(210 40% 98%)',
        surface: 'hsl(0 0% 100%)',
        'text-primary': 'hsl(220 13% 13%)',
        'text-secondary': 'hsl(215 15% 45%)',
      },
      boxShadow: {
        'small': '0 1px 2px 0 hsla(0,0%,0%,0.05)',
        'medium': '0 4px 6px -1px hsla(0,0%,0%,0.1), 0 2px 4px -2px hsla(0,0%,0%,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}