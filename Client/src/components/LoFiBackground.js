import React from 'react';
import lofiBackground from '../assets/lofi-background.svg'; // Your SVG or JPG file

const LoFiBackground = () => {
  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        aspectRatio: '16 / 9', // Set an aspect ratio to match your SVG (adjust as needed)
        position: 'relative',
        backgroundImage: `url(${lofiBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Add any other content here */}
    </div>
  );
};

export default LoFiBackground;
