'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isSinhala: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bitium_lang') as Language;
      if (stored === 'en' || stored === 'si') {
        setLanguageState(stored);
      }
    } catch {
      // Ignore localStorage errors in restricted environments
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('bitium_lang', lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'si' : 'en';
    setLanguage(nextLang);
  };

  const t = translations[language] || translations.en;
  const isSinhala = language === 'si';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isSinhala }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
