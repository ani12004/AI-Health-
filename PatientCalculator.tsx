import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { User, Heart, Activity, Droplets, Thermometer, Gauge, Dna, GlassWater, Cigarette, Stethoscope, Send } from 'lucide-react';
import type { HealthData } from './types';
import { FormField } from './components/FormField';
import { SelectField } from './components/SelectField';
import { RiskScoreDisplay } from './components/RiskScoreDisplay';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataProvider';
import { NotificationBell } from './components/NotificationBell';

// Renamed from PatientCalculator
export const PatientDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { addReport, updateReport } = useData();
    const [currentReport, setCurrentReport] = useState<HealthData | null>(null);

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
        
        // Simulating score and AI suggestions
        const score = Math.floor(Math.random() * 100) + 1;
        const aiSuggestions = "Based on your data, we recommend increasing physical activity and consulting a nutritionist. Regular check-ups are advised.";
        
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
        setCurrentReport(newReport);
    };
    
    const handleRequestConsultation = () => {
        if (!currentReport) return;
        const updatedReport = { ...currentReport, consultationStatus: 'requested' as const };
        updateReport(updatedReport);
        setCurrentReport(updatedReport);
    }

    const startNewAssessment = () => {
        setCurrentReport(null);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans text-gray-800 flex flex-col items-center p-4">
            <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4">
                 <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <NotificationBell />
                    <button onClick={logout} className="text-sm font-semibold text-ios-blue hover:text-blue-700 transition-colors">
                        Logout
                    </button>
                </div>
            </header>
            <main className="w-full max-w-4xl mx-auto flex-grow flex items-center justify-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="bg-gray-100 rounded-2xl shadow-neumorphic p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Health Details</h2>
                        <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleSubmit} enableReinitialize>
                            {({ isSubmitting, resetForm }) => (
                                <Form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                         <div><FormField label="Age" name="age" type="number" placeholder="e.g., 45" icon={User} /><ErrorMessage name="age" component="div" className="text-red-500 text-sm mt-1" /></div>
                                         <SelectField label="Gender" name="gender" options={['Male', 'Female', 'Other']} icon={User} />
                                         <div><FormField label="Body Mass Index (BMI)" name="bmi" type="number" placeholder="e.g., 24.5" icon={Gauge} tooltipText="Normal range: 18.5 - 24.9" /><ErrorMessage name="bmi" component="div" className="text-red-500 text-sm mt-1" /></div>
                                         <div><FormField label="Cholesterol (mg/dL)" name="cholesterol" type="number" placeholder="e.g., 200" icon={Droplets} tooltipText="Desirable: < 200 mg/dL" /><ErrorMessage name="cholesterol" component="div" className="text-red-500 text-sm mt-1" /></div>
                                         <div><FormField label="Systolic BP" name="systolic" type="number" placeholder="e.g., 120" icon={Heart} tooltipText="Top number. Normal: < 120" /><ErrorMessage name="systolic" component="div" className="text-red-500 text-sm mt-1" /></div>
                                         <div><FormField label="Diastolic BP" name="diastolic" type="number" placeholder="e.g., 80" icon={Heart} tooltipText="Bottom number. Normal: < 80" /><ErrorMessage name="diastolic" component="div" className="text-red-500 text-sm mt-1" /></div>
                                         <div><FormField label="Glucose (mg/dL)" name="glucose" type="number" placeholder="e.g., 90" icon={Thermometer} tooltipText="Normal fasting: 70-99 mg/dL" /><ErrorMessage name="glucose" component="div" className="text-red-500 text-sm mt-1" /></div>
                                         <div><FormField label="Activity (days/wk)" name="activity" type="number" placeholder="e.g., 3" icon={Activity} /><ErrorMessage name="activity" component="div" className="text-red-500 text-sm mt-1" /></div>
                                         <SelectField label="Smoking" name="smoking" options={['No', 'Yes']} icon={Cigarette} />
                                         <SelectField label="Alcohol" name="alcohol" options={['No', 'Yes']} icon={GlassWater} />
                                         <div className="md:col-span-2"><SelectField label="Family History of Heart Disease" name="familyHistory" options={['No', 'Yes']} icon={Dna} /></div>
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" disabled={isSubmitting || !!currentReport} className="w-full bg-ios-blue text-white font-bold py-4 px-6 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-ios-blue focus:ring-opacity-75 transition-all duration-300 transform hover:scale-[1.02] active:scale-100 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            {currentReport ? 'Report Generated' : 'Calculate My Risk'}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full p-8">
                        {currentReport?.score !== undefined ? (
                             <div className="w-full text-center">
                               <RiskScoreDisplay score={currentReport.score} />
                               <div className="mt-6 w-full max-w-sm mx-auto space-y-3">
                                   {currentReport.consultationStatus === 'private' && (
                                     <button onClick={handleRequestConsultation} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-green-600 transition-all duration-300 flex items-center justify-center">
                                       <Send className="mr-2 h-4 w-4" /> Request Doctor Consultation
                                     </button>
                                   )}
                                   {currentReport.consultationStatus === 'requested' && (
                                     <p className="p-3 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
                                       Your report has been sent to the doctor for review.
                                     </p>
                                   )}
                                   <button onClick={startNewAssessment} className="w-full font-semibold text-ios-blue hover:text-blue-700 transition-colors">
                                       Start New Assessment
                                   </button>
                               </div>
                             </div>
                        ) : (
                            <div className="text-center text-gray-400">
                                <Stethoscope size={48} className="mb-4 mx-auto" />
                                <h3 className="font-semibold text-lg">Your results will appear here</h3>
                                <p className="text-sm">Fill out the form to see your health risk score.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="w-full text-center mt-8 pb-4">
                <p className="text-sm text-gray-400">&copy; 2025 Health AI</p>
            </footer>
        </div>
    );
};