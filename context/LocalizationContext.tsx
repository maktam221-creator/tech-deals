import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { EXCHANGE_RATES, LANGUAGES, CURRENCIES, COUNTRIES } from '../constants';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Language {
  code: string;
  name: string;
  dir: 'rtl' | 'ltr';
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface Country {
    code: string;
    name: string;
    flag: string;
    currencyCode: string;
    languageCode: string;
}

interface LocalizationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    currency: Currency;
    setCurrency: (curr: Currency) => void;
    country: Country;
    setCountry: (country: Country) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    convertPrice: (priceInSar: number) => number;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const getStoredValue = (key: string, defaultValue: any) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const getInitialState = () => {
    let country: Country;
    let language: Language;

    const storedCountry = getStoredValue('country', null);
    if (storedCountry) {
        country = storedCountry;
    } else {
        const userLang = navigator.language;
        const regionCode = userLang.split('-')[1];
        let detectedCountry;
        if (regionCode) {
            detectedCountry = COUNTRIES.find(c => c.code.toUpperCase() === regionCode.toUpperCase());
        }
        const defaultCountry = COUNTRIES.find(c => c.code === 'SA') || COUNTRIES[0];
        country = detectedCountry || defaultCountry; 
    }
    
    const currency = CURRENCIES.find(c => c.code === country.currencyCode) || CURRENCIES[0];
    
    language = LANGUAGES.find(l => l.code === country.languageCode) || LANGUAGES[0];
    const storedLanguage = getStoredValue('language', null);
    if (storedLanguage) {
        language = storedLanguage;
    }
    
    return { country, currency, language };
};

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initialState] = useState(getInitialState);
  const [language, setLanguageState] = useState<Language>(initialState.language);
  const [currency, setCurrencyState] = useState<Currency>(initialState.currency);
  const [country, setCountryState] = useState<Country>(initialState.country);
  const [translations, setTranslations] = useState<{ [key: string]: any } | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [arResponse, enResponse] = await Promise.all([
          fetch('./locales/ar.json'),
          fetch('./locales/en.json')
        ]);
        if (!arResponse.ok || !enResponse.ok) {
            throw new Error('Failed to fetch translation files');
        }
        const arData = await arResponse.json();
        const enData = await enResponse.json();
        setTranslations({ ar: arData, en: enData });
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };
    fetchTranslations();
  }, []);
  
  useEffect(() => {
    if (!translations) return;
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    localStorage.setItem('language', JSON.stringify(language));
  }, [language, translations]);
  
  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);
  
  useEffect(() => {
    localStorage.setItem('country', JSON.stringify(country));
  }, [country]);

  const setCountry = useCallback((newCountry: Country) => {
    setCountryState(newCountry);
    const newCurrency = CURRENCIES.find(c => c.code === newCountry.currencyCode);
    if (newCurrency) {
        setCurrencyState(newCurrency);
    } else {
        console.warn(`Currency for country ${newCountry.code} not found. Defaulting to SAR.`);
        setCurrencyState(CURRENCIES.find(c => c.code === 'SAR') || CURRENCIES[0]);
    }

    const newLanguage = LANGUAGES.find(l => l.code === newCountry.languageCode);
    if (newLanguage) {
      setLanguageState(newLanguage);
    }
  }, []);

  const convertPrice = useCallback((priceInSar: number) => {
    const rate = EXCHANGE_RATES[currency.code];
    if (rate !== undefined) {
        return priceInSar * rate;
    }
    return priceInSar;
  }, [currency]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    if (!translations) {
        return key;
    }
    const langFile = translations[language.code];
     if (!langFile) {
        console.warn(`No translations found for language: ${language.code}`);
        return key;
    }
    let translation = key.split('.').reduce((obj, k) => (obj)?.[k], langFile) || key;

    if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
            translation = translation.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
    }
    return translation;
  }, [translations, language.code]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    currency,
    setCurrency: setCurrencyState,
    country,
    setCountry,
    t,
    convertPrice,
  }), [language, currency, country, setCountry, convertPrice, t]);
  
  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationContext;