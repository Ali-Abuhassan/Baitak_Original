import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const AdminCustomers = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_customers: 0, limit: 10 });

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, sortBy, order]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = { page, limit, sort_by: sortBy, order };
      if (search) params.search = search;
      const res = await adminAPI.getAllCustomers(params);
      setCustomers(res.data?.data?.customers || []);
      setPagination(res.data?.data?.pagination || pagination);
    } catch (err) {
      console.error(err);
      toast.error(t('admin.customers.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="input"
            placeholder={t('admin.customers.search')}
          />
          <div />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
            <option value="created_at">{t('admin.customers.created')}</option>
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
              <th className="p-4">{t('admin.customers.id')}</th>
              <th className="p-4">{t('admin.customers.name')}</th>
              <th className="p-4">{t('admin.customers.phone')}</th>
              <th className="p-4">{t('admin.customers.email')}</th>
              <th className="p-4">{t('admin.customers.verified')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4" colSpan={5}>{t('admin.customers.loading')}</td></tr>
            ) : customers.length === 0 ? (
              <tr><td className="p-4" colSpan={5}>{t('admin.customers.noCustomers')}</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-4">{c.id}</td>
                  <td className="p-4">{c.first_name} {c.last_name}</td>
                  <td className="p-4">{c.phone}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.is_verified ? t('admin.customers.yes') : t('admin.customers.no')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button disabled={page <= 1} onClick={() => setPage((x) => Math.max(1, x - 1))} className="btn-secondary">{t('admin.customers.prev')}</button>
        <div className="text-sm text-gray-600">{t('admin.customers.page', { current: pagination.current_page, total: pagination.total_pages })}</div>
        <button disabled={pagination.current_page >= pagination.total_pages} onClick={() => setPage((x) => x + 1)} className="btn-secondary">{t('admin.customers.next')}</button>
      </div>
    </div>
  );
};

export default AdminCustomers;


