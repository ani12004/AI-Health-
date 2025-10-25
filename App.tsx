import React from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './PatientCalculator';
import { DoctorDashboard } from './DoctorDashboard';

export const App: React.FC = () => {
    const { user } = useAuth();

    const renderContent = () => {
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
        <div className="relative">
            {/* The styling for fade transitions can be kept if desired, but a simpler render is cleaner for auth-based routing */}
            {renderContent()}
        </div>
    );
};