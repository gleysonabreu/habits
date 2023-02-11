/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))',
      },
      maxWidth: {
        280: '70rem',
        250: '62.5rem',
        120: '30rem',
      },
      boxShadow: {
        header: 'inset 0 -1px 0 #29292e',
      },
      colors: {
        brand: {
          blue: {
            light: '#6A80FF',
            mid: '#4863F7',
            dark: '#3249CB',
            low: '#182049',
          },
        },
        gray: {
          100: '#E1E1E6',
          200: '#C4C4CC',
          300: '#8D8D99',
          400: '#7C7C8A',
          500: '#505059',
          600: '#323238',
          700: '#29292E',
          800: '#202024',
          900: '#121214',
          950: '#09090A',
        },
      },
    },
  },
  plugins: [],
};
