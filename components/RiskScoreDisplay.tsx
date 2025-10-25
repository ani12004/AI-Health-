import React, { useState, useEffect } from 'react';
import type { RiskLevel } from './types';

interface RiskScoreDisplayProps {
  score: number;
}

const getRiskDetails = (score: number): { level: RiskLevel; color: string; textColor: string } => {
  if (score <= 33) {
    return { level: 'Low', color: 'stroke-green-500', textColor: 'text-green-500 dark:text-green-400' };
  }
  if (score <= 66) {
    return { level: 'Medium', color: 'stroke-orange-500', textColor: 'text-orange-500 dark:text-orange-400' };
  }
  return { level: 'High', color: 'stroke-red-500', textColor: 'text-red-500 dark:text-red-400' };
};

export const RiskScoreDisplay: React.FC<RiskScoreDisplayProps> = ({ score }) => {
  const { level, color, textColor } = getRiskDetails(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  
  const [offset, setOffset] = useState(circumference);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const scoreOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => setOffset(scoreOffset), 100);

    let startTimestamp: number | null = null;
    const duration = 1500; 

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.floor(easedProgress * score);
      
      setAnimatedScore(currentScore);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);

    return () => {
      clearTimeout(timer);
      // No need to cancel animation frame here as it stops itself
    };
  }, [score, circumference]);


  return (
    <div 
      className="flex flex-col items-center justify-center p-6 bg-black/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl max-w-sm mx-auto shadow-ios-dark"
      role="region"
      aria-live="polite"
      aria-label={`Health Risk Assessment Result: ${score} out of 100, which is a ${level} risk.`}
    >
      <div className="relative w-40 h-40" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-gray-400/20 dark:text-gray-700/30"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className={`${color} drop-shadow-md`}
            style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s ease-out' }}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-800 dark:text-white">{animatedScore}</span>
          <span className={`text-sm font-semibold ${textColor}`}>{level} Risk</span>
        </div>
      </div>
       <p className="mt-4 text-gray-500 dark:text-gray-400 text-center text-xs max-w-xs">
        This is a simulated score based on the provided data. Please consult a healthcare professional for an official medical diagnosis.
      </p>
    </div>
  );
};
