/** @type {import('tailwindcss').Config} */




// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      keyframes: {
        rightslide: {
          '0%': { transform: 'translateX(80px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        rightslide: 'rightslide 0.7s ease-out forwards',
      },
    },
  },
  plugins: [],
};
