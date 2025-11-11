import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../utils/api';
import { 
  HiUsers, 
  HiUserGroup, 
  HiCalendar, 
  HiCurrencyDollar, 
  HiTrendingUp,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/currency';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [statistics, setStatistics] = useState(null);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, providersRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getPendingProviders()
      ]);
      
      setStatistics(statsRes.data.data.statistics);
      setPendingProviders(providersRes.data.data.providers || []);
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      toast.error(t('admin.messages.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleProviderApproval = async (providerId, status) => {
    try {
      await adminAPI.updateProviderStatus(providerId, { status });
      toast.success(t('admin.messages.statusUpdated', { status }));
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast.error(t('admin.messages.updateFailed'));
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
        <p className="text-gray-600">{t('admin.subtitle')}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/admin/providers" className="btn-secondary">{t('admin.manageProviders')}</a>
          <a href="/admin/customers" className="btn-secondary">{t('admin.manageCustomers')}</a>
          <a href="/admin/categories" className="btn-secondary">{t('admin.createCategory')}</a>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          [...Array(8)].map((_, index) => (
            <div key={index} className="card p-6">
              <Skeleton height={60} />
            </div>
          ))
        ) : (
          <>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('admin.stats.totalUsers')}</h2>
                <HiUsers className="text-blue-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.total_users || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('admin.stats.totalProviders')}</h2>
                <HiUserGroup className="text-green-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.total_providers || 0}</p>
              <p className="text-sm text-gray-500">
                {statistics?.approved_providers || 0} {t('admin.stats.approved')}, {statistics?.pending_providers || 0} {t('admin.stats.pending')}
              </p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('admin.stats.totalBookings')}</h2>
                <HiCalendar className="text-green-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.total_bookings || 0}</p>
              <p className="text-sm text-gray-500">
                {statistics?.today_bookings || 0} {t('admin.stats.today')}
              </p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('admin.stats.totalRevenue')}</h2>
                <HiCurrencyDollar className="text-green-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(statistics?.total_revenue || 0, i18n.language)}
              </p>
              <p className="text-sm text-gray-500">
                {formatPrice(statistics?.this_month_revenue || 0, i18n.language)} {t('admin.stats.thisMonth')}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="card p-6">
              <Skeleton height={100} />
            </div>
          ))
        ) : (
          <>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t('admin.sections.bookingStatus.title')}</h3>
                <HiCheckCircle className="text-green-600 w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.bookingStatus.completed')}</span>
                  <span className="text-sm font-medium">{statistics?.completed_bookings || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.bookingStatus.inProgress')}</span>
                  <span className="text-sm font-medium">
                    {(statistics?.total_bookings || 0) - (statistics?.completed_bookings || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.bookingStatus.successRate')}</span>
                  <span className="text-sm font-medium">
                    {statistics?.total_bookings 
                      ? Math.round((statistics.completed_bookings / statistics.total_bookings) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t('admin.sections.growthMetrics.title')}</h3>
                <HiTrendingUp className="text-indigo-600 w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.growthMetrics.newUsers')}</span>
                  <span className="text-sm font-medium">+{statistics?.new_users_month || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.growthMetrics.newProviders')}</span>
                  <span className="text-sm font-medium">+{statistics?.new_providers_month || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.growthMetrics.revenueGrowth')}</span>
                  <span className="text-sm font-medium text-green-600">+12%</span>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t('admin.sections.platformHealth.title')}</h3>
                <HiClock className="text-teal-600 w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.platformHealth.avgResponseTime')}</span>
                  <span className="text-sm font-medium">1.2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.platformHealth.avgRating')}</span>
                  <span className="text-sm font-medium">4.6 / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('admin.sections.platformHealth.activeProviders')}</span>
                  <span className="text-sm font-medium">{statistics?.approved_providers || 0}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pending Provider Approvals */}
      <div className="card">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('admin.pendingApprovals.title')}</h2>
          {pendingProviders.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {t('admin.pendingApprovals.badge', { count: pendingProviders.length })}
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="p-6">
            <Skeleton height={100} count={2} />
          </div>
        ) : pendingProviders.length > 0 ? (
          <div className="divide-y">
            {pendingProviders.map(provider => (
              <div key={provider.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{provider.business_name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {provider.user?.first_name} {provider.user?.last_name} • {provider.user?.email}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">{provider.bio}</p>
                    <div className="flex gap-4 text-sm">
                      <span>{t('admin.pendingApprovals.rate', { rate: provider.hourly_rate })}</span>
                      <span>{t('admin.pendingApprovals.experience', { years: provider.experience_years })}</span>
                      <span>{t('admin.pendingApprovals.applied', { date: new Date(provider.created_at).toLocaleDateString() })}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProviderApproval(provider.id, 'approved')}
                      className="btn-primary text-sm"
                    >
                      {t('admin.pendingApprovals.approve')}
                    </button>
                    <button
                      onClick={() => handleProviderApproval(provider.id, 'rejected')}
                      className="btn-secondary text-sm"
                    >
                      {t('admin.pendingApprovals.reject')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <HiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-500">{t('admin.pendingApprovals.none')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;