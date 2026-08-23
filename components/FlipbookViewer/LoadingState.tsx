'use client';

import React from 'react';

interface LoadingStateProps {
  progress?: number;
  message?: string;
  error?: string;
  onRetry?: () => void;
}

export default function LoadingState({ progress, message = 'Preparing pages...', error, onRetry }: LoadingStateProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-slate-950/80 rounded-2xl border border-border max-w-md mx-auto my-12 shadow-2xl backdrop-blur-md animate-fade-in">
        <div className="w-16 h-16 bg-red-950/40 border border-red-500/50 rounded-full flex items-center justify-center mb-6">
          <span className="text-red-500 text-2xl font-bold">!</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">Unable to load the catalog</h3>
        <p className="text-sm text-slate-400 mb-6">{error || 'An error occurred while loading the PDF document.'}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-[#2CFF05] hover:bg-[#2CFF05]/95 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(44,255,5,0.3)] hover:shadow-[0_0_25px_rgba(44,255,5,0.5)] active:scale-95 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 animate-fade-in">
      <div className="relative mb-8">
        {/* Glow spinner */}
        <div className="w-20 h-20 rounded-full border-2 border-slate-800 border-t-[#2CFF05] animate-spin shadow-[0_0_15px_rgba(44,255,5,0.1)]"></div>
        {/* Inner ring */}
        <div className="absolute inset-2 w-16 h-16 rounded-full border border-slate-800 border-b-[#2CFF05] animate-spin opacity-75 [animation-direction:reverse]"></div>
      </div>
      
      <h2 className="text-xl font-bold tracking-widest text-foreground uppercase mb-1">
        BITIUM TECHNOLOGY
      </h2>
      <p className="text-xs font-semibold tracking-wider text-[#2CFF05]/80 uppercase mb-4">
        Sample Collection
      </p>
      
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {message}
        </p>
        {progress !== undefined && progress > 0 && (
          <div className="w-48 bg-slate-900 border border-border h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-[#2CFF05] h-full transition-all duration-300 shadow-[0_0_8px_#2CFF05]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
