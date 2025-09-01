import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80 focus:ring-primary';
      case 'secondary':
        return 'bg-surface border border-gray-300 text-text-primary hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-400';
      case 'outline':
        return 'bg-transparent border border-primary text-primary hover:bg-primary/5 focus:ring-primary';
      case 'ghost':
        return 'bg-transparent text-text-primary hover:bg-gray-100 focus:ring-gray-400';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500';
      default:
        return 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80 focus:ring-primary';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-3 py-1.5 rounded';
      case 'md':
        return 'text-sm px-4 py-2 rounded-md';
      case 'lg':
        return 'text-base px-6 py-3 rounded-md';
      default:
        return 'text-sm px-4 py-2 rounded-md';
    }
  };
  
  const baseClasses = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${widthClass} ${className} inline-flex items-center justify-center`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}

// IconButton component for icon-only buttons
interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}: IconButtonProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1 rounded';
      case 'md':
        return 'p-2 rounded-md';
      case 'lg':
        return 'p-3 rounded-md';
      default:
        return 'p-2 rounded-md';
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      isLoading={isLoading}
      className={`${getSizeClasses()} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
}

