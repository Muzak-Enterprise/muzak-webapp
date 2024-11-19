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
      animation: {
        grow: "grow 1s ease-in-out",
      },
      keyframes: {
        grow: {
          "0%": {
            transform: "scale(0)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
}