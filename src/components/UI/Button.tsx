import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs font-medium rounded-md',
    md: 'px-3.5 py-1.5 text-sm font-medium rounded-lg',
    lg: 'px-4 py-2 text-base font-semibold rounded-lg',
  };

  const variantClasses = {
    default: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-xs',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm border border-transparent',
    outline: 'border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
    danger: 'text-rose-600 border border-rose-200 bg-rose-50/40 hover:bg-rose-100/70',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};