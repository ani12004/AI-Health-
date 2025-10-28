export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Role = 'Patient' | 'Doctor';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Prediction {
  class: 0 | 1;
  confidence: number;
}

export type Disease = "Heart Disease" | "Diabetes" | "Hypertension" | "Stress";

export type PredictionResult = {
  [key in Disease]: Prediction;
};

// FIX: Updated HealthData to match the new form fields and data model.
export interface HealthData {
  id: string;
  userId: string;
  patientName: string;

  // Form inputs from PatientDashboard
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  bmi: string;
  systolic: string;
  diastolic: string;
  cholesterol: string;
  glucose: string;
  smoking: 'Yes' | 'No';
  alcohol: 'Yes' | 'No';
  activity: string; // days/wk
  familyHistory: 'Yes' | 'No';

  // App-specific properties
  score?: number;
  predictions?: PredictionResult;
  aiSuggestions?: string;
  consultationStatus: 'private' | 'requested' | 'reviewed';
}


export interface ChatMessage {
  id: string;
  reportId: string; // Links message to a health report
  sender: User;
  text: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  timestamp: number;
}