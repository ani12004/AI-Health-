import React from 'react';
import { HeartPulse, Heart, Syringe, Droplet, Smile, BrainCircuit, DatabaseZap, Sparkles } from 'lucide-react';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ThemeToggle } from '../components/ThemeToggle';

interface HomePageProps {
  onGetStarted: () => void;
}

const aboutCards = [
  { 
    icon: <Sparkles className="h-8 w-8 text-yellow-400 shrink-0" />,
    title: 'Purpose & Value',
    description: 'Predicts early risks of Heart Disease, Diabetes, Hypertension, and Stress using your medical and lifestyle data to empower you with actionable health insights.'
  },
  { 
    icon: <BrainCircuit className="h-8 w-8 text-sky-500 shrink-0" />,
    title: 'Advanced Technology',
    description: 'Utilizes an advanced ensemble AI, combining Logistic Regression, Random Forest, and XGBoost models. The system continuously learns, adjusting probabilities for higher precision.'
  },
  { 
    icon: <DatabaseZap className="h-8 w-8 text-green-500 shrink-0" />,
    title: 'Data Integrity & Privacy',
    description: 'Trained on verified datasets (UCI, Kaggle), balanced with SMOTE for accuracy. Your inputs are handled securely and are never stored or shared, ensuring complete privacy.'
  },
];

const modelStats = [
  { icon: <Heart size={48} className="text-red-500" fill="currentColor" />, name: 'Heart Disease', accuracy: 91.56, reliability: 'High Reliability' },
  { icon: <Syringe size={48} className="text-sky-500" />, name: 'Diabetes', accuracy: 95.86, reliability: 'Excellent Accuracy' },
  { icon: <Droplet size={48} className="text-pink-500" fill="currentColor" />, name: 'Hypertension', accuracy: 98.56, reliability: 'Excellent Accuracy' },
  { icon: <Smile size={48} className="text-yellow-400" />, name: 'Stress', accuracy: 52.62, reliability: 'Moderate Reliability' },
];

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
              <HeartPulse className="text-health-buddy-blue h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Health Buddy</h1>
          </div>
          <ThemeToggle />
      </header>
      
      <main className="relative z-10 flex flex-col items-center w-full flex-grow justify-center py-10 md:py-20">
        <div className="text-center animate-fade-in">
          <div className="mb-6 p-4 inline-block bg-white/30 dark:bg-dark-card/30 rounded-full backdrop-blur-lg shadow-lg">
            <HeartPulse className="text-health-buddy-blue h-12 w-12 md:h-16 md:w-16" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Health Buddy
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10">
            Your AI-powered health assistant, providing personalized insights and connecting you with medical professionals.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-health-buddy-blue text-white font-bold text-lg py-4 px-10 rounded-xl shadow-lg hover:animate-pulse-glow transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-health-buddy-blue/50"
          >
            Get Started
          </button>
        </div>

        <section className="mt-24 w-full max-w-5xl text-center animate-fade-in opacity-0" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            About the AI Health Prediction System
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Our goal is to empower users with early health insights — enabling preventive care, awareness, and healthier living.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutCards.map((card, index) => (
              <div
                key={card.title}
                className="bg-white/60 dark:bg-dark-card/80 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-2xl shadow-ios-dark p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-glow-blue animate-fade-in opacity-0"
                style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="mb-3">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mt-24 w-full max-w-5xl text-center animate-fade-in opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
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
                className="bg-white/60 dark:bg-dark-card/80 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-2xl shadow-ios-dark p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-glow-blue animate-fade-in opacity-0"
                style={{ animationDelay: `${850 + index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center justify-center h-16 w-16 mb-3">{stat.icon}</div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{stat.name}</h3>
                <p className="text-4xl font-bold text-health-buddy-blue my-2">
                  <AnimatedNumber target={stat.accuracy} />%
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-slate-700/50 px-2 py-1 rounded-full">
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
  );
};