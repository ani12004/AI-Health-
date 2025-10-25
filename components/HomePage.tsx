import React from 'react';
import { useRouter } from 'next/router';
import { HeartPulse } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';
import Head from 'next/head';

export const HomePage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };
  
  return (
    <>
      <Head>
        <title>Welcome to Health Buddy</title>
        <meta name="description" content="Your AI-powered health assistant, providing personalized insights and connecting you with medical professionals." />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 animate-fade-in">
        <ParticleBackground />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[2px]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 p-4 bg-white/20 dark:bg-black/20 rounded-full backdrop-blur-lg shadow-lg">
            <HeartPulse className="text-health-buddy-blue h-12 w-12 md:h-16 md:w-16" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Health Buddy
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10">
            Your AI-powered health assistant, providing personalized insights and connecting you with medical professionals.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-health-buddy-blue text-white font-bold text-lg py-4 px-10 rounded-xl shadow-lg hover:animate-pulse-glow transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-health-buddy-blue/50"
          >
            Get Started
          </button>
        </div>
         <footer className="absolute bottom-4 w-full text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2025 Health Buddy</p>
        </footer>
      </div>
    </>
  );
};
