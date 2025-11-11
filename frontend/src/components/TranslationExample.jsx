import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationExample = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{t('common.welcome')}</h2>
      <p className="text-gray-600 mb-4">{t('home.subtitle')}</p>
      
      <div className="space-y-2">
        <button className="btn-primary mr-2">
          {t('common.sign_up')}
        </button>
        <button className="btn-secondary">
          {t('common.sign_in')}
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>{t('common.loading')}: {t('common.loading')}</p>
        <p>{t('common.error')}: {t('common.error')}</p>
        <p>{t('common.success')}: {t('common.success')}</p>
      </div>
    </div>
  );
};

export default TranslationExample;

