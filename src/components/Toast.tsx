import React from 'react';

export const Toast: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white font-bold px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
      <span className="text-xl">🔔</span>
      <span className="text-sm">{message}</span>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Đang tải dữ liệu Supabase...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-600 font-bold">
      <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm">{label}</p>
    </div>
  );
};
