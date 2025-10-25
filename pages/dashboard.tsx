import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { PatientDashboard } from '../components/PatientDashboard';
import { DoctorDashboard } from '../components/DoctorDashboard';
import Head from 'next/head';

const DashboardPage = () => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // We add a check to ensure this only runs client-side after hydration.
        if (typeof window !== 'undefined' && !user) {
            router.replace('/login');
        }
    }, [user, router]);

    // Render a loading state or null while checking for user and redirecting
    if (!user) {
        return (
            <>
              <Head><title>Loading... | Health Buddy</title></Head>
              <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
              </div>
            </>
        );
    }

    // Render the correct dashboard based on the user's role
    if (user.role === 'Patient') {
        return <PatientDashboard />;
    }

    if (user.role === 'Doctor') {
        return <DoctorDashboard />;
    }

    return null; // Should not happen in a valid state
};

export default DashboardPage;
