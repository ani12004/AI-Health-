import React, { useState, useMemo, useEffect } from 'react';
import { Stethoscope, BrainCircuit, User, MessageSquare, List, HeartPulse } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataProvider';
import type { HealthData, RiskLevel } from './types';
import { RiskScoreDisplay } from './components/RiskScoreDisplay';
import { NotificationBell } from './components/NotificationBell';
import { ChatInterface } from './components/ChatInterface';
import { ThemeToggle } from './components/ThemeToggle';

const getRiskDetails = (score: number): { level: RiskLevel; textColor: string; ringColor: string; } => {
  if (score <= 33) return { level: 'Low', textColor: 'text-green-500 dark:text-green-400', ringColor: 'ring-green-500' };
  if (score <= 66) return { level: 'Medium', textColor: 'text-orange-500 dark:text-orange-400', ringColor: 'ring-orange-500' };
  return { level: 'High', textColor: 'text-red-500 dark:text-red-400', ringColor: 'ring-red-500' };
};

export const DoctorDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { reports, addNotification, updateReport } = useData();
    const [selectedPatient, setSelectedPatient] = useState<HealthData | null>(null);
    const [chattingWithPatient, setChattingWithPatient] = useState<HealthData | null>(null);

    const consultationRequests = useMemo(() => {
        return reports.filter(r => r.consultationStatus === 'requested' || r.consultationStatus === 'reviewed')
          .sort((a, b) => (a.consultationStatus === 'requested' ? -1 : 1));
    }, [reports]);

    useEffect(() => {
        if (selectedPatient && !consultationRequests.find(r => r.id === selectedPatient.id)) {
            setSelectedPatient(null);
            setChattingWithPatient(null);
        }
    }, [consultationRequests, selectedPatient]);

    const handleSelectPatient = (patient: HealthData) => {
        setSelectedPatient(patient);
        setChattingWithPatient(null);
    };
    
    const handleOpenChat = (patient: HealthData) => {
        if (patient.consultationStatus === 'requested') {
            const updatedReport = { ...patient, consultationStatus: 'reviewed' as const };
            updateReport(updatedReport);
            if(user) {
                addNotification({
                    id: Date.now().toString(),
                    userId: patient.userId,
                    message: `Dr. ${user.name} has reviewed your report and is available to chat.`,
                    read: false,
                    timestamp: Date.now(),
                });
            }
        }
        setChattingWithPatient(patient);
    };

    const renderPatientDetails = () => {
        if (!selectedPatient) return null;
        
        return (
             <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"><User className="mr-3"/>Report for: {selectedPatient.patientName}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1 mb-4">
                    {selectedPatient.age} years old, {selectedPatient.gender}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RiskScoreDisplay score={selectedPatient.score ?? 0} />
                    <div className="text-sm bg-slate-200/30 dark:bg-slate-900/40 p-4 rounded-lg shadow-inner space-y-2">
                        <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Patient Data Summary</h4>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                           <li><strong>BMI:</strong> {selectedPatient.bmi}</li>
                           <li><strong>Blood Pressure:</strong> {selectedPatient.systolic}/{selectedPatient.diastolic} mmHg</li>
                           <li><strong>Cholesterol:</strong> {selectedPatient.cholesterol} mg/dL</li>
                           <li><strong>Glucose:</strong> {selectedPatient.glucose} mg/dL</li>
                           <li><strong>Smoking:</strong> {selectedPatient.smoking} | <strong>Alcohol:</strong> {selectedPatient.alcohol}</li>
                           <li><strong>Activity:</strong> {selectedPatient.activity} days/week</li>
                           <li><strong>Family History:</strong> {selectedPatient.familyHistory}</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center"><BrainCircuit className="mr-2" /> AI Suggestions</h4>
                    <div className="bg-slate-200/30 dark:bg-slate-900/40 p-4 rounded-lg shadow-inner prose prose-sm max-w-none text-gray-600 dark:text-gray-300 max-h-40 overflow-y-auto custom-scrollbar">
                       <p className="whitespace-pre-wrap">{selectedPatient.aiSuggestions || "No suggestions available."}</p>
                    </div>
                </div>
                <div className="pt-4">
                    <button onClick={() => handleOpenChat(selectedPatient)} aria-label={`Open chat with ${selectedPatient.patientName}`} className="w-full bg-health-buddy-blue text-white font-bold py-4 px-6 rounded-xl shadow-md hover:animate-pulse-glow focus:outline-none focus:ring-2 focus:ring-health-buddy-blue focus:ring-opacity-75 transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] active:scale-100">
                        <MessageSquare className="mr-2 h-5 w-5" /> Open Chat
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 animate-fade-in transition-colors duration-500">
            <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 mb-4">
                <div className="flex items-center space-x-3">
                    <HeartPulse className="text-health-buddy-blue h-8 w-8" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Health Buddy - Dr. {user?.name}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <NotificationBell />
                    <button onClick={logout} aria-label="Log out of your account" className="text-sm font-semibold text-health-buddy-blue hover:brightness-125 transition-all">
                        Logout
                    </button>
                </div>
            </header>
            <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
                <section aria-labelledby="queue-heading" className="lg:col-span-1 bg-white/60 dark:bg-dark-card/80 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-2xl shadow-ios-dark p-6 transition-colors duration-500">
                    <h2 id="queue-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center"><List className="mr-3" /> Consultation Queue</h2>
                    <div className="bg-slate-200/30 dark:bg-slate-900/40 rounded-lg shadow-inner p-2 h-full min-h-[400px] max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {consultationRequests.length > 0 ? (
                            consultationRequests.map((report) => {
                                const { level, textColor } = getRiskDetails(report.score ?? 0);
                                return (
                                    <button
                                      key={report.id}
                                      onClick={() => handleSelectPatient(report)}
                                      aria-label={`View report for ${report.patientName}. Risk level: ${level}, Score: ${report.score}. ${report.consultationStatus === 'requested' ? 'New request.' : ''}`}
                                      className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-all duration-200 mb-1 ${selectedPatient?.id === report.id ? 'bg-health-buddy-blue/20 ring-2 ring-health-buddy-blue shadow-glow-selected' : 'hover:bg-slate-300/50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">{report.patientName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Age: {report.age}, Gender: {report.gender}</p>
                                            {report.consultationStatus === 'requested' && (
                                              <span className="text-xs font-semibold text-orange-500 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400 px-2 py-0.5 rounded-full">New Request</span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${textColor}`}>{report.score}</p>
                                            <p className={`text-xs font-semibold ${textColor}`}>{level} Risk</p>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                <p>No pending consultations.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section aria-label={selectedPatient ? `Details for patient ${selectedPatient.patientName}` : "Patient details area"} className="lg:col-span-2 bg-white/60 dark:bg-dark-card/80 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-2xl shadow-ios-dark p-6 md:p-8 transition-colors duration-500">
                    {chattingWithPatient ? (
                        <ChatInterface 
                            report={chattingWithPatient} 
                            onClose={() => setChattingWithPatient(null)} 
                        />
                    ) : selectedPatient ? (
                        renderPatientDetails()
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 h-full">
                            <Stethoscope size={48} className="mb-4" />
                            <h3 className="font-semibold text-lg">Select a patient to view their report</h3>
                            <p className="text-sm">Consultation requests from patients will appear in the list.</p>
                        </div>
                    )}
                </section>
            </main>
            <footer className="w-full text-center mt-8 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2025 Health Buddy</p>
            </footer>
             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); }
                .prose { --tw-prose-body: #374151; --tw-prose-bold: #111827; --tw-prose-bullets: #6b7280; }
                .dark .prose { --tw-prose-body: #d1d5db; --tw-prose-bold: #f9fafb; --tw-prose-bullets: #9ca3af;}
            `}</style>
        </div>
    );
};