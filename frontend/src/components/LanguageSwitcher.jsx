import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiGlobe } from 'react-icons/hi';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  // Initialize RTL on component mount
  useEffect(() => {
    const currentLang = i18n.language || 'en';
    const isRTL = currentLang === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update document direction for RTL support
    const isRTL = lng === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
    // Add/remove RTL class to body
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
  };

  const currentLanguage = i18n.language;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
        <HiGlobe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLanguage === 'ar' ? 'العربية' : 'English'}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
              currentLanguage === 'en' ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
            }`}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => changeLanguage('ar')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
              currentLanguage === 'ar' ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
            }`}
          >
            🇯🇴 العربية
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

