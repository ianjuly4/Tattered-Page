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
          "primary": "#A3BFD9", // Soft Blue
          "secondary": "#C3A0D9", // Soft Purple
          "accent": "#7C4C97", // Rich Purple
          "neutral": "#4A3C6C", // Dark Purple
          "base-100": "#F2E4C4", // Creamy Neutral
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
