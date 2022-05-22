module.exports = {
  purge: {
    enabled: false,
    content: ['src/**/*.tsx']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
