import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        bone: '#F5F5F5',
        cloud: '#A8A8A8',
        line: '#1F1F1F',
        accent: '#8AB4F8',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        snug: '-0.02em',
      },
    },
  },
  plugins: [],
};

export default config;
