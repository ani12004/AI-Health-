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
    
    const suggestionsByCategory: { [key: string]: string[] } = {};

    const addSuggestion = (category: string, suggestion: string) => {
        if (!suggestionsByCategory[category]) {
            suggestionsByCategory[category] = [];
        }
        suggestionsByCategory[category].push(suggestion);
    };

    // 1. BMI Assessment 🏋️
    const bmi = parseFloat(data.bmi);
    if (bmi >= 25) {
        addSuggestion(
            'Body Mass Index (BMI) 🏋️',
            `Your BMI of ${data.bmi} is in the overweight/obese range. A healthy BMI is typically between 18.5 and 24.9. Focusing on gradual, sustainable changes is key.`
        );
        addSuggestion(
            'Diet 🥗',
            'Adopt the "plate method": Fill half your plate with non-starchy vegetables (like broccoli, spinach, peppers), a quarter with lean protein (chicken, fish, tofu), and a quarter with complex carbs (quinoa, sweet potatoes).'
        );
        addSuggestion(
            'Exercise 🏃‍♀️',
            'Target 150 minutes of moderate-intensity cardio weekly (e.g., 30 minutes/day, 5 days/week of brisk walking, swimming, or cycling) plus two days of strength training (weights, bodyweight exercises).'
        );
        addSuggestion(
            'Lifestyle Habits 💡',
            'Practice mindful eating: pay attention to hunger cues and eat slowly. Using smaller plates can also help manage portion sizes effectively.'
        );
    } else if (bmi < 18.5) {
        addSuggestion(
            'Body Mass Index (BMI) 🏋️',
            `Your BMI of ${data.bmi} is in the underweight range. Ensuring adequate nutrition is important for energy and overall health.`
        );
        addSuggestion(
            'Diet 🥗',
            'Focus on nutrient-dense foods. Add healthy fats like avocado, nuts, and seeds to meals. Consider nutrient-rich smoothies with protein powder, fruit, and spinach.'
        );
        addSuggestion(
            'Lifestyle Habits 💡',
            'Eat smaller, more frequent meals (5-6 per day) if you feel full quickly. Consulting a registered dietitian can provide a personalized plan.'
        );
    } else {
        addSuggestion(
            'Body Mass Index (BMI) 🏋️',
            `Your BMI of ${data.bmi} is in a healthy range. Excellent! Maintain your current habits and explore new healthy recipes or activities to stay motivated.`
        );
    }

    // 2. Blood Pressure Assessment 🩺
    const systolic = parseInt(data.systolic);
    const diastolic = parseInt(data.diastolic);
    if (systolic >= 130 || diastolic >= 80) {
        addSuggestion(
            'Blood Pressure 🩺',
            `Your reading of ${data.systolic}/${data.diastolic} mmHg is elevated. High blood pressure increases the risk of heart disease and stroke.`
        );
        addSuggestion(
            'Diet 🥗',
            'Significantly reduce sodium intake by avoiding processed foods and canned soups. Aim for less than 2,300 mg per day. The DASH diet is a proven approach.'
        );
        addSuggestion(
            'Lifestyle Habits 💡',
            'Limit alcohol to no more than 1 drink/day for women, 2 for men. Practice daily stress management for 10-15 minutes (meditation, deep breathing, journaling).'
        );
    } else {
        addSuggestion(
            'Blood Pressure 🩺',
            'Your blood pressure is in a healthy range. Keep up the great work!'
        );
    }
    
    // 3. Cholesterol Assessment 🩸
    const cholesterol = parseInt(data.cholesterol);
    if (cholesterol > 200) {
        addSuggestion(
            'Cholesterol 🩸',
            `Your total cholesterol of ${data.cholesterol} mg/dL is high. It's important to manage this to protect your arteries.`
        );
        addSuggestion(
            'Diet 🥗',
            'Increase soluble fiber (oats, beans, apples) and replace saturated/trans fats with unsaturated fats. Add sources of Omega-3s like salmon or walnuts to your diet twice a week.'
        );
    } else {
        addSuggestion('Cholesterol 🩸', 'Your cholesterol level is within a healthy range.');
    }

    // 4. Glucose Assessment 🍬
    const glucose = parseInt(data.glucose);
    if (glucose >= 100) {
        addSuggestion(
            'Blood Sugar (Glucose) 🍬',
            `Your fasting glucose of ${data.glucose} mg/dL is elevated, suggesting pre-diabetes risk. Prompt lifestyle changes can significantly reduce the risk of developing type 2 diabetes.`
        );
        addSuggestion(
            'Diet 🥗',
            'Minimize sugary drinks and refined carbs (white bread, pasta). Prioritize non-starchy vegetables, lean proteins, and whole grains to stabilize blood sugar.'
        );
         addSuggestion(
            'Exercise 🏃‍♀️',
            'Regular exercise improves insulin sensitivity. Even a 10-15 minute walk after meals can help manage blood sugar levels.'
        );
    } else {
        addSuggestion('Blood Sugar (Glucose) 🍬', 'Your glucose level is in a healthy range.');
    }
    
    // 5. Lifestyle Factors
    if (data.smoking === 'Yes') {
        addSuggestion(
            'Lifestyle Habits 💡',
            'Quitting smoking is the single most effective action you can take to improve your health. Speak with your doctor about support resources like counseling and nicotine replacement therapy.'
        );
    }
    
    if (data.alcohol === 'Yes' && (systolic < 130 && diastolic < 80)) {
        addSuggestion('Lifestyle Habits 💡', 'If you consume alcohol, do so in moderation (up to 1 drink/day for women, 2 for men) to minimize health risks.');
    }

    if (parseInt(data.activity) < 3) {
        addSuggestion(
            'Exercise 🏃‍♀️',
            `An activity level of ${data.activity} days/week is below recommendations. Find an enjoyable activity to build consistency. Start small, e.g., a 15-minute daily walk, and gradually increase.`
        );
    }

    if (data.familyHistory === 'Yes') {
         addSuggestion(
            'General Health ⚕️',
            'Your family history increases your predisposition to certain conditions. Regular health screenings and a proactive approach to lifestyle are particularly important for you.'
        );
    }

    // 6. General Preventative Measures
    addSuggestion(
        'Preventative Care 🛡️',
        'Hydration Goal: Aim to drink around 8 glasses (2 liters) of water daily. Proper hydration is crucial for energy, organ function, and skin health.'
    );
    addSuggestion(
        'Preventative Care 🛡️',
        'Sleep Hygiene: Target 7-9 hours of quality sleep per night. Create a relaxing bedtime routine and maintain a consistent sleep/wake schedule.'
    );
     addSuggestion(
        'Preventative Care 🛡️',
        'Mental Wellness: Dedicate time to activities that reduce stress and bring you joy, such as hobbies, mindfulness, or spending time in nature.'
    );
    addSuggestion(
        'Preventative Care 🛡️',
        'Regular Check-ups: Schedule annual physicals and recommended screenings with your doctor to monitor your health and catch potential issues early.'
    );


    // Format the final output string
    let finalSuggestions = "⭐ Personalized Health Assessment ⭐\n\n";

    const categoryOrder = [
        'Body Mass Index (BMI) 🏋️',
        'Blood Pressure 🩺',
        'Cholesterol 🩸',
        'Blood Sugar (Glucose) 🍬',
        'Diet 🥗',
        'Exercise 🏃‍♀️',
        'Lifestyle Habits 💡',
        'General Health ⚕️',
        'Preventative Care 🛡️',
    ];

    for (const category of categoryOrder) {
        if (suggestionsByCategory[category]) {
            const uniqueSuggestions = [...new Set(suggestionsByCategory[category])];
            finalSuggestions += `${category}\n`;
            uniqueSuggestions.forEach(suggestion => {
                finalSuggestions += `• ${suggestion}\n`;
            });
            finalSuggestions += '\n';
        }
    }
    
    finalSuggestions += "Disclaimer: This is an AI-generated summary and not a substitute for professional medical advice. Please consult with a healthcare provider for any health concerns.";

    return finalSuggestions.trim();
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