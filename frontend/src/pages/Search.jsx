import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Search = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const location = searchParams.get('location');
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-4">{t('searchPage.title')}</h1>
      <p className="text-gray-600">
        {t('searchPage.subtitle', { query: query || t('searchPage.anyQuery'), location: location || t('searchPage.anyLocation') })}
      </p>
    </div>
  );
};

export default Search;
