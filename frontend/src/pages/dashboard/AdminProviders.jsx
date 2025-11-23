import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const AdminProviders = () => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_providers: 0, limit: 10 });

  useEffect(() => {
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, status, search, sortBy, order]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const params = { page, limit, sort_by: sortBy, order };
      if (status) params.status = status;
      if (search) params.search = search;
      const res = await adminAPI.getAllProviders(params);
      setProviders(res.data?.data?.providers || []);
      setPagination(res.data?.data?.pagination || pagination);
    } catch (err) {
      console.error(err);
      toast.error(t('admin.providers.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="input"
            placeholder={t('admin.providers.search')}
          />
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="input">
            <option value="">{t('admin.providers.allStatus')}</option>
            <option value="approved">{t('admin.providers.approved')}</option>
            <option value="pending">{t('admin.providers.pending')}</option>
            <option value="rejected">{t('admin.providers.rejected')}</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
            <option value="created_at">{t('admin.providers.created')}</option>
            <option value="rating">{t('admin.providers.rating')}</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)} className="input">
            <option value="DESC">DESC</option>
            <option value="ASC">ASC</option>
          </select>
          <select value={limit} onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }} className="input">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-4">{t('admin.providers.id')}</th>
              <th className="p-4">{t('admin.providers.business')}</th>
              <th className="p-4">{t('admin.providers.status')}</th>
              <th className="p-4">{t('admin.providers.rating')}</th>
              <th className="p-4">{t('admin.providers.owner')}</th>
              <th className="p-4">{t('admin.providers.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4" colSpan={6}>{t('admin.providers.loading')}</td></tr>
            ) : providers.length === 0 ? (
              <tr><td className="p-4" colSpan={6}>{t('admin.providers.noProviders')}</td></tr>
            ) : (
              providers.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-4">{p.id}</td>
                  <td className="p-4">{p.business_name}</td>
                  <td className="p-4 capitalize">{p.status}</td>
                  <td className="p-4">{p.rating_avg ?? '-'}</td>
                  <td className="p-4">{p.user?.first_name} {p.user?.last_name}</td>
                  <td className="p-4">
                    <a className="text-blue-600 hover:underline" href={`/admin/providers/${p.id}/documents`}>
                      {t('admin.providers.viewDocuments')}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button disabled={page <= 1} onClick={() => setPage((x) => Math.max(1, x - 1))} className="btn-secondary">{t('admin.providers.prev')}</button>
        <div className="text-sm text-gray-600">{t('admin.providers.page', { current: pagination.current_page, total: pagination.total_pages })}</div>
        <button disabled={pagination.current_page >= pagination.total_pages} onClick={() => setPage((x) => x + 1)} className="btn-secondary">{t('admin.providers.next')}</button>
      </div>
    </div>
  );
};

export default AdminProviders;


