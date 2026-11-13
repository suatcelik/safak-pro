/* global __filename */
// Renk, yazı ve köşe değerleri src/theme/tokens.ts'den gelir (tek kaynak).
const jiti = require('jiti')(__filename);
const { colors, fonts, radius } = jiti('./src/theme/tokens.ts');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: [fonts.medium],
        jk400: [fonts.regular],
        jk500: [fonts.medium],
        jk600: [fonts.semibold],
        jk700: [fonts.bold],
        jk800: [fonts.extrabold],
      },
      borderRadius: {
        card: `${radius.card}px`,
        'card-sm': `${radius.cardSm}px`,
        chip: `${radius.chip}px`,
      },
    },
  },
  plugins: [],
};
