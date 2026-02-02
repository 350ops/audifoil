import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '@/app/locales/en.json';
import es from '@/app/locales/es.json';

type TranslationKey = string;
type Translations = typeof en;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
  availableLanguages: { code: string; name: string; nativeName: string }[];
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages: [],
});

const translations: Record<string, Translations> = {
  en,
  es,
};

const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

const LANGUAGE_KEY = '@audifoil_language';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<string>('en');

  // Load saved language on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && translations[savedLanguage]) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  // Translation function with nested key support (e.g., "home.welcome")
  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[language] || translations.en;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    // Fallback to English if translation not found
    if (value === undefined) {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

