import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: { borderRadius: '12px', background: '#1E293B', color: '#fff', fontSize: '14px' },
      success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
      error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
    }}
  />
);

export default Toast;
