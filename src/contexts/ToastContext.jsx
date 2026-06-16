import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => {
          let icon = <Info className="h-5 w-5 text-blue-500" />;
          let bgClass = 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700';
          
          if (t.variant === 'success') {
            icon = <CheckCircle className="h-5 w-5 text-green-500" />;
            bgClass = 'bg-white/80 dark:bg-gray-800/80 border-green-200 dark:border-green-800/30';
          } else if (t.variant === 'destructive') {
            icon = <AlertCircle className="h-5 w-5 text-red-500" />;
            bgClass = 'bg-white/80 dark:bg-gray-800/80 border-red-200 dark:border-red-800/30';
          } else if (t.variant === 'warning') {
            icon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            bgClass = 'bg-white/80 dark:bg-gray-800/80 border-yellow-200 dark:border-yellow-800/30';
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-x-0 animate-[fadeIn_0.2s_ease-out] ${bgClass}`}
            >
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
              <div className="flex-grow">
                {t.title && <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.title}</h4>}
                {t.description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t.description}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
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
