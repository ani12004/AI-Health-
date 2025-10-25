import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { HealthData, Notification, ChatMessage } from '../components/types';

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

// Mock Data for Demonstration
const mockInitialReport: HealthData = {
    id: 'report-01',
    userId: 'user-01',
    patientName: 'Jane Doe',
    age: '35',
    gender: 'Female',
    bmi: '22.5',
    systolic: '125',
    diastolic: '82',
    cholesterol: '210',
    glucose: '98',
    smoking: 'No',
    alcohol: 'Yes',
    activity: '2',
    familyHistory: 'No',
    score: 55,
    aiSuggestions: `Overall assessment: BMI is within a healthy range. Blood pressure is elevated. Cholesterol levels are high. Physical activity level is low. 

✅ Do's:
- Maintain your current balanced diet and regular physical activity.
- Reduce sodium intake by avoiding processed foods and not adding extra salt to meals.
- Practice stress-reducing activities like meditation, yoga, or deep breathing exercises.
- Continue monitoring your blood pressure regularly.
- Increase intake of soluble fiber from sources like oats, apples, and beans.
- Choose healthy fats, such as those found in olive oil, avocados, and fish.
- Aim for at least 150 minutes of moderate-intensity aerobic activity per week.

❌ Don'ts:
- Limit caffeine and alcohol consumption, as they can raise blood pressure.
- Avoid foods high in saturated and trans fats, like fried foods and fatty meats.
- Avoid a sedentary lifestyle; take short breaks to walk and stretch if you have a desk job.`,
    consultationStatus: 'requested',
};

const mockInitialMessages: ChatMessage[] = [
    {
        id: 'msg-01',
        reportId: 'report-01',
        sender: { id: 'doc-01', name: 'Dr. Alan Grant', role: 'Doctor' },
        text: "Hello Jane, I've reviewed your report. The AI suggestions are a good starting point. Let's discuss your cholesterol levels.",
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
