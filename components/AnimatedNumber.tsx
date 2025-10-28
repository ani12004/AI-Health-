import React, { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  target: number;
  duration?: number;
  decimals?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ target, duration = 1500, decimals = 2, className }) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic function for a smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = easedProgress * target;
      
      setCurrentNumber(value);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);

  }, [target, duration]);

  return <span className={className}>{currentNumber.toFixed(decimals)}</span>;
};
