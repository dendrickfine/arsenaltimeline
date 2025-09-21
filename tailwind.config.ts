import type { Config } from 'tailwindcss';
// 1. Impor defaultTheme
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 2. Tambahkan fontFamily
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        blue: {
          600: 'rgb(37, 99, 235)',
          700: 'rgb(29, 78, 216)',
          800: 'rgb(30, 64, 175)',
        },
        gray: {
          50: 'rgb(249, 250, 251)',
          100: 'rgb(243, 244, 246)',
          300: 'rgb(209, 213, 219)',
          400: 'rgb(156, 163, 175)',
          500: 'rgb(107, 114, 128)',
          800: 'rgb(31, 41, 55)',
        },
      },
    },
  },
  plugins: [],
};
export default config;