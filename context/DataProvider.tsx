import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { HealthData, Notification } from '../types';

// This context will simulate a shared database for reports and notifications
interface DataContextType {
    reports: HealthData[];
    notifications: Notification[];
    addReport: (report: HealthData) => void;
    updateReport: (report: HealthData) => void;
    addNotification: (notification: Notification) => void;
    markNotificationsAsRead: (userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reports, setReports] = useState<HealthData[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

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

    return (
        <DataContext.Provider value={{ reports, notifications, addReport, updateReport, addNotification, markNotificationsAsRead }}>
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
