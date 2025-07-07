import React from 'react';

const ConfirmDialog = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs mx-2 text-center border-l-8 border-rose-400">
        <p className="mb-6 text-gray-800 text-lg font-semibold">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 focus:outline-none transition"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 focus:outline-none transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 