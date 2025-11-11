import React, { useState } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const AdminCategories = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name,
        description,
        icon,
        parent_id: null,
        suggested_price_range: {
          min: min ? Number(min) : undefined,
          max: max ? Number(max) : undefined,
        },
      };
      await adminAPI.createCategory(payload);
      toast.success(t('admin.categories.success'));
      setName(''); setDescription(''); setIcon(''); setMin(''); setMax('');
    } catch (err) {
      console.error(err);
      toast.error(t('admin.categories.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="card p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">{t('admin.categories.title')}</h1>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
          <input className="input" placeholder={t('admin.categories.name')} value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input" placeholder={t('admin.categories.description')} value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="input" placeholder={t('admin.categories.icon')} value={icon} onChange={(e) => setIcon(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder={t('admin.categories.minPrice')} type="number" value={min} onChange={(e) => setMin(e.target.value)} />
            <input className="input" placeholder={t('admin.categories.maxPrice')} type="number" value={max} onChange={(e) => setMax(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-primary">{t('admin.categories.create')}</button>
            <a href="/admin" className="btn-secondary">{t('admin.categories.back')}</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategories;


