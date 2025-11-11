import React, { useState, useEffect } from 'react';
import { locationAPI } from '../utils/api';
import { useTranslation } from 'react-i18next';

const CityDropdown = ({ value, onChange, className = '', required = false }) => {
  const { t } = useTranslation();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        console.log('Fetching cities from API...');
        const response = await locationAPI.getCities();
        console.log('Cities API response:', response);
        
        if (response.data.success) {
          setCities(response.data.data.cities);
          console.log('Cities loaded successfully:', response.data.data.cities);
        } else {
          console.error('API returned success: false');
          setError('Failed to load cities');
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
        setError(`Failed to load cities: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <select className={`input ${className}`} disabled>
        <option>{t('dropdowns.loadingCities')}</option>
      </select>
    );
  }

  if (error) {
    return (
      <div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          className={`input ${className}`}
          placeholder={t('dropdowns.enterCity')}
          required={required}
        />
        <p className="text-sm text-red-500 mt-1">{t('dropdowns.manualInputCities')}</p>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={onChange}
      className={`input ${className}`}
      required={required}
    >
      <option value="">{t('dropdowns.selectCity')}</option>
      {cities.map((city) => {
        const citySlug = city.slug || city.id;
        return (
          <option key={city.id} value={citySlug} data-slug={citySlug} data-id={city.id}>
            {city.name_en} - {city.name_ar}
          </option>
        );
      })}
    </select>
  );
};

export default CityDropdown;
