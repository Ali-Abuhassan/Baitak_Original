import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">{t('notFound.message')}</p>
        <Link to="/" className="btn-primary">
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
