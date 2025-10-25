export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Role = 'Patient' | 'Doctor';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface HealthData {
  id: string;
  userId: string;
  patientName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  bmi: string;
  systolic: string;
  diastolic: string;
  cholesterol: string;
  glucose: string;
  smoking: 'No' | 'Yes';
  alcohol: 'No' | 'Yes';
  activity: string;
  familyHistory: 'No' | 'Yes';
  // New properties for consultation flow
  score?: number;
  aiSuggestions?: string;
  consultationStatus: 'private' | 'requested' | 'reviewed';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  link?: string;
  read: boolean;
  timestamp: number;
}