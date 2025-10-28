import React from 'react';
import { useRouter } from 'next/router';
import { HeartPulse } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';
import Head from 'next/head';
import { AnimatedNumber } from './AnimatedNumber';

const modelStats = [
  { emoji: '❤️', name: 'Heart Disease', accuracy: 91.56, reliability: 'High Reliability' },
  { emoji: '💉', name: 'Diabetes', accuracy: 95.86, reliability: 'Excellent Accuracy' },
  { emoji: '🩸', name: 'Hypertension', accuracy: 98.56, reliability: 'Excellent Accuracy' },
  { emoji: '😌', name: 'Stress', accuracy: 52.62, reliability: 'Moderate Reliability' },
];

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
      <div className="min-h-screen flex flex-col items-center p-4">
        <ParticleBackground />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[2px]"></div>
        
        <main className="relative z-10 flex flex-col items-center w-full flex-grow justify-center py-20">
          <div className="text-center animate-fade-in">
            <div className="mb-6 p-4 inline-block bg-white/20 dark:bg-black/20 rounded-full backdrop-blur-lg shadow-lg">
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
          
          <section className="mt-24 w-full max-w-5xl text-center animate-fade-in opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🧠 Model Performance Summary
            </h2>
            <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
              Real accuracy scores from trained ensemble AI models
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {modelStats.map((stat, index) => (
                <div 
                  key={stat.name}
                  className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-ios-dark p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-glow-blue animate-fade-in opacity-0"
                  style={{ animationDelay: `${600 + index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="text-5xl mb-3">{stat.emoji}</div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{stat.name}</h3>
                  <p className="text-4xl font-bold text-health-buddy-blue my-2">
                    <AnimatedNumber target={stat.accuracy} />%
                  </p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-full">
                    {stat.reliability}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </main>
        
         <footer className="relative z-10 w-full text-center pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2025 Health Buddy</p>
        </footer>
      </div>
    </>
  );
};
