import React, { useState } from 'react';
import { User, Key, LogIn, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { SegmentedControl } from '../components/SegmentedControl';

export const LoginPage: React.FC = () => {
  const { login, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Patient');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password, role);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-black/10 dark:bg-white/10 p-4 rounded-full shadow-lg mb-4 backdrop-blur-sm">
          <HeartPulse className="text-health-buddy-blue" size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome to Health Buddy
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Sign in to access your dashboard.
        </p>
      </header>
      <main className="w-full max-w-sm">
        <div className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-ios-dark p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SegmentedControl<Role>
                label="Select your role:"
                options={[{label: 'Patient', value: 'Patient'}, {label: 'Doctor', value: 'Doctor'}]}
                selectedValue={role}
                onChange={setRole}
            />
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Username</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'Patient' ? 'patient' : 'doctor'}
                  className="block w-full rounded-lg border-transparent bg-black/10 dark:bg-white/10 py-3 pl-10 pr-3 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-health-buddy-blue/80 focus:shadow-glow-blue"
                  required
                />
              </div>
               <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 pl-1">Hint: use '{role.toLowerCase()}' for both username & password.</p>
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Key className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="block w-full rounded-lg border-transparent bg-black/10 dark:bg-white/10 py-3 pl-10 pr-3 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-health-buddy-blue/80 focus:shadow-glow-blue"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-health-buddy-blue text-white font-bold py-3 px-6 rounded-xl shadow-md hover:animate-pulse-glow transition-all duration-300 transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-health-buddy-blue focus:ring-opacity-75"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="w-full text-center mt-12 pb-4">
        <p className="text-sm text-gray-500 dark:text-gray-500">&copy; 2025 Health Buddy</p>
      </footer>
    </div>
  );
};