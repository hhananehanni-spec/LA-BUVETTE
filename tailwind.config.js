/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#F8F1E7',
        'cream-2': '#E8D9C5',
        ink: '#2D2926',
        rouille: '#C44536',
        'gray-1': '#7A7571',
        'gray-2': '#B5AFA9',
        line: '#E0D6C8',
        dark: '#1F1B18',
      },
    },
  },
  plugins: [],
};
