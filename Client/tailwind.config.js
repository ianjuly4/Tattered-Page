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
        sans: ['Poppins', 'sans-serif'], // Use clean, soft fonts
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
          "nuetral": "#cea2d7", 
    },
  },
    "light", "dark", "aqua", "pastel", "sunset", "night", "valentine",
    ],  // Add available DaisyUI themes
    darkTheme: "night", // Optional: Set a default dark mode theme
    base: true, // Apply base background and foreground colors to root element
    styled: true, // Use DaisyUI's default styles
    utils: true, // Enable utility classes for responsive and other modifiers
    prefix: "", // Optional: Define a class prefix (default is '')
    logs: true, // Show logs for DaisyUI's version and config when building
    themeRoot: ":root", // Define where theme variables will be applied
  },
};
