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
    return notifications.filter(n => n.userId === user?.id).sort((a, b) => b.timestamp - a.timestamp);
  }, [notifications, user]);

  const unreadCount = useMemo(() => {
    return userNotifications.filter(n => !n.read).length;
  }, [userNotifications]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0 && user) {
      // Mark as read when opening
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
      <button onClick={handleToggle} className="relative text-gray-600 hover:text-ios-blue transition-colors">
        {unreadCount > 0 ? <BellDot size={24} className="text-red-500" /> : <Bell size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-ios-lg border border-gray-200 z-50 animate-fade-in-fast">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {userNotifications.length > 0 ? (
              userNotifications.map(n => (
                <div key={n.id} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  <p className="text-sm text-gray-700">{n.message}</p>
                  {n.link && (
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="text-xs text-ios-blue font-semibold hover:underline mt-1 block">
                      View Meeting
                    </a>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-center text-gray-500">No new notifications.</p>
            )}
          </div>
        </div>
      )}
      <style>{`
        .animate-fade-in-fast { animation: fadeInFast 0.2s ease-out forwards; }
        @keyframes fadeInFast { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
      `}</style>
    </div>
  );
};
