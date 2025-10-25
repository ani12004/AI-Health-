import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './PatientCalculator';
import { DoctorDashboard } from './DoctorDashboard';

export const App: React.FC = () => {
    const { user } = useAuth();
    const [showLanding, setShowLanding] = useState(true);

    const handleGetStarted = () => {
        setShowLanding(false);
    };

    const renderContent = () => {
        if (showLanding) {
            return <HomePage onGetStarted={handleGetStarted} />;
        }

        if (!user) {
            return <LoginPage />;
        }

        if (user.role === 'Patient') {
            return <PatientDashboard />;
        }

        if (user.role === 'Doctor') {
            return <DoctorDashboard />;
        }

        return null; // Should not happen
    };

    return (
        <div className="min-h-screen bg-gradient-futuristic-light dark:bg-gradient-futuristic bg-[length:200%_200%] animate-gradient-pan font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
            {renderContent()}
        </div>
    );
};