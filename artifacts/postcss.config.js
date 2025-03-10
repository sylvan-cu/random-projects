export default {
  plugins: {
    '@tailwindcss/postcss': {
      // Ensure that the Tailwind config path is correctly set
      config: './tailwind.config.js',
    },
    autoprefixer: {},
  },
}
