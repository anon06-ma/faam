import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from './types';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });
  const [dynamicContent, setDynamicContent] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setDynamicContent(data))
      .catch(err => console.error("Failed to fetch content:", err));
  }, []);

  const t = {
    ...translations[language],
    ...(dynamicContent ? {
      hero: {
        ...translations[language].hero,
        title: dynamicContent.hero[language].title,
        subtitle: dynamicContent.hero[language].subtitle
      },
      aboutText: dynamicContent.about[language]
    } : {})
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
