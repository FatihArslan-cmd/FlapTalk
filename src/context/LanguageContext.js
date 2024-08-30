import React, { useState, createContext, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translation files
import en from '../../assets/lang/en.json';
import tr from '../../assets/lang/tr.json';
import ar from '../../assets/lang/ar.json';
import de from '../../assets/lang/de.json';
import el from '../../assets/lang/el.json';
import es from '../../assets/lang/es.json';
import fr from '../../assets/lang/fr.json';
import ru from '../../assets/lang/ru.json';
import zh from '../../assets/lang/zh.json';

const SUPPORTED_LANGUAGES = ['en', 'tr', 'ar', 'de', 'el', 'es', 'fr', 'ru', 'zh'];
const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'selectedLanguage';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: { en, tr, ar, de, el, es, fr, ru, zh },
  fallbackLng: DEFAULT_LANGUAGE,
  debug: __DEV__,
  interpolation: { escapeValue: false }
});

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language);

  const changeLanguage = useCallback(async (lang) => {
    if (lang === currentLanguage) return;
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      await i18next.changeLanguage(lang);
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Error setting selected language:', error);
    }
  }, [currentLanguage]);

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        
        if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
          await i18next.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage);
          return;
        }

        const deviceLanguage = Localization.locale.split('-')[0];
        const newLanguage = SUPPORTED_LANGUAGES.includes(deviceLanguage) ? deviceLanguage : DEFAULT_LANGUAGE;

        await AsyncStorage.setItem(STORAGE_KEY, newLanguage);
        await i18next.changeLanguage(newLanguage);
        setCurrentLanguage(newLanguage);
      } catch (error) {
        console.error('Error initializing language:', error);
        setCurrentLanguage(DEFAULT_LANGUAGE);
        i18next.changeLanguage(DEFAULT_LANGUAGE);
      }
    };

    initializeLanguage();
  }, []);

  const contextValue = useMemo(() => ({
    currentLanguage,
    changeLanguage
  }), [currentLanguage, changeLanguage]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;a