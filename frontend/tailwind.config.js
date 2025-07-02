// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#005687',
        },
        smiles: {
          blue: '#005687',
          orange: '#F58220',
          green: '#7AC143',
          gentleBlue: '#008BB0',
          redOrange: '#F05326',
          brightGreen: '#B9D133',
        },
      },
    },
  },
  plugins: [],
}
