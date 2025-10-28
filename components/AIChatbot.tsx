import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import type { HealthData } from '../types';

interface AIChatbotProps {
  report: HealthData;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const getAIResponse = async (report: HealthData, history: ChatMessage[], newUserMessage: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API key is not configured.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const historyText = history.map(msg => `${msg.sender === 'user' ? 'User' : 'AI Assistant'}: ${msg.text}`).join('\n');

        const prompt = `
            You are an AI Health Assistant. Your role is to answer follow-up questions about a patient's health report.
            You must base your answers STRICTLY on the health data and initial AI-generated suggestions provided below.
            DO NOT provide new medical advice, diagnoses, or any information beyond what can be inferred from the provided context.
            If a question goes beyond the scope of the report (e.g., asking for a diagnosis, medication advice), you must politely decline and advise the user to consult a human doctor.
            Keep your answers concise and easy to understand.
            Always end your response with a disclaimer: "Remember, I am an AI assistant. Please consult a healthcare professional for medical advice."

            **Patient's Original Health Data:**
            - Age: ${report.age}
            - Gender: ${report.gender}
            - BMI: ${report.bmi}
            - Systolic Blood Pressure: ${report.systolic} mmHg
            - Diastolic Blood Pressure: ${report.diastolic} mmHg
            - Cholesterol: ${report.cholesterol} mg/dL
            - Blood Glucose Level: ${report.glucose} mg/dL
            - Smoker: ${report.smoking}
            - Alcohol Consumption: ${report.alcohol}
            - Activity Level (days/week): ${report.activity}
            - Family History of Heart Disease: ${report.familyHistory}

            **Initial AI-Generated Suggestions:**
            """
            ${report.aiSuggestions}
            """

            **Conversation History:**
            ${historyText}

            **User's New Question:**
            User: ${newUserMessage}

            AI Assistant:
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error getting AI response:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again later. Remember, I am an AI assistant. Please consult a healthcare professional for medical advice.";
    }
};


export const AIChatbot: React.FC<AIChatbotProps> = ({ report, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: `Hello! I'm your AI Health Assistant. How can I help you understand your report?` }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: trimmedMessage };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setNewMessage('');
    setIsLoading(true);

    const aiResponseText = await getAIResponse(report, newHistory, trimmedMessage);

    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };
  
  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto bg-slate-100/80 dark:bg-slate-800/30 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-2xl shadow-ios-dark animate-fade-in-fast">
      <header className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
            <Bot className="text-health-ai" />
            <h3 className="font-bold text-gray-900 dark:text-white">AI Health Assistant</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10" aria-label="Close AI chat">
          <X size={20} />
        </button>
      </header>
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 animate-message-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && <div className="flex items-center justify-center h-8 w-8 rounded-full bg-health-ai/20 shrink-0"><Bot className="h-5 w-5 text-health-ai" /></div>}
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-health-buddy-blue text-white rounded-br-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.sender === 'user' && <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"><User className="h-5 w-5 text-gray-600 dark:text-gray-200" /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start animate-message-in">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-health-ai/20 shrink-0"><Bot className="h-5 w-5 text-health-ai" /></div>
              <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-lg">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-black/10 dark:border-white/10">
        <div className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question about your report..."
            className="w-full rounded-full border-transparent bg-slate-200/60 dark:bg-slate-900/40 py-3 pl-4 pr-12 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-health-buddy-blue/80 focus:shadow-glow-blue"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-12 text-health-buddy-blue hover:brightness-125 transition-transform duration-200 active:scale-90 disabled:text-gray-400 dark:disabled:text-gray-500"
            disabled={!newMessage.trim() || isLoading}
            aria-label="Send message to AI assistant"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
       <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
};