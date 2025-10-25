import React, { useState, useMemo } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { User, Heart, Activity, Droplets, Thermometer, Gauge, Dna, GlassWater, Cigarette, Stethoscope, Send, MessageSquare, HeartPulse } from 'lucide-react';
import type { HealthData } from './types';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { RiskScoreDisplay } from './RiskScoreDisplay';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataProvider';
import { NotificationBell } from './NotificationBell';
import { ChatInterface } from './ChatInterface';
import { ThemeToggle } from './ThemeToggle';
import Head from 'next/head';

const generateDetailedAISuggestions = (data: Omit<HealthData, 'id' | 'userId' | 'patientName' | 'consultationStatus'>): string => {
    let assessment = "Overall assessment: ";
    const dos: string[] = [];
    const donts: string[] = [];

    const bmi = parseFloat(data.bmi);
    if (bmi > 25) {
        assessment += "BMI is higher than the recommended range. ";
        dos.push("Incorporate regular exercise like brisk walking or cycling for at least 30 minutes, 3-5 times a week.");
        dos.push("Focus on a balanced diet with more vegetables, lean proteins, and whole grains.");
        donts.push("Avoid sugary drinks and processed foods high in unhealthy fats and empty calories.");
    } else if (bmi < 18.5) {
        assessment += "BMI is lower than the recommended range. ";
        dos.push("Consider consulting a nutritionist to ensure you're getting enough nutrients.");
        dos.push("Incorporate nutrient-dense foods like avocados, nuts, and whole grains.");
        donts.push("Avoid skipping meals; aim for regular, balanced meals throughout the day.");
    } else {
        assessment += "BMI is within a healthy range. ";
        dos.push("Maintain your current balanced diet and regular physical activity.");
    }

    const systolic = parseInt(data.systolic);
    const diastolic = parseInt(data.diastolic);
    if (systolic > 130 || diastolic > 85) {
        assessment += "Blood pressure is elevated. ";
        dos.push("Reduce sodium intake by avoiding processed foods and not adding extra salt to meals.");
        dos.push("Practice stress-reducing activities like meditation, yoga, or deep breathing exercises.");
        donts.push("Limit caffeine and alcohol consumption, as they can raise blood pressure.");
    } else {
        dos.push("Continue monitoring your blood pressure regularly.");
    }
    
    const cholesterol = parseInt(data.cholesterol);
    if (cholesterol > 200) {
        assessment += "Cholesterol levels are high. ";
        dos.push("Increase intake of soluble fiber from sources like oats, apples, and beans.");
        dos.push("Choose healthy fats, such as those found in olive oil, avocados, and fish.");
        donts.push("Avoid foods high in saturated and trans fats, like fried foods and fatty meats.");
    }
    
    if (data.smoking === 'Yes') {
        assessment += "Smoking is a major risk factor. ";
        dos.push("Seek support for smoking cessation, such as counseling or nicotine replacement therapy.");
        donts.push("Avoid situations that trigger the urge to smoke.");
    }

    if (parseInt(data.activity) < 3) {
        assessment += "Physical activity level is low. ";
        dos.push("Aim for at least 150 minutes of moderate-intensity aerobic activity per week.");
        donts.push("Avoid a sedentary lifestyle; take short breaks to walk and stretch if you have a desk job.");
    }

    // Filter out duplicate recommendations
    const uniqueDos = [...new Set(dos)];
    const uniqueDonts = [...new Set(donts)];

    return `${assessment.trim()}\n\n✅ Do's:\n- ${uniqueDos.join('\n- ')}\n\n❌ Don'ts:\n- ${uniqueDonts.join('\n- ')}`;
};

