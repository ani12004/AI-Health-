import React, { useState, useMemo } from 'react';
import { Stethoscope, BrainCircuit, User, Video, List } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataProvider';
import type { HealthData, RiskLevel } from './types';
import { RiskScoreDisplay } from './components/RiskScoreDisplay';
import { NotificationBell } from './components/NotificationBell';

const getRiskDetails = (score: number): { level: RiskLevel; textColor: string; ringColor: string; } => {
  if (score <= 33) return { level: 'Low', textColor: 'text-green-600', ringColor: 'ring-green-500' };
  if (score <= 66) return { level: 'Medium', textColor: 'text-orange-600', ringColor: 'ring-orange-500' };
  return { level: 'High', textColor: 'text-red-600', ringColor: 'ring-red-500' };
};

export const DoctorDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { reports, addNotification } = useData();
    const [selectedPatient, setSelectedPatient] = useState<HealthData | null>(null);
    
    const consultationRequests = useMemo(() => {
        return reports.filter(r => r.consultationStatus === 'requested');
    }, [reports]);
    
    const handleCreateMeeting = (patient: HealthData) => {
        const meetLink = `https://meet.google.com/lookup/${Math.random().toString(36).substring(2, 10)}`;
        addNotification({
            id: Date.now().toString(),
            userId: patient.userId,
            message: `Dr. ${user?.name} has created a meeting for you.`,
            link: meetLink,
            read: false,
            timestamp: Date.now(),
        });
        // Here you might also update the report status to 'reviewed'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans text-gray-800 flex flex-col items-center p-4">
            <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 mb-4">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-800">Doctor Portal - Dr. {user?.name}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <NotificationBell />
                    <button onClick={logout} className="text-sm font-semibold text-ios-blue hover:text-blue-700 transition-colors">
                        Logout
                    </button>
                </div>
            </header>
            <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
                {/* Patient List Section */}
                <div className="lg:col-span-1 bg-gray-100 rounded-2xl shadow-neumorphic p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><List className="mr-3" /> Consultation Requests</h2>
                    <div className="bg-white/80 rounded-lg shadow-inner p-2 h-full min-h-[400px] max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {consultationRequests.length > 0 ? (
                            consultationRequests.map((report) => {
                                const { level, textColor, ringColor } = getRiskDetails(report.score ?? 0);
                                return (
                                    <button key={report.id} onClick={() => setSelectedPatient(report)} className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-all duration-200 mb-1 ${selectedPatient?.id === report.id ? 'bg-ios-blue/10 ring-2 ' + ringColor : 'hover:bg-gray-200/50'}`}>
                                        <div>
                                            <p className="font-bold text-gray-900">{report.patientName}</p>
                                            <p className="text-sm text-gray-500">Age: {report.age}, Gender: {report.gender}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${textColor}`}>{report.score}</p>
                                            <p className={`text-xs font-semibold ${textColor}`}>{level} Risk</p>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>No pending consultations.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Report Details Section */}
                <div className="lg:col-span-2 bg-gray-100 rounded-2xl shadow-neumorphic p-6 md:p-8">
                    {selectedPatient ? (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center"><User className="mr-3"/>Report for: {selectedPatient.patientName}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <RiskScoreDisplay score={selectedPatient.score ?? 0} />
                                <div className="text-sm bg-white/80 p-4 rounded-lg shadow-inner space-y-2">
                                    <h4 className="font-semibold mb-2 text-gray-700">Patient Data Summary</h4>
                                    <ul className="space-y-1 text-gray-600">
                                        <li><strong>BMI:</strong> {selectedPatient.bmi}</li>
                                        <li><strong>Blood Pressure:</strong> {selectedPatient.systolic}/{selectedPatient.diastolic}</li>
                                        <li><strong>Cholesterol:</strong> {selectedPatient.cholesterol} mg/dL</li>
                                        <li><strong>Glucose:</strong> {selectedPatient.glucose} mg/dL</li>
                                        <li><strong>Smoking:</strong> {selectedPatient.smoking} | <strong>Alcohol:</strong> {selectedPatient.alcohol}</li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center"><BrainCircuit className="mr-2" /> AI Suggestions</h4>
                                <div className="bg-white/80 p-4 rounded-lg shadow-inner prose prose-sm max-w-none text-gray-600 max-h-40 overflow-y-auto custom-scrollbar">
                                   <p>{selectedPatient.aiSuggestions || "No suggestions available."}</p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => handleCreateMeeting(selectedPatient)}
                                    className="w-full bg-ios-blue text-white font-bold py-4 px-6 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-ios-blue focus:ring-opacity-75 transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] active:scale-100"
                                >
                                    <Video className="mr-2 h-5 w-5" />
                                    Create Meeting Link & Notify Patient
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-400 h-full">
                            <Stethoscope size={48} className="mb-4" />
                            <h3 className="font-semibold text-lg">Select a patient to view their report</h3>
                            <p className="text-sm">Consultation requests from patients will appear in the list.</p>
                        </div>
                    )}
                </div>
            </main>
            <footer className="w-full text-center mt-8 pb-4">
                <p className="text-sm text-gray-400">&copy; 2025 Health AI</p>
            </footer>
             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 10px; }
                .prose { --tw-prose-body: #374151; --tw-prose-bold: #111827; --tw-prose-bullets: #6b7280; }
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};