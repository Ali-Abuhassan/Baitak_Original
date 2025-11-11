import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI } from '../../utils/api';
import { 
  HiCalendar, 
  HiClock, 
  HiCurrencyDollar, 
  HiUser, 
  HiPhone, 
  HiMail, 
  HiLocationMarker,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle,
  HiArrowLeft
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { formatPrice } from '../../utils/currency';
import { useTranslation } from 'react-i18next';
import CompleteBookingModal from '../../components/CompleteBookingModal';

const TodaysBookings = () => {
  const { t, i18n } = useTranslation();
  const { user, isProvider } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [completingBooking, setCompletingBooking] = useState(false);

  useEffect(() => {
    if (isProvider) {
      fetchTodaysBookings();
    }
  }, [currentPage, statusFilter, isProvider]);

  const fetchTodaysBookings = async () => {
    try {
      setLoading(true);
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      const response = await bookingAPI.getMyBookings({
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter,
        booking_date: today
      });
      
      setBookings(response.data.data.bookings);
      setTotalPages(response.data.data.pagination.total_pages);
      setTotalBookings(response.data.data.pagination.total_bookings);
    } catch (error) {
      console.error('Error fetching today\'s bookings:', error);
      toast.error(t('dashboard.todays_bookings.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pending_provider_accept': t('dashboard.todays_bookings.status_pending_provider_accept'),
      'pending': t('dashboard.todays_bookings.status_pending'),
      'PENDING': t('dashboard.todays_bookings.status_pending'),
      'confirmed': t('dashboard.todays_bookings.status_confirmed'),
      'provider_on_way': t('dashboard.todays_bookings.status_provider_on_way'),
      'provider_arrived': t('dashboard.todays_bookings.status_provider_arrived'),
      'in_progress': t('dashboard.todays_bookings.status_in_progress'),
      'completed': t('dashboard.todays_bookings.status_completed'),
      'cancelled': t('dashboard.todays_bookings.status_cancelled'),
      'refunded': t('dashboard.todays_bookings.status_refunded')
    };
    return statusMap[status] || status;
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, { status: newStatus });
      const statusLabel = getStatusLabel(newStatus);
      toast.success(t('dashboard.todays_bookings.update_success', { status: statusLabel }));
      fetchTodaysBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(t('dashboard.todays_bookings.update_error'));
    }
  };

  const handleCompleteClick = (booking) => {
    setSelectedBooking(booking);
    setCompleteModalOpen(true);
  };

  const handleCompleteConfirm = async (completionData) => {
    if (!selectedBooking) return;

    try {
      setCompletingBooking(true);
      await bookingAPI.updateStatus(selectedBooking.id, completionData);
      toast.success(t('booking.complete.success'));
      setCompleteModalOpen(false);
      setSelectedBooking(null);
      fetchTodaysBookings(); // Refresh the list
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error(error.response?.data?.message || t('booking.complete.error'));
    } finally {
      setCompletingBooking(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_provider_accept':
      case 'pending':
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'provider_on_way':
        return 'bg-purple-100 text-purple-800';
      case 'provider_arrived':
        return 'bg-indigo-100 text-indigo-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_provider_accept':
      case 'pending':
      case 'PENDING':
        return <HiExclamationCircle className="w-4 h-4" />;
      case 'confirmed':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'provider_on_way':
        return <HiClock className="w-4 h-4" />;
      case 'provider_arrived':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <HiClock className="w-4 h-4" />;
      case 'completed':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <HiXCircle className="w-4 h-4" />;
      case 'refunded':
        return <HiExclamationCircle className="w-4 h-4" />;
      default:
        return <HiExclamationCircle className="w-4 h-4" />;
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(i18n.language === 'ar' ? 'ar-JO' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'ar' ? 'ar-JO' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusDisplayLabel = (status) => {
    const statusMap = {
      'pending_provider_accept': t('dashboard.todays_bookings.status_pending_provider_accept'),
      'pending': t('dashboard.todays_bookings.status_pending'),
      'PENDING': t('dashboard.todays_bookings.status_pending'),
      'confirmed': t('dashboard.todays_bookings.status_confirmed'),
      'provider_on_way': t('dashboard.todays_bookings.status_provider_on_way'),
      'provider_arrived': t('dashboard.todays_bookings.status_provider_arrived'),
      'in_progress': t('dashboard.todays_bookings.status_in_progress'),
      'completed': t('dashboard.todays_bookings.status_completed'),
      'cancelled': t('dashboard.todays_bookings.status_cancelled'),
      'refunded': t('dashboard.todays_bookings.status_refunded')
    };
    return statusMap[status] || status.replace('_', ' ').toUpperCase();
  };

  if (!isProvider) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('dashboard.todays_bookings.access_denied')}</h1>
          <p className="text-gray-600 mb-4">{t('dashboard.todays_bookings.access_denied_desc')}</p>
          <Link to="/provider/dashboard" className="btn-primary">
            {t('dashboard.todays_bookings.go_to_dashboard')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            to="/provider/dashboard" 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <HiArrowLeft className="w-5 h-5 mr-2" />
            {t('dashboard.todays_bookings.back_to_dashboard')}
          </Link>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('dashboard.todays_bookings.title')}</h1>
            <p className="text-gray-600">
              {formatDate(new Date())} • {totalBookings === 1 
                ? t('dashboard.todays_bookings.booking_count', { count: totalBookings })
                : t('dashboard.todays_bookings.booking_count_plural', { count: totalBookings })}
            </p>
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{t('dashboard.todays_bookings.all_status')}</option>
              <option value="pending_provider_accept">{t('dashboard.todays_bookings.status_pending_provider_accept')}</option>
              <option value="pending">{t('dashboard.todays_bookings.status_pending')}</option>
              <option value="confirmed">{t('dashboard.todays_bookings.status_confirmed')}</option>
              <option value="provider_on_way">{t('dashboard.todays_bookings.status_provider_on_way')}</option>
              <option value="provider_arrived">{t('dashboard.todays_bookings.status_provider_arrived')}</option>
              <option value="in_progress">{t('dashboard.todays_bookings.status_in_progress')}</option>
              <option value="completed">{t('dashboard.todays_bookings.status_completed')}</option>
              <option value="cancelled">{t('dashboard.todays_bookings.status_cancelled')}</option>
              <option value="refunded">{t('dashboard.todays_bookings.status_refunded')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="card p-6">
              <Skeleton height={120} />
            </div>
          ))
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.todays_bookings.no_bookings_today')}</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? t('dashboard.todays_bookings.no_bookings_today_desc')
                : t('dashboard.todays_bookings.no_bookings_with_status', { status: getStatusLabel(statusFilter) })
              }
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{booking.service?.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {getStatusDisplayLabel(booking.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <HiClock className="w-4 h-4" />
                      <span>{formatTime(booking.booking_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiCurrencyDollar className="w-4 h-4" />
                      <span>{formatPrice(booking.total_price)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiUser className="w-4 h-4" />
                      <span>{booking.customer?.first_name} {booking.customer?.last_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiLocationMarker className="w-4 h-4" />
                      <span>{booking.service_city}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {(booking.status === 'pending_provider_accept' || booking.status === 'pending' || booking.status === 'PENDING') && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="btn-primary text-sm"
                      >
                        {t('dashboard.todays_bookings.confirm')}
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="btn-danger text-sm"
                      >
                        {t('dashboard.todays_bookings.cancel')}
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'provider_on_way')}
                      className="btn-primary text-sm"
                    >
                      {t('dashboard.todays_bookings.start_journey')}
                    </button>
                  )}
                  
                  {booking.status === 'provider_on_way' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'provider_arrived')}
                      className="btn-primary text-sm"
                    >
                      {t('dashboard.todays_bookings.mark_arrived')}
                    </button>
                  )}
                  
                  {booking.status === 'provider_arrived' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                      className="btn-primary text-sm"
                    >
                      {t('dashboard.todays_bookings.start_service')}
                    </button>
                  )}
                  
                  {booking.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteClick(booking)}
                      className="btn-primary text-sm"
                    >
                      {t('dashboard.todays_bookings.complete')}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Customer Details */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">{t('dashboard.todays_bookings.customer_details')}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{booking.customer?.first_name} {booking.customer?.last_name}</p>
                      {booking.customer?.phone && (
                        <a 
                          href={`tel:${booking.customer.phone}`}
                          className="flex items-center gap-1 hover:text-primary-600"
                        >
                          <HiPhone className="w-3 h-3" />
                          {booking.customer.phone}
                        </a>
                      )}
                      {booking.customer?.email && (
                        <a 
                          href={`mailto:${booking.customer.email}`}
                          className="flex items-center gap-1 hover:text-primary-600"
                        >
                          <HiMail className="w-3 h-3" />
                          {booking.customer.email}
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">{t('dashboard.todays_bookings.service_address')}</h4>
                    <div className="text-sm text-gray-600">
                      <p>{booking.service_address}</p>
                      <p>{booking.service_city}, {booking.service_area}</p>
                    </div>
                  </div>
                </div>
                
                {booking.customer_notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-700 mb-2">{t('dashboard.todays_bookings.customer_notes')}</h4>
                    <p className="text-sm text-gray-600">{booking.customer_notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('dashboard.todays_bookings.previous')}
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            {t('dashboard.todays_bookings.page_of', { current: currentPage, total: totalPages })}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('dashboard.todays_bookings.next')}
          </button>
        </div>
      )}

      {/* Complete Booking Modal */}
      <CompleteBookingModal
        isOpen={completeModalOpen}
        onClose={() => {
          setCompleteModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCompleteConfirm}
        booking={selectedBooking}
        loading={completingBooking}
      />
    </div>
  );
};

export default TodaysBookings;
