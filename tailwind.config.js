// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xsx': '900px',
        'xsmall': '345px',
        'xlx': '1300px',
      },
      fontWeight: {
        'extra-black': '900',
      },
      colors: {
        'custom-gray': 'rgb(200, 200, 200)',
        'custom-light-red': '#fff9f9',
        'custom-red': '#1a0303',
      },
      fontSize: {
        'custom-sz': '25px',
        'custom-size': '20px',
      },
      boxShadow: {
        'profile-navbar': '0px 0px 5px #c2c2c2', 
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        fadeInOut: 'fadeInOut 2s infinite',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.no-scrollbar': {
          '-webkit-overflow-scrolling': 'touch',
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      addUtilities(newUtilities, ['responsive']);
    },
  ],
}
