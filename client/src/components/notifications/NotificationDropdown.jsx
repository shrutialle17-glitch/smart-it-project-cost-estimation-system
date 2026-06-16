import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { timeAgo } from '../../utils/formatDate';
import { CheckCheck, FileText, Bell as BellIcon, Settings } from 'lucide-react';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, loading, fetchAll, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleClick = async (notification) => {
    if (!notification.isRead) await markAsRead(notification._id);
    if (notification.link) navigate(notification.link);
    onClose();
  };

  const icons = { new_estimation: FileText, estimation_status: CheckCheck, system: Settings, feature_update: BellIcon };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 animate-fade-in z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h4 className="font-heading font-semibold text-sm">Notifications</h4>
        <button onClick={() => { markAllAsRead(); }} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Mark all read</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No notifications yet</div>
        ) : (
          notifications.map((n) => {
            const Icon = icons[n.type] || BellIcon;
            return (
              <button key={n._id} onClick={() => handleClick(n)} className={`w-full text-left p-4 hover:bg-indigo-50/50 transition-colors border-b border-gray-50 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}>
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    <Icon className={`w-4 h-4 ${!n.isRead ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm ${!n.isRead ? 'font-semibold text-navy-800' : 'text-gray-600'}`}>{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
