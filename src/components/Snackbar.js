import React, { useEffect } from 'react';

const Snackbar = ({ open, message, onClose, variant = 'info', onUndo }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  let bg = 'bg-sky-600';
  let icon = (
    <svg className="w-6 h-6 text-sky-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
    </svg>
  );
  if (variant === 'success') {
    bg = 'bg-emerald-600';
    icon = (
      <svg className="w-6 h-6 text-emerald-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  } else if (variant === 'error') {
    bg = 'bg-rose-600';
    icon = (
      <svg className="w-6 h-6 text-rose-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 ${bg} text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in transition-all duration-500 font-semibold text-base`}>
      {icon}
      <span>{message}</span>
      {onUndo && (
        <button
          onClick={onUndo}
          className="ml-4 px-4 py-1 rounded-full bg-white/90 text-sky-600 font-bold shadow hover:bg-sky-100 transition border border-sky-200"
        >
          Undo
        </button>
      )}
    </div>
  );
};

export default Snackbar; 