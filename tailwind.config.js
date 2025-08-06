/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        zzz: {
          '0%,20%': { opacity: 0, transform: 'translateY(0)' },
          '40%,60%': { opacity: 1, transform: 'translateY(-10px)' },
          '80%,100%': { opacity: 0, transform: 'translateY(-20px)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        zzz: 'zzz 2s infinite ease-in-out'
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "valentine", "forest"], 
  }
}
