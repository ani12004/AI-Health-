import React, { useState } from 'react';
import { Stethoscope, User, Key, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans text-gray-800 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-white p-4 rounded-full shadow-lg mb-4">
          <Stethoscope className="text-ios-blue" size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          AI Health Platform
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Sign in to continue to your dashboard.
        </p>
      </header>
      <main className="w-full max-w-sm">
        <div className="bg-gray-100 rounded-2xl shadow-neumorphic p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-200 p-1">
                <button
                  type="button"
                  onClick={() => setRole('Patient')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${role === 'Patient' ? 'bg-white shadow-sm text-ios-blue' : 'text-gray-500'}`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Doctor')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${role === 'Doctor' ? 'bg-white shadow-sm text-ios-blue' : 'text-gray-500'}`}
                >
                  Doctor
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">Username</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'Patient' ? 'patient' : 'doctor'}
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-gray-800 shadow-sm focus:border-ios-blue focus:bg-white focus:ring-2 focus:ring-ios-blue"
                  required
                />
              </div>
               <p className="text-xs text-gray-400 mt-1 pl-1">Hint: use '{role.toLowerCase()}' for both username & password.</p>
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-600 mb-2">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-gray-800 shadow-sm focus:border-ios-blue focus:bg-white focus:ring-2 focus:ring-ios-blue"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-ios-blue text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-100"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="w-full text-center mt-12 pb-4">
        <p className="text-sm text-gray-400">&copy; 2025 Health AI</p>
      </footer>
    </div>
  );
};
