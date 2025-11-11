import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: {
    translation: en
  },
  ar: {
    translation: ar
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    }
  });

// Set up RTL support
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  
  // Add RTL class to body for CSS styling
  if (isRTL) {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
});

// Initialize RTL support on page load
const currentLang = i18n.language || 'en';
const isRTL = currentLang === 'ar';
document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
document.documentElement.lang = currentLang;

if (isRTL) {
  document.body.classList.add('rtl');
} else {
  document.body.classList.remove('rtl');
}

export default i18n;

