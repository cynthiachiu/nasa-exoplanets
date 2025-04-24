import React, { useEffect } from 'react';

const StarBackground = () => {
  useEffect(() => {
    const createStars = () => {
      const count = 100;
      const starContainer = document.querySelector('.star-container');
      
      if (!starContainer) return;
      
      // Clear existing stars
      starContainer.innerHTML = '';
      
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random twinkle animation delay
        star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 3}s`;
        
        starContainer.appendChild(star);
      }
    };
    
    createStars();
    window.addEventListener('resize', createStars);
    
    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, []);
  
  return <div className="star-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>;
};

export default StarBackground;