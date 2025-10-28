import React, { useState, useMemo, useEffect } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { GoogleGenAI } from '@google/genai';
import { User, Heart, Activity, Droplets, Thermometer, Gauge, GlassWater, Cigarette, Stethoscope, Send, MessageSquare, HeartPulse, Dna, Bot, Syringe, Smile } from 'lucide-react';
import type { HealthData, PredictionResult, Disease } from './types';
import { FormField } from './components/FormField';
import { SelectField } from './components/SelectField';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataProvider';
import { NotificationBell } from './components/NotificationBell';
import { ChatInterface } from './components/ChatInterface';
import { ThemeToggle } from './components/ThemeToggle';
import { AIChatbot } from './components/AIChatbot';

// --- New Prediction Result Display Component ---
interface PredictionResultDisplayProps {
  predictions: PredictionResult;
}

const diseaseInfo: { [key in Disease]: { icon: React.FC<any>, label: string } } = {
  "Heart Disease": { icon: Heart, label: "Heart Disease" },
  "Diabetes": { icon: Syringe, label: "Diabetes" },
  "Hypertension": { icon: Activity, label: "Hypertension" },
  "Stress": { icon: Smile, label: "Stress" },
};

const PredictionResultDisplay: React.FC<PredictionResultDisplayProps> = ({ predictions }) => {
  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-slate-100/80 dark:bg-slate-800/30 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-2xl shadow-ios-dark" role="region" aria-live="polite" aria-label="Disease Prediction Results">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Prediction Results</h3>
      <div className="space-y-3">
        {(Object.keys(predictions) as Disease[]).map((disease, index) => {
          const prediction = predictions[disease];
          const isPositive = prediction.class === 1;
          const Icon = diseaseInfo[disease].icon;

          return (
            <div
              key={disease}
              className="flex items-center justify-between p-3 bg-white/60 dark:bg-dark-card/50 rounded-lg shadow-sm animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center">
                <Icon className={`h-6 w-6 mr-3 ${isPositive ? 'text-red-500' : 'text-green-500'}`} />
                <span className="font-semibold text-gray-800 dark:text-gray-200">{diseaseInfo[disease].label}</span>
              </div>
              <div className="text-right">
                <div className={`flex items-center justify-end font-bold ${isPositive ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                  {isPositive ? 'Positive' : 'Negative'}
                  <span className="ml-1 text-xl">{isPositive ? '❌' : '✅'}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Confidence: {(prediction.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
       <p className="mt-4 text-gray-500 dark:text-gray-300 text-center text-xs max-w-xs mx-auto">
        These are AI-generated predictions based on statistical models. They are not a medical diagnosis. Please consult a healthcare professional.
      </p>
    </div>
  );
};


// --- MOCK API/ML function ---
const mockDiseasePrediction = async (payload: any): Promise<PredictionResult> => {
    console.log("Sending to prediction model:", payload);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const getPrediction = (baseConfidence: number, riskFactors: boolean[]) => {
        let confidence = baseConfidence;
        riskFactors.forEach(isRisk => {
            if (isRisk) confidence += Math.random() * 0.15;
        });
        confidence = Math.min(confidence, 0.99);
        const hasDisease = confidence > 0.5;
        return {
            class: (hasDisease ? 1 : 0) as 0 | 1,
            confidence: hasDisease ? confidence : 1 - confidence,
        };
    };

    const predictions: PredictionResult = {
        "Heart Disease": getPrediction(0.2, [
            payload.age > 50,
            payload.gender === 'Male',
            payload.bmi > 30,
            payload.systolic_bp > 140,
            payload.cholesterol > 240,
            payload.smoking === 'Yes',
            payload.family_history === 'Yes',
        ]),
        "Diabetes": getPrediction(0.15, [
            payload.age > 45,
            payload.bmi > 25,
            payload.glucose > 125,
            payload.activity < 3,
            payload.family_history === 'Yes',
        ]),
        "Hypertension": getPrediction(0.25, [
            payload.age > 55,
            payload.bmi > 28,
            payload.systolic_bp > 130 || payload.diastolic_bp > 85,
            payload.alcohol === 'Yes',
        ]),
        "Stress": getPrediction(0.3, [payload.activity < 2, Math.random() > 0.5]),
    };

    return predictions;
};


const generateAISuggestionsWithGemini = async (data: Omit<HealthData, 'id' | 'userId' | 'patientName' | 'consultationStatus' | 'score' | 'aiSuggestions' | 'predictions'>, predictions: PredictionResult): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API key is not configured.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const predictionSummary = (Object.keys(predictions) as Array<keyof PredictionResult>)
            .map(disease => {
                const p = predictions[disease];
                return `- ${disease}: ${p.class === 1 ? 'Positive' : 'Negative'} risk (Confidence: ${(p.confidence * 100).toFixed(1)}%)`;
            }).join('\n');

        const prompt = `
            You are a helpful medical assistant AI. Analyze the following patient health data and their AI-generated disease risk predictions.
            Provide a personalized health assessment based on BOTH the raw data and the prediction outcomes.
            Explain what each parameter means in simple terms where appropriate.
            Provide actionable "Do's" and "Don'ts" based on the data. Structure your response in clear, easy-to-read Markdown with sections for different health aspects.

            Patient Data:
            - Age: ${data.age}
            - Gender: ${data.gender}
            - BMI: ${data.bmi}
            - Systolic Blood Pressure: ${data.systolic} mmHg
            - Diastolic Blood Pressure: ${data.diastolic} mmHg
            - Cholesterol: ${data.cholesterol} mg/dL
            - Blood Glucose Level: ${data.glucose} mg/dL
            - Smoker: ${data.smoking}
            - Alcohol Consumption: ${data.alcohol}
            - Activity Level (days/week): ${data.activity}
            - Family History of Heart Disease: ${data.familyHistory}

            AI Prediction Results:
            ${predictionSummary}

            Provide a comprehensive summary and personalized recommendations based on the findings. Address the highest-risk areas first. End with a clear disclaimer that this is not a substitute for professional medical advice.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating AI suggestions:", error);
        return "Could not generate AI suggestions at this time. Please try again later.\n\nDisclaimer: This is an AI-generated summary and not a substitute for professional medical advice. Please consult with a healthcare provider for any health concerns.";
    }
};

export const PatientDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { addReport, updateReport, reports } = useData();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [predictions, setPredictions] = useState<PredictionResult | null>(null);

    const currentReport = useMemo(() => {
        if (!user) return null;
        const userReports = reports
            .filter(r => r.userId === user.id)
            .sort((a, b) => parseInt(b.id) - parseInt(a.id));
        return userReports[0] || null;
    }, [reports, user]);

    useEffect(() => {
      if (currentReport) {
        setPredictions(currentReport.predictions ?? null);
      }
    }, [currentReport]);

    const [isCreating, setIsCreating] = useState(() => !currentReport);

    const initialValues: Omit<HealthData, 'id' | 'userId' | 'patientName' | 'consultationStatus' | 'score' | 'aiSuggestions' | 'predictions'> = {
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
    
    const validateForm = (values: typeof initialValues) => {
        const errors: Partial<Record<keyof typeof values, string>> = {};
        
        const requiredFields: (keyof typeof values)[] = ['age', 'bmi', 'systolic', 'diastolic', 'glucose'];
        requiredFields.forEach(field => {
            if (!values[field]) {
                errors[field] = 'Required';
            }
        });

        const numericFields: (keyof typeof values)[] = ['age', 'bmi', 'systolic', 'diastolic', 'cholesterol', 'glucose', 'activity'];
        numericFields.forEach(field => {
            if (values[field]) { // Only validate if it exists
                const value = Number(values[field]);
                 if (isNaN(value) || value < 0) {
                    errors[field] = 'Must be a positive number';
                }
            }
        });

        if (!errors.age && (Number(values.age) < 1 || Number(values.age) > 120)) errors.age = 'Age: 1-120';
        if (!errors.bmi && (Number(values.bmi) < 10 || Number(values.bmi) > 60)) errors.bmi = 'BMI: 10-60';
        if (!errors.systolic && (Number(values.systolic) < 80 || Number(values.systolic) > 200)) errors.systolic = 'Sys: 80-200';
        if (!errors.diastolic && (Number(values.diastolic) < 40 || Number(values.diastolic) > 150)) errors.diastolic = 'Dia: 40-150';
        if (!errors.glucose && (Number(values.glucose) < 50 || Number(values.glucose) > 400)) errors.glucose = 'Glucose: 50-400';

        return errors;
    }

    const handleSubmit = async (values: typeof initialValues) => {
        if (!user) return;
        
        const payload = {
            age: Number(values.age),
            gender: values.gender,
            bmi: parseFloat(values.bmi),
            cholesterol: Number(values.cholesterol),
            systolic_bp: Number(values.systolic),
            diastolic_bp: Number(values.diastolic),
            glucose: Number(values.glucose),
            activity: Number(values.activity),
            smoking: values.smoking,
            alcohol: values.alcohol,
            family_history: values.familyHistory
        };

        const predictionResults = await mockDiseasePrediction(payload);
        setPredictions(predictionResults);

        const positivePredictions = Object.values(predictionResults).filter(p => p.class === 1);
        let score = 0;
        if (positivePredictions.length > 0) {
            const maxConfidence = Math.max(...positivePredictions.map(p => p.confidence));
            score = Math.round(maxConfidence * 90) + 10;
        } else {
            const negativePredictions = Object.values(predictionResults).filter(p => p.class === 0);
            const maxConfidence = Math.max(...negativePredictions.map(p => p.confidence));
            score = Math.round((1 - maxConfidence) * 40);
        }
        
        const aiSuggestions = await generateAISuggestionsWithGemini(values, predictionResults);
        
        const newReport: HealthData = {
            ...values,
            id: Date.now().toString(),
            userId: user.id,
            patientName: user.name,
            consultationStatus: 'private',
            score,
            predictions: predictionResults,
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
        setPredictions(null);
        setIsChatOpen(false);
        setIsAIChatOpen(false);
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 animate-fade-in transition-colors duration-500">
            <header className="w-full max-w-5xl mx-auto flex justify-between items-center py-4">
                 <div className="flex items-center space-x-3">
                    <HeartPulse className="text-health-buddy-blue h-8 w-8" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Health Buddy</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <NotificationBell />
                    <button onClick={logout} aria-label="Log out of your account" className="text-sm font-semibold text-health-buddy-blue hover:brightness-125 transition-all">
                        Logout
                    </button>
                </div>
            </header>
            <main className="w-full max-w-5xl mx-auto flex-grow flex items-center justify-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <section aria-labelledby="form-heading" className="bg-white/60 dark:bg-dark-card/80 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-2xl shadow-ios-dark p-6 md:p-8 transition-colors duration-500">
                        <h2 id="form-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Enter your details below 👇</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your health metrics to generate a new report.</p>
                        <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleSubmit} enableReinitialize>
                            {({ isSubmitting, dirty }) => (
                                <Form className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                         <div><FormField label="Age" name="age" type="number" placeholder="e.g., 45" icon={User} /><ErrorMessage name="age" component="div" className="text-red-500 text-xs mt-1" /></div>
                                         <SelectField label="Gender" name="gender" icon={User} options={['Male', 'Female', 'Other']} />
                                         <div><FormField label="Body Mass Index (BMI)" name="bmi" type="number" placeholder="e.g., 24.5" icon={Gauge} tooltipText="Normal range: 18.5 - 24.9" /><ErrorMessage name="bmi" component="div" className="text-red-500 text-xs mt-1" /></div>
                                         <div><FormField label="Cholesterol (mg/dL)" name="cholesterol" type="number" placeholder="e.g., 200" icon={Droplets} tooltipText="Desirable: < 200 mg/dL" /><ErrorMessage name="cholesterol" component="div" className="text-red-500 text-xs mt-1" /></div>
                                         <div><FormField label="Systolic BP" name="systolic" type="number" placeholder="e.g., 120" icon={Heart} tooltipText="Top number. Normal: < 120" /><ErrorMessage name="systolic" component="div" className="text-red-500 text-xs mt-1" /></div>
                                         <div><FormField label="Diastolic BP" name="diastolic" type="number" placeholder="e.g., 80" icon={Heart} tooltipText="Bottom number. Normal: < 80" /><ErrorMessage name="diastolic" component="div" className="text-red-500 text-xs mt-1" /></div>
                                         <div><FormField label="Glucose (mg/dL)" name="glucose" type="number" placeholder="e.g., 90" icon={Thermometer} tooltipText="Normal fasting: 70-99 mg/dL" /><ErrorMessage name="glucose" component="div" className="text-red-500 text-xs mt-1" /></div>
                                         <div><FormField label="Activity (days/wk)" name="activity" type="number" placeholder="e.g., 3" icon={Activity} /><ErrorMessage name="activity" component="div" className="text-red-500 text-xs mt-1" /></div>
                                         <SelectField label="Smoking" name="smoking" icon={Cigarette} options={['No', 'Yes']} />
                                         <SelectField label="Alcohol" name="alcohol" icon={GlassWater} options={['No', 'Yes']} />
                                         <div className="sm:col-span-2">
                                            <SelectField label="Family History of Heart Disease" name="familyHistory" icon={Dna} options={['No', 'Yes']} />
                                         </div>
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" disabled={isSubmitting || (!isCreating && !dirty)} className={`w-full bg-health-buddy-blue text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-100 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:shadow-none ${isSubmitting ? 'animate-pulse' : 'hover:animate-pulse-glow'}`}>
                                            {isSubmitting ? 'Generating Report...' : isCreating ? 'Calculate My Risk' : dirty ? 'Update Report' : 'Report Generated'}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </section>
                    <section role="region" aria-label="Assessment results and actions" aria-live="polite" className="flex flex-col items-center justify-center h-full sticky top-8">
                         {isAIChatOpen && currentReport ? (
                            <AIChatbot report={currentReport} onClose={() => setIsAIChatOpen(false)} />
                         ) : isChatOpen && currentReport ? (
                            <ChatInterface report={currentReport} onClose={() => setIsChatOpen(false)} />
                         ) : !isCreating && currentReport && predictions ? (
                             <div className="w-full text-center p-0 md:p-4 animate-fade-in">
                               <PredictionResultDisplay predictions={predictions} />
                               <div className="mt-6 w-full max-w-sm mx-auto space-y-3">
                                   <button onClick={() => setIsAIChatOpen(true)} aria-label="Ask AI assistant about your health report" className="w-full bg-health-ai text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-purple-600 hover:animate-pulse-glow transition-all duration-300 flex items-center justify-center">
                                       <Bot className="mr-2 h-4 w-4" /> Ask AI Assistant
                                   </button>
                                   {currentReport.consultationStatus === 'private' && (
                                     <button onClick={handleRequestConsultation} aria-label="Send health report to a doctor for consultation" className="w-full bg-health-positive text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-emerald-600 hover:animate-pulse-glow transition-all duration-300 flex items-center justify-center">
                                       <Send className="mr-2 h-4 w-4" /> Request Doctor Consultation
                                     </button>
                                   )}
                                   {currentReport.consultationStatus === 'requested' && (
                                     <p className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-semibold rounded-lg">
                                       Your report has been sent for review. You can chat once the doctor responds.
                                     </p>
                                   )}
                                   {currentReport.consultationStatus === 'reviewed' && (
                                     <button onClick={() => setIsChatOpen(true)} aria-label="Open chat with your doctor" className="w-full bg-health-buddy-blue text-white font-bold py-3 px-6 rounded-xl shadow-md hover:animate-pulse-glow transition-all duration-300 flex items-center justify-center">
                                       <MessageSquare className="mr-2 h-4 w-4" /> Chat with Doctor
                                     </button>
                                   )}
                                   <button onClick={startNewAssessment} aria-label="Start a new health assessment" className="w-full font-semibold text-health-buddy-blue hover:brightness-125 transition-all">
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
                    </section>
                </div>
            </main>
            <footer className="w-full text-center mt-8 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2025 Health Buddy</p>
            </footer>
        </div>
    );
};