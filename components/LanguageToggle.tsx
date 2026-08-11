'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export default function LanguageToggle({ className = '', compact = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`relative inline-flex items-center p-0.5 sm:p-1 rounded-full border border-slate-300/80 dark:border-zinc-700/80 bg-slate-200/50 dark:bg-card/70 backdrop-blur-md shadow-inner transition-all duration-300 hover:border-emerald-500/60 dark:hover:border-[#2CFF05]/50 ${className}`}
      role="group"
      aria-label="Language selection"
    >
      {/* Globe Icon */}
      <div className="pl-1.5 pr-0.5 text-slate-500 dark:text-zinc-400 hidden sm:flex items-center">
        <Globe size={13} className="text-emerald-600 dark:text-[#2CFF05]" />
      </div>

      {/* Sliding background pill */}
      <div
        className={`absolute top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 rounded-full bg-white dark:bg-[#2CFF05] shadow-sm transition-all duration-300 ease-out pointer-events-none ${
          language === 'en'
            ? 'left-1 sm:left-6 w-[34px] sm:w-[38px] shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_0_12px_rgba(44,255,5,0.4)]'
            : 'left-[36px] sm:left-[66px] w-[34px] sm:w-[38px] shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_0_12px_rgba(44,255,5,0.4)]'
        }`}
      />

      {/* EN Button */}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative z-10 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold transition-colors duration-200 cursor-pointer ${
          language === 'en'
            ? 'text-slate-900 dark:text-[#0a0a0a]'
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-pressed={language === 'en'}
        title="English"
      >
        EN
      </button>

      {/* SI Button */}
      <button
        type="button"
        onClick={() => setLanguage('si')}
        className={`relative z-10 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold transition-colors duration-200 cursor-pointer ${
          language === 'si'
            ? 'text-slate-900 dark:text-[#0a0a0a]'
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-pressed={language === 'si'}
        title="සිංහල (Sinhala)"
      >
        සිං
      </button>
    </div>
  );
}
