import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Bell, BellDot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataProvider';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { notifications, markNotificationsAsRead } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const userNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter(n => n.userId === user.id).sort((a, b) => b.timestamp - a.timestamp);
  }, [notifications, user]);

  const unreadCount = useMemo(() => {
    return userNotifications.filter(n => !n.read).length;
  }, [userNotifications]);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && unreadCount > 0 && user) {
      markNotificationsAsRead(user.id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={handleToggle} className="relative text-gray-600 dark:text-gray-300 hover:text-health-buddy-blue dark:hover:text-health-buddy-blue transition-colors">
        {unreadCount > 0 ? <BellDot size={24} className="text-red-500" /> : <Bell size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-lg shadow-ios-lg-dark border border-white/20 dark:border-white/10 z-50 animate-fade-in-fast">
          <div className="p-3 border-b border-black/10 dark:border-white/10">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {userNotifications.length > 0 ? (
              userNotifications.map(n => (
                <div key={n.id} className="p-3 border-b border-black/5 dark:border-white/5 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications.</p>
            )}
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
};