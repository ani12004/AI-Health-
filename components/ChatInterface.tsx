import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataProvider';
import type { HealthData, User } from '../types';

interface ChatInterfaceProps {
  report: HealthData;
  onClose: () => void;
}

const DOCTOR_USER: User = { id: 'doc-01', name: 'Dr. Alan Grant', role: 'Doctor' };
const PATIENT_USER: User = { id: 'user-01', name: 'Jane Doe', role: 'Patient' };

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ report, onClose }) => {
  const { user } = useAuth();
  const { messages, addMessage, addNotification } = useData();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = useMemo(() => {
    return messages
      .filter(m => m.reportId === report.id)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, report.id]);

  const otherParticipant = user?.role === 'Doctor' ? PATIENT_USER : DOCTOR_USER;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    addMessage({
      reportId: report.id,
      sender: user,
      text: newMessage.trim(),
    });

    addNotification({
        id: Date.now().toString(),
        userId: otherParticipant.id,
        message: `You have a new message from ${user.name}.`,
        read: false,
        timestamp: Date.now(),
    });

    setNewMessage('');
  };
  
  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto bg-slate-100/80 dark:bg-slate-800/30 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-2xl shadow-ios-dark animate-fade-in-fast">
      <header className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
        <h3 className="font-bold text-gray-900 dark:text-white">Chat with {otherParticipant.name}</h3>
        <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10">
          <X size={20} />
        </button>
      </header>
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 animate-message-in ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                  msg.sender.id === user?.id
                    ? 'bg-health-buddy-blue text-white rounded-br-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-black/10 dark:border-white/10">
        <div className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full rounded-full border-transparent bg-slate-200/60 dark:bg-slate-900/40 py-3 pl-4 pr-12 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-health-buddy-blue/80 focus:shadow-glow-blue"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-12 text-health-buddy-blue hover:brightness-125 transition-transform duration-200 active:scale-90 disabled:text-gray-400 dark:disabled:text-gray-500"
            disabled={!newMessage.trim()}
            aria-label="Send message"
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