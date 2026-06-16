import { createContext, useState, useEffect, useCallback } from 'react';
import { getUnreadCount, getNotifications as fetchNotifications, markAsRead as markRead, markAllAsRead as markAll } from '../api/notificationAPI';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await getUnreadCount();
      setUnreadCount(data.data.unreadCount);
    } catch { /* ignore when not authenticated */ }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchNotifications({ limit: 10 });
      console.log("Notifications API:", data);
      setNotifications(data.data.notifications);
    } catch (err) {
      console.log(err);
     }
    setLoading(false);
  }, []);

  const markAsRead = async (id) => {
    try {
      await markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const markAllAsRead = async () => {
    try {
      await markAll();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  // Poll every 30 seconds
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, parseInt(import.meta.env.VITE_POLLING_INTERVAL) || 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, loading, fetchAll, fetchUnreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
