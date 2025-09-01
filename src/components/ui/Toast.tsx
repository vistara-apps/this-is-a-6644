import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ type, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (!duration) return;
    
    // Start the progress bar
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / duration) * 100;
      
      if (remaining <= 0) {
        clearInterval(progressInterval);
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow time for exit animation
      } else {
        setProgress(newProgress);
      }
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow time for exit animation
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" aria-hidden="true" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case 'success': return 'text-green-800';
      case 'error': return 'text-red-800';
      case 'info': return 'text-blue-800';
      case 'warning': return 'text-yellow-800';
    }
  };
  
  const getProgressColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
    }
  };
  
  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-sm w-full shadow-lg rounded-lg border overflow-hidden transition-all duration-300 ${getBgColor()} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4 pr-10">
        <div className="flex items-start">
          {getIcon()}
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
          </div>
        </div>
      </div>
      
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 w-full bg-gray-200">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 items-end">
      {children}
    </div>
  );
}

// Toast Context for global toast management
import { createContext, useContext } from 'react';

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const showToast = (type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message, duration }]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

