import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../utils/api';
import { useTranslation } from 'react-i18next';

const CategoryDropdown = ({ value, onChange, className = '', required = false }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryAPI.getAll();
        
        if (response.data.success) {
          setCategories(response.data.data.categories || []);
          console.log('Categories loaded successfully:', response.data.data.categories);
        } else {
          console.error('API returned success: false');
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
        setError(`Failed to load categories: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <select className={`input ${className}`} disabled>
        <option>{t('dropdowns.loadingCategories')}</option>
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
          placeholder={t('dropdowns.enterCategory')}
          required={required}
        />
        <p className="text-sm text-red-500 mt-1">{t('dropdowns.manualInputCategories')}</p>
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
      <option value="">{t('dropdowns.selectCategory')}</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