export const PatientDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { addReport, updateReport, reports } = useData();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const currentReport = useMemo(() => {
        if (!user) return null;
        const userReports = reports
            .filter(r => r.userId === user.id)
            .sort((a, b) => parseInt(b.id) - parseInt(a.id));
        return userReports[0] || null;
    }, [reports, user]);

    const [isCreating, setIsCreating] = useState(() => !currentReport);

    const initialValues: Omit<HealthData, 'id' | 'userId' | 'patientName' | 'consultationStatus' | 'score' | 'aiSuggestions'> = {
        age: '',
        gender: 'Male',
        bmi: '',
        systolic: '',
        diastolic: '',
        cholesterol: '',
        glucose: '',
        smoking: 'No',
        alcohol: 'No',
        activity: '',
        familyHistory: 'No',
    };
    
    const validateForm = (values: Omit<HealthData, 'id' | 'userId' | 'patientName' | 'consultationStatus'>) => {
        const errors: Partial<Record<keyof typeof values, string>> = {};

        const numericFields: (keyof typeof values)[] = ['age', 'bmi', 'systolic', 'diastolic', 'cholesterol', 'glucose', 'activity'];
        numericFields.forEach(field => {
            const value = Number(values[field]);
            if (!values[field]) {
                errors[field] = 'Required';
            } else if (isNaN(value) || value < 0) {
                errors[field] = 'Must be a positive number';
            }
        });

        if (!errors.age && (Number(values.age) < 1 || Number(values.age) > 120)) errors.age = 'Age: 1-120';
        if (!errors.bmi && (Number(values.bmi) < 10 || Number(values.bmi) > 50)) errors.bmi = 'BMI: 10-50';
        if (!errors.systolic && (Number(values.systolic) < 70 || Number(values.systolic) > 250)) errors.systolic = 'Sys: 70-250';
        if (!errors.diastolic && (Number(values.diastolic) < 40 || Number(values.diastolic) > 150)) errors.diastolic = 'Dia: 40-150';

        return errors;
    }

    const handleSubmit = async (values: Omit<HealthData, 'id' | 'userId' | 'patientName' | 'consultationStatus'>) => {
        if (!user) return;
        
        const score = Math.floor(Math.random() * 100) + 1;
        const aiSuggestions = generateDetailedAISuggestions(values);
        
        const newReport: HealthData = {
            ...values,
            id: Date.now().toString(),
            userId: user.id,
            patientName: user.name,
            consultationStatus: 'private',
            score,
            aiSuggestions
        };

        addReport(newReport);
        setIsCreating(false);
    };
    
    const handleRequestConsultation = () => {
        if (!currentReport) return;
        const updatedReport = { ...currentReport, consultationStatus: 'requested' as const };
        updateReport(updatedReport);
    }

    const startNewAssessment = () => {
        setIsCreating(true);
        setIsChatOpen(false);
    }

    return (
        <>
            <Head>
                <title>Patient Dashboard | Health Buddy</title>
            </Head>
            <div className="min-h-screen flex flex-col items-center p-4 animate-fade-in">
                <header className="w-full max-w-5xl mx-auto flex justify-between items-center py-4">
                     <div className="flex items-center space-x-3">
                        <HeartPulse className="text-health-buddy-blue h-8 w-8" />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Health Buddy</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <NotificationBell />
                        <button onClick={logout} className="text-sm font-semibold text-health-buddy-blue hover:brightness-125 transition-all">
                            Logout
                        </button>
                    </div>
                </header>
                <main className="w-full max-w-5xl mx-auto flex-grow flex items-center justify-center">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-ios-dark p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Health Details</h2>
                            <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleSubmit} enableReinitialize>
                                {({ isSubmitting }) => (
                                    <Form className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                             <div><FormField label="Age" name="age" type="number" placeholder="e.g., 45" icon={User} /><ErrorMessage name="age" component="div" className="text-red-500 text-xs mt-1" /></div>
                                             <SelectField label="Gender" name="gender" options={['Male', 'Female', 'Other']} icon={User} />
                                             <div><FormField label="Body Mass Index (BMI)" name="bmi" type="number" placeholder="e.g., 24.5" icon={Gauge} tooltipText="Normal range: 18.5 - 24.9" /><ErrorMessage name="bmi" component="div" className="text-red-500 text-xs mt-1" /></div>
                                             <div><FormField label="Cholesterol (mg/dL)" name="cholesterol" type="number" placeholder="e.g., 200" icon={Droplets} tooltipText="Desirable: < 200 mg/dL" /><ErrorMessage name="cholesterol" component="div" className="text-red-500 text-xs mt-1" /></div>
                                             <div><FormField label="Systolic BP" name="systolic" type="number" placeholder="e.g., 120" icon={Heart} tooltipText="Top number. Normal: < 120" /><ErrorMessage name="systolic" component="div" className="text-red-500 text-xs mt-1" /></div>
                                             <div><FormField label="Diastolic BP" name="diastolic" type="number" placeholder="e.g., 80" icon={Heart} tooltipText="Bottom number. Normal: < 80" /><ErrorMessage name="diastolic" component="div" className="text-red-500 text-xs mt-1" /></div>
                                             <div><FormField label="Glucose (mg/dL)" name="glucose" type="number" placeholder="e.g., 90" icon={Thermometer} tooltipText="Normal fasting: 70-99 mg/dL" /><ErrorMessage name="glucose" component="div" className="text-red-500 text-xs mt-1" /></div>
                                             <div><FormField label="Activity (days/wk)" name="activity" type="number" placeholder="e.g., 3" icon={Activity} /><ErrorMessage name="activity" component="div" className="text-red-500 text-xs mt-1" /></div>
                                             <SelectField label="Smoking" name="smoking" options={['No', 'Yes']} icon={Cigarette} />
                                             <SelectField label="Alcohol" name="alcohol" options={['No', 'Yes']} icon={GlassWater} />
                                             <div className="md:col-span-2"><SelectField label="Family History of Heart Disease" name="familyHistory" options={['No', 'Yes']} icon={Dna} /></div>
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" disabled={isSubmitting || !isCreating} className="w-full bg-health-buddy-blue text-white font-bold py-3 px-6 rounded-xl shadow-md hover:animate-pulse-glow transition-all duration-300 transform hover:scale-[1.02] active:scale-100 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:animate-none">
                                                {isCreating ? 'Calculate My Risk' : 'Report Generated'}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="flex flex-col items-center justify-center h-full">
                             {isChatOpen && currentReport ? (
                                <ChatInterface report={currentReport} onClose={() => setIsChatOpen(false)} />
                             ) : !isCreating && currentReport ? (
                                 <div className="w-full text-center p-8 animate-fade-in">
                                   <RiskScoreDisplay score={currentReport.score ?? 0} />
                                   <div className="mt-6 w-full max-w-sm mx-auto space-y-3">
                                       {currentReport.consultationStatus === 'private' && (
                                         <button onClick={handleRequestConsultation} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-green-600 hover:animate-pulse-glow transition-all duration-300 flex items-center justify-center">
                                           <Send className="mr-2 h-4 w-4" /> Request Doctor Consultation
                                         </button>
                                       )}
                                       {currentReport.consultationStatus === 'requested' && (
                                         <p className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-semibold rounded-lg">
                                           Your report has been sent for review. You can chat once the doctor responds.
                                         </p>
                                       )}
                                       {currentReport.consultationStatus === 'reviewed' && (
                                         <button onClick={() => setIsChatOpen(true)} className="w-full bg-health-buddy-blue text-white font-bold py-3 px-6 rounded-xl shadow-md hover:animate-pulse-glow transition-all duration-300 flex items-center justify-center">
                                           <MessageSquare className="mr-2 h-4 w-4" /> Chat with Doctor
                                         </button>
                                       )}
                                       <button onClick={startNewAssessment} className="w-full font-semibold text-health-buddy-blue hover:brightness-125 transition-all">
                                           Start New Assessment
                                       </button>
                                   </div>
                                 </div>
                            ) : (
                                <div className="text-center text-gray-400 dark:text-gray-500 p-8">
                                    <Stethoscope size={48} className="mb-4 mx-auto" />
                                    <h3 className="font-semibold text-lg">Your results will appear here</h3>
                                    <p className="text-sm">Fill out the form to see your health risk score.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <footer className="w-full text-center mt-8 pb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-500">&copy; 2025 Health Buddy</p>
                </footer>
            </div>
        </>
    );
};
