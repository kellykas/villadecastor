import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'villadecastor_language';

const translationsCacheKey = (lang: Language) => `villadecastor_translations_${lang}`;

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'fr') return 'fr';
  return 'en';
};

const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === 'en' || stored === 'fr') return stored;
  return detectBrowserLanguage();
};

// Last translations we fetched, hydrated synchronously so the first paint
// already has real text instead of raw keys.
const readCachedTranslations = (lang: Language): Record<string, string> | null => {
  try {
    const raw = localStorage.getItem(translationsCacheKey(lang));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch (error) {
    console.error('Error reading cached translations:', error);
  }
  return null;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>(
    () => readCachedTranslations(getInitialLanguage()) ?? {}
  );
  const [isLoading, setIsLoading] = useState(true);
  // Nothing to show until the first fetch settles when there is no cache,
  // otherwise keys like "hero.subtitle" would flash before the real text arrives.
  const [isReady, setIsReady] = useState(
    () => Object.keys(readCachedTranslations(getInitialLanguage()) ?? {}).length > 0
  );

  const fetchTranslations = useCallback(async (lang: Language) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('key, value')
        .eq('language', lang);

      if (error) throw error;

      const translationMap: Record<string, string> = {};
      data?.forEach(item => {
        translationMap[item.key] = item.value;
      });

      setTranslations(translationMap);
      try {
        localStorage.setItem(translationsCacheKey(lang), JSON.stringify(translationMap));
      } catch (error) {
        console.error('Error caching translations:', error);
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    fetchTranslations(language);
  }, [language, fetchTranslations]);

  // Keep <html lang> in sync so browsers don't offer to translate a page
  // that is already in the reader's language (that rewrite flashes the text).
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    // Missing keys fall back to '' so `t('x') || 'default'` patterns work
    // instead of rendering the raw key.
    return translations[key] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {isReady ? children : null}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
