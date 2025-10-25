import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataProvider';
import type { HealthData, User } from './types';

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
        timestamp: Date.now()
    });

    setNewMessage('');
  };
  
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col h-full bg-black/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-inner w-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-black/10 dark:border-white/10 flex-shrink-0">
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Chat with {otherParticipant.name}</h3>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {chatMessages.map(msg => {
          const isSentByMe = msg.sender.id === user?.id;
          // Animate messages that are less than 2 seconds old to make new messages pop
          const isRecent = (Date.now() - msg.timestamp) < 2000;
          return (
            <div key={msg.id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} ${isRecent ? 'animate-message-in' : ''}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${isSentByMe ? 'bg-health-buddy-blue text-white' : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 text-right ${isSentByMe ? 'text-blue-100/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-start space-x-2">
          <textarea
            value={newMessage}
            onChange={handleTextareaInput}
            placeholder="Type your message..."
            className="flex-grow bg-black/10 dark:bg-white/10 rounded-lg p-2.5 text-sm text-gray-800 dark:text-gray-200 border-transparent focus:ring-2 focus:ring-health-buddy-blue/80 focus:shadow-glow-blue resize-none transition-all"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button type="submit" className="bg-health-buddy-blue text-white rounded-lg p-2.5 h-full flex items-center justify-center shadow-md hover:shadow-glow-blue transition-all transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-health-buddy-blue focus:ring-opacity-75 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:hover:shadow-none" disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
