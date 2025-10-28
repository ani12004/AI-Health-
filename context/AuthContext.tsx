import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User, Role } from '../types';

// Mock Users
const mockUsers: User[] = [
    { id: 'user-01', name: 'Jane Doe', role: 'Patient' },
    { id: 'doc-01', name: 'Alan Grant', role: 'Doctor' },
];

interface AuthContextType {
    user: User | null;
    error: string | null;
    login: (username: string, password: string, role: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const login = (username: string, password: string, role: Role) => {
        setError(null);
        // This is a mock login. In a real app, this would be an API call.
        const expectedUsername = role.toLowerCase();
        if (username.toLowerCase() === expectedUsername && password.toLowerCase() === expectedUsername) {
            const foundUser = mockUsers.find(u => u.role === role);
            if (foundUser) {
                setUser(foundUser);
                return;
            }
        }
        setError('Invalid credentials. Please try again.');
    };

    const logout = () => {
        setUser(null);
        // In a real app with routing, you might want to redirect here.
        // For this setup, the redirect is handled in the dashboard page component.
    };

    return (
        <AuthContext.Provider value={{ user, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
