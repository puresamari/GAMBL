module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "#fff"
      },
      colors: {
        black: "#000",
        white: "#fff",
        gray: "#999",
        pink: "#FF00E5",
        green: "#00FFB2"
      },
      fontFamily: {
        mono: ["Cutive Mono", "monospace"],
        body: ["Cinzel", "serif"]
      }
    }
  },
  plugins: []
};
