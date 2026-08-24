'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const isSinhala = language === 'si';

  const toggle = () => setLanguage(isSinhala ? 'en' : 'si');

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isSinhala ? 'Switch to English' : 'Switch to Sinhala'}
      title={isSinhala ? 'Switch to English' : 'සිංහලට මාරු වන්න'}
      className={`
        inline-flex items-center justify-center
        h-7 min-w-[2.75rem] px-2.5
        rounded-md border border-slate-300 dark:border-zinc-700
        bg-card text-[11px] font-bold tracking-wide
        text-emerald-700 dark:text-[#2CFF05] hover:border-emerald-600 dark:hover:border-[#2CFF05] hover:bg-emerald-500/10 dark:hover:bg-[#2CFF05]/10
        transition-all duration-200 cursor-pointer select-none
        shadow-sm dark:shadow-[0_0_6px_rgba(44,255,5,0.15)]
        hover:shadow-md dark:hover:shadow-[0_0_10px_rgba(44,255,5,0.35)]
        ${className}
      `}
    >
      {isSinhala ? 'සිං' : 'EN'}
    </button>
  );
}
