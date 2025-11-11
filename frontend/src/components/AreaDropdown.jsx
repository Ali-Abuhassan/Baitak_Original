import React, { useState, useEffect } from 'react';
import { locationAPI } from '../utils/api';
import { useTranslation } from 'react-i18next';

const AreaDropdown = ({ value, onChange, citySlug, className = '', required = false }) => {
  const { t } = useTranslation();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!citySlug) {
        setAreas([]);
        setError(null);
        console.log("my name is ali");
        return;
        
      }

      try {
        setLoading(true);
        setError(null);
        
        // Use city slug directly
        const response = await locationAPI.getAreasByCity(citySlug);
        
        if (response.data.success) {
          setAreas(response.data.data.areas);
        } else {
          console.error('API returned success: false');
          setError('Failed to load areas');
        }
      } catch (err) {
        console.error('Error fetching areas:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
        setError(`Failed to load areas: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [citySlug]);


  if (!citySlug) {
    return (
      <select className={`input ${className}`} disabled>
        <option>{t('dropdowns.selectCityFirst')}</option>
      </select>
    );
  }

  if (loading) {
    return (
      <select className={`input ${className}`} disabled>
        <option>{t('dropdowns.loadingAreas')}</option>
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
          placeholder={t('dropdowns.enterArea')}
          required={required}
        />
        <p className="text-sm text-red-500 mt-1">{t('dropdowns.manualInputAreas')}</p>
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
      <option value="">{t('dropdowns.selectArea')}</option>
      {areas.map((area) => (
        <option key={area.id} value={area.id}>
          {area.name_en} - {area.name_ar}
        </option>
      ))}
    </select>
  );
};

export default AreaDropdown;
