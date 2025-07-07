import React from 'react';

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-sky-300">
    <svg className="w-14 h-14 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 00-4-4H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-4a4 4 0 00-4 4z" />
    </svg>
    <span className="text-xl font-semibold">{message || 'No data available.'}</span>
  </div>
);

export default EmptyState; 