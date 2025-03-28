
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if language is stored in localStorage
    const storedLang = localStorage.getItem('language');
    return (storedLang === 'en' || storedLang === 'ru') ? storedLang : 'en';
  });
  
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Save to localStorage when language changes
    localStorage.setItem('language', language);
    
    // Load the translations
    import(`../translations/${language}.ts`)
      .then(module => {
        setTranslations(module.default);
      })
      .catch(error => {
        console.error('Failed to load translations:', error);
        setTranslations({});
      });
  }, [language]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
