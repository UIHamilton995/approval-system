import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export default function SuccessToast({ 
  message = "Operation completed successfully!",
  duration = 3000,
  onClose = () => {},
  show = true
}) {
  const [isVisible, setIsVisible] = useState(show);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsLeaving(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg p-4 flex items-center max-w-md">
        <div className="bg-white bg-opacity-30 rounded-full p-1 mr-3">
          <Check className="text-white" size={20} />
        </div>
        <p className="flex-1 font-medium">{message}</p>
        <button onClick={handleClose} className="ml-4 text-white hover:text-gray-200 focus:outline-none">
          <X size={20} />
        </button>
        <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-40 rounded-full" style={{
          width: '100%',
          animation: `shrink ${duration}ms linear forwards`
        }}>
          <style jsx>{`
            @keyframes shrink {
              0% { width: 100%; }
              100% { width: 0%; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}