/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // <-- Gunakan 'tailwindcss', bukan '@tailwindcss/postcss'
    autoprefixer: {},
  },
};

export default config;