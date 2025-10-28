import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { HealthData, Notification, ChatMessage } from '../types';

// This context will simulate a shared database for reports, notifications, and messages
interface DataContextType {
    reports: HealthData[];
    notifications: Notification[];
    messages: ChatMessage[];
    addReport: (report: HealthData) => void;
    updateReport: (report: HealthData) => void;
    addNotification: (notification: Notification) => void;
    markNotificationsAsRead: (userId: string) => void;
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mockInitialReport: HealthData = {
    id: 'report-01',
    userId: 'user-01',
    patientName: 'Jane Doe',
    age: '52',
    gender: 'Female',
    bmi: '29.5',
    systolic: '140',
    diastolic: '90',
    cholesterol: '250',
    glucose: '110',
    smoking: 'Yes',
    alcohol: 'No',
    activity: '2',
    familyHistory: 'Yes',
    score: 75,
    aiSuggestions: `⭐ **Personalized Health Assessment** ⭐

This is a sample AI-generated summary based on the provided data.

- **Cardiovascular Risk:** Your profile indicates several risk factors for heart disease. These include elevated blood pressure (140/90 mmHg), high cholesterol (250 mg/dL), and elevated fasting blood sugar levels.
- **Lifestyle:** Your smoking status is a major contributor to your cardiovascular risk. Your activity level is lower than recommended, and a family history of heart disease also increases your risk.

### Recommendations

#### ✅ Do's:
- **Urgent Medical Consultation:** It is highly recommended to see a doctor immediately to discuss these results.
- **Quit Smoking:** This is the most critical change. Your doctor can provide resources to help you quit.
- **Dietary Changes:** Adopt a heart-healthy diet like DASH or Mediterranean. Focus on reducing sodium, saturated fats, and sugars.
- **Increase Activity:** Gradually increase physical activity under medical supervision.

#### ❌ Don'ts:
- **Do not ignore these results.**
- **Avoid high-sodium and processed foods.**
- **Do not start a vigorous exercise program without consulting your doctor.**

---

*Disclaimer: This is an AI-generated summary and not a substitute for professional medical advice. Please consult with a healthcare provider for any health concerns.*`,
    consultationStatus: 'requested',
};

const mockInitialMessages: ChatMessage[] = [
    {
        id: 'msg-01',
        reportId: 'report-01',
        sender: { id: 'doc-01', name: 'Dr. Alan Grant', role: 'Doctor' },
        text: "Hello Jane, I've reviewed your report. The AI suggestions are a good starting point. Let's discuss your cholesterol levels and smoking.",
        timestamp: Date.now() - 180000,
    },
    {
        id: 'msg-02',
        reportId: 'report-01',
        sender: { id: 'user-01', name: 'Jane Doe', role: 'Patient' },
        text: "Hi Dr. Grant. Thanks for looking at it. I was a bit concerned about that. What do you recommend?",
        timestamp: Date.now() - 60000,
    }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reports, setReports] = useState<HealthData[]>([mockInitialReport]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>(mockInitialMessages);

    const addReport = useCallback((report: HealthData) => {
        setReports(prev => [...prev, report]);
    }, []);

    const updateReport = useCallback((updatedReport: HealthData) => {
        setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
    }, []);

    const addNotification = useCallback((notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
    }, []);

    const markNotificationsAsRead = useCallback((userId: string) => {
        setNotifications(prev => 
            prev.map(n => (n.userId === userId ? { ...n, read: true } : n))
        );
    }, []);

    const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessage: ChatMessage = {
            ...message,
            id: `msg-${Date.now()}`,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, newMessage]);
    }, []);

    return (
        <DataContext.Provider value={{ reports, notifications, messages, addReport, updateReport, addNotification, markNotificationsAsRead, addMessage }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
