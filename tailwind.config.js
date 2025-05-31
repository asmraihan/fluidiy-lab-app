/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0078D7',
        secondary: '#00B294',
        warning: '#FFB900',
        error: '#E81123',
      },
      fontFamily: {
        'inter-regular': ['Inter-Regular'],
        'inter-medium': ['Inter-Medium'],
        'inter-bold': ['Inter-Bold'],
      },
      textShadow: {
        'text': '1px 1px 2px rgba(0, 0, 0, 0.75)',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.shadow-text': {
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        },
      });
    },
  ],
};