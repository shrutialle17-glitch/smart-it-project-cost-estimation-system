import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Button = ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    ghost: 'inline-flex items-center justify-center text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200',
  };
  const sizes = { sm: '!px-4 !py-2 !text-xs', md: '', lg: '!px-8 !py-4 !text-base' };

  return (
    <button className={clsx(variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
};

export default Button;
