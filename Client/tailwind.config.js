// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', 
  ],
  theme: {
    extend: { 
      colors: {
        
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], 
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        lofitheme: {
          "base-100": "#674ab3", 
          "accent": "#a348a6", 
          "secondary": "#9f63c4", 
          "primary": "#9075d8", 
          "neutral": "#cea2d7", 
        },
      },
      "light", "dark", "aqua", "pastel", "sunset", "night", "valentine", 
    ],  
    darkTheme: "night", 
    base: true, 
    styled: true,
    utils: true, 
    prefix: "",
    logs: true, 
    themeRoot: ":root", 
  },
};
