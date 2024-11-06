const { blackA, violet, mauve, green } = require("@radix-ui/colors");


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ajuste ce chemin selon ton arborescence
  ],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...violet,
        ...mauve,
        ...green,
      },
    },
  },
  plugins: [],
}