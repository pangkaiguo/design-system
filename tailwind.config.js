/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        geistSans: "var(--font-geist-sans)",
        geistMono: "var(--font-geist-mono)",
      },
      customBlack: '#000000',
      customWhite: '#FFFFFF',
      customGray: '#F2F2F2',
      customBlue: '#007AFF',
      customGreen: '#34C759',
      customRed: '#FF3B30',
      customYellow: '#FFC900',
      customPurple: '#5856D6',
      customPink: '#FF2D55',
    },
  },
  plugins: [],
};

