import React, { useEffect, useState } from 'react';

const statuses = [
  { key: 'pending', label: 'Pending', color: 'text-sky-600', active: 'bg-sky-100 border-sky-500' },
  { key: 'approved', label: 'Approved', color: 'text-emerald-600', active: 'bg-emerald-100 border-emerald-500' },
  { key: 'rejected', label: 'Rejected', color: 'text-rose-600', active: 'bg-rose-100 border-rose-500' },
];

const StatusTabs = ({ current, counts, onChange }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll); 
  }, []);

  return (
    <div className={`sticky top-0 z-30 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 border-b border-gray-200 shadow-sm' : ''}`}>
      <div className={`transition-all duration-300 ${scrolled ? 'max-w-full rounded-none px-1 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-sky-600 via-blue-500 to-emerald-500 scale-95' : 'max-w-4xl mx-auto bg-gradient-to-r from-sky-500 via-blue-400 to-emerald-400 rounded-2xl px-1 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 mb-2 sm:mb-4 md:mb-6 scale-100'} w-full shadow-lg flex flex-col items-center justify-center animate-fade-in-up`}>
        <h1 className={`transition-all duration-300 font-extrabold tracking-tight drop-shadow ${scrolled ? 'text-base xs:text-lg sm:text-xl text-white mb-0' : 'text-lg xs:text-xl sm:text-2xl md:text-4xl text-white mb-1'}`}>Moderation Queue</h1>
        {!scrolled && <p className="text-white/80 text-xs sm:text-sm md:text-base font-medium mb-1 md:mb-2">Review and moderate reported posts efficiently</p>}
      </div>
      <div className={`flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 mb-4 sm:mb-6 justify-center transition-all duration-300 ${scrolled ? 'max-w-full' : 'max-w-4xl mx-auto'}`}>
        {statuses.map(s => (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className={`relative px-2 sm:px-5 py-0.5 sm:py-2 text-[11px] sm:text-sm font-semibold rounded-full border-2 focus:outline-none transition-colors duration-300
              ${current === s.key ? `${s.active} ${s.color} border-2 scale-105 shadow-lg` : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-sky-600 scale-100'}
            `}
            aria-current={current === s.key ? 'page' : undefined}
          >
            {s.label}
            {counts && counts[s.key] !== undefined && (
              <span className={`ml-2 text-xs rounded-full px-2 py-0.5 ${current === s.key ? 'bg-white text-sky-600' : 'bg-gray-100 text-gray-500'}`}>
                {counts[s.key]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusTabs;