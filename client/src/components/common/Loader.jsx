import { Loader2 } from 'lucide-react';

export const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
    <p className="text-gray-500 text-sm">{text}</p>
  </div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl animate-pulse-soft mb-4" />
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  </div>
);

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

export default Loader;
