
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-12 h-12 border-4 border-slate-500 border-t-cyan-400 rounded-full animate-spin"></div>
    </div>
  );
};
