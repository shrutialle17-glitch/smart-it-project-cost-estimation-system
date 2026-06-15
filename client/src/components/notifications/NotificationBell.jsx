import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
};

export default NotificationBell;
