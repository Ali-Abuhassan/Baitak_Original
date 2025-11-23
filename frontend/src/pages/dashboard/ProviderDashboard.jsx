import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { providerAPI, bookingAPI } from '../../services/api';
import api from '../../services/api';
import { HiCalendar, HiClock, HiCurrencyDollar, HiStar, HiTrendingUp, HiUsers, HiCog, HiUser, HiLocationMarker, HiPhone, HiMail, HiCheckCircle, HiXCircle, HiExclamationCircle, HiExclamation } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';
import CompleteBookingModal from '../../components/sharedInputs/CompleteBookingModal';

const ProviderDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [completingBooking, setCompletingBooking] = useState(false);
  const [providerStatus, setProviderStatus] = useState(null);

  useEffect(() => {
    fetchProviderStatus();
    fetchDashboardStats();
    fetchUpcomingBookings();
  }, []);

  // Fetch provider status directly from provider profile endpoint
  const fetchProviderStatus = async () => {
    try {
      // Try to get provider profile which should include status
      const profileResponse = await api.get('/providers/profile');
      const provider = profileResponse.data?.data?.provider || 
                       profileResponse.data?.data || 
                       profileResponse.data;
      if (provider?.status) {
        console.log('Provider status from profile endpoint:', provider.status);
        setProviderStatus(provider.status);
      }
    } catch (error) {
      console.log('Could not fetch provider profile:', error.response?.status);
      // If 403, provider is likely not approved
      if (error.response?.status === 403) {
        console.log('403 error - provider not approved');
        setProviderStatus('pending');
      }
    }
  };

  // Update provider status when user object changes
  useEffect(() => {
    console.log('User object updated:', {
      user,
      userProvider: user?.provider,
      userProviderStatus: user?.provider?.status,
      userStatus: user?.status,
      userRole: user?.role
    });
    
    if (user?.provider?.status) {
      console.log('Setting provider status from user.provider.status:', user.provider.status);
      setProviderStatus(user.provider.status);
    } else if (user?.status) {
      console.log('Setting provider status from user.status:', user.status);
      setProviderStatus(user.status);
    } else if (user?.role === 'provider') {
      // If user is a provider but no status is set, assume pending
      console.log('User is provider but no status found, assuming pending');
      setProviderStatus('pending');
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getDashboardStats();
      setStatistics(response.data.data.statistics);
      
      // Check provider status from response or user object
      const status = response.data.data.provider?.status || 
                     response.data.data.status ||
                     response.data.data.provider_status ||
                     user?.provider?.status ||
                     user?.status;
      
      console.log('Provider status check:', {
        fromResponse: response.data.data.provider?.status,
        fromResponseData: response.data.data.status,
        fromUserProvider: user?.provider?.status,
        fromUser: user?.status,
        finalStatus: status,
        userObject: user
      });
      
      setProviderStatus(status);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      console.error('Error response:', error.response?.data);
      
      // If error is 403, provider might not be approved
      if (error.response?.status === 403) {
        console.log('403 error detected - setting status to pending');
        setProviderStatus('pending');
      }
      
      toast.error(t('dashboard.provider.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingBookings = async () => {
    try {
      setBookingsLoading(true);
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      let response;
      let allBookings = [];
      
      // Try provider-specific endpoint first
      try {
        response = await providerAPI.getMyBookings({
          page: 1,
          limit: 10,
          status: 'confirmed'
        });
      } catch (providerError) {
        // Fallback to general booking endpoint
        response = await bookingAPI.getMyBookings({
          page: 1,
          limit: 10,
          status: 'confirmed'
        });
      }
      
      // Handle different response structures
      if (response.data.data && response.data.data.bookings) {
        allBookings = response.data.data.bookings;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        allBookings = response.data.data;
      } else if (Array.isArray(response.data)) {
        allBookings = response.data;
      } else {
        // If API is returning user data instead of bookings, set empty array
        if (response.data.first_name || response.data.provider) {
          setUpcomingBookings([]);
          return;
        }
        
        setUpcomingBookings([]);
        return;
      }
      
      // Filter for future bookings only
      const upcomingBookings = allBookings.filter(booking => {
        if (!booking.booking_date) {
          return false;
        }
        const bookingDate = new Date(booking.booking_date);
        const todayDate = new Date(today);
        const isUpcoming = bookingDate >= todayDate;
        return isUpcoming;
      });
      
      // If no upcoming bookings found, show all confirmed bookings as fallback
      if (upcomingBookings.length === 0 && allBookings.length > 0) {
        setUpcomingBookings(allBookings.slice(0, 5));
      } else {
        setUpcomingBookings(upcomingBookings);
      }
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      toast.error('Failed to load upcoming bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, { status: newStatus });
      toast.success(t('dashboard.provider.booking_updated', { status: newStatus }));
      fetchUpcomingBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(t('dashboard.provider.update_error'));
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
      fetchUpcomingBookings(); // Refresh the list
      fetchDashboardStats(); // Refresh stats as well
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error(error.response?.data?.message || t('booking.complete.error'));
    } finally {
      setCompletingBooking(false);
    }
  };

  const handleBookingClick = (bookingId) => {
    navigate(`/booking/details/${bookingId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_provider_accept':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending_provider_accept':
      case 'pending':
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
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
      case 'in_progress':
        return <HiClock className="w-4 h-4" />;
      case 'provider_on_way':
        return <HiClock className="w-4 h-4" />;
      case 'provider_arrived':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'completed':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <HiXCircle className="w-4 h-4" />;
      default:
        return <HiExclamationCircle className="w-4 h-4" />;
    }
  };

  const translateStatus = (status) => {
    if (!status) return '';
    const normalized = String(status).toLowerCase();
    const key = `dashboard.todays_bookings.status_${normalized}`;
    const value = t(key);
    if (value === key) {
      return String(status).replace(/_/g, ' ').toUpperCase();
    }
    return value;
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if provider is not approved
  // Show warning if:
  // 1. Status exists and is not 'approved'
  // 2. User is provider but status is not explicitly 'approved'
  const isNotApproved = providerStatus && providerStatus !== 'approved';
  const userProviderStatus = user?.provider?.status || user?.status;
  const isExplicitlyApproved = providerStatus === 'approved' || userProviderStatus === 'approved';
  
  // Show warning if user is a provider and not explicitly approved
  const showWarning = user?.role === 'provider' && !isExplicitlyApproved;
  
  console.log('Warning display check:', {
    providerStatus,
    isNotApproved,
    userProviderStatus,
    userRole: user?.role,
    isExplicitlyApproved,
    showWarning,
    finalDecision: showWarning ? 'SHOW WARNING' : 'HIDE WARNING'
  });

  return (
    <div className="container-custom py-8">
      {/* Warning Banner for Non-Approved Providers */}
      {showWarning && (
        <div className={`mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg ${i18n.language === 'ar' ? 'border-r-4 border-l-0 rounded-l-lg rounded-r-none' : ''}`}>
          <div className="flex items-start">
            <HiExclamation className={`flex-shrink-0 w-5 h-5 text-yellow-600 mt-0.5 ${i18n.language === 'ar' ? 'ml-3' : 'mr-3'}`} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                {t('dashboard.provider.approvalWarning.title')}
              </h3>
              <p className="text-sm text-yellow-700">
                {t('dashboard.provider.approvalWarning.message')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.provider.title')}</h1>
        <p className="text-gray-600">{t('dashboard.provider.subtitle')}</p>
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
                <h2 className="font-semibold text-gray-700">{t('dashboard.provider.stats.total_bookings')}</h2>
                <HiCalendar className="text-primary-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.total_bookings || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.provider.stats.today_bookings')}</h2>
                <HiClock className="text-blue-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.today_bookings || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.provider.stats.upcoming')}</h2>
                <HiUsers className="text-green-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.upcoming_bookings || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.provider.stats.completed')}</h2>
                <HiCalendar className="text-green-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.completed_bookings || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.provider.stats.total_earnings')}</h2>
                <HiCurrencyDollar className="text-green-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">${statistics?.total_earnings || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.provider.stats.this_month')}</h2>
                <HiTrendingUp className="text-indigo-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">${statistics?.this_month_earnings || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.provider.stats.rating')}</h2>
                <HiStar className="text-yellow-500 w-6 h-6" />
              </div>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{statistics?.rating || 0}</p>
                <p className="text-sm text-gray-500 ml-2">({statistics?.rating_count || 0} {t('dashboard.provider.reviews')})</p>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.provider.stats.success_rate')}</h2>
                <HiCalendar className="text-teal-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {statistics?.completed_bookings && statistics?.total_bookings
                  ? Math.round((statistics.completed_bookings / statistics.total_bookings) * 100)
                  : 0}%
              </p>
            </div>
          </>
        )}
      </div>

      {/* Upcoming Bookings Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('dashboard.provider.upcoming_bookings')}</h2>
          <Link 
            to="/dashboard/bookings/today" 
            className="btn-outline text-sm"
          >
            {t('dashboard.provider.view_all_bookings')}
          </Link>
        </div>
        
        {bookingsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="card p-6">
                <Skeleton height={100} />
              </div>
            ))}
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.provider.no_upcoming_bookings')}</h3>
            <p className="text-gray-600">
              {t('dashboard.provider.no_upcoming_bookings_desc')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleBookingClick(booking.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{booking.service?.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {translateStatus(booking.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <HiCalendar className="w-4 h-4" />
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiClock className="w-4 h-4" />
                        <span>{formatTime(booking.booking_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiCurrencyDollar className="w-4 h-4" />
                        <span>{formatPrice(booking.total_price, i18n.language)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiUser className="w-4 h-4" />
                        <span>{booking.customer?.first_name} {booking.customer?.last_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiLocationMarker className="w-4 h-4" />
                        <span>{booking.service_city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiPhone className="w-4 h-4" />
                        <span>{booking.customer?.phone || t('commonExtras.notAvailable')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {(booking.status === 'pending_provider_accept' || booking.status === 'pending' || booking.status === 'PENDING') && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateBookingStatus(booking.id, 'confirmed');
                          }}
                          className="btn-primary text-sm bg-green-600 hover:bg-green-700"
                        >
                          <HiCheckCircle className="w-4 h-4 mr-1" />
                          {t('dashboard.provider.accept_booking')}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateBookingStatus(booking.id, 'cancelled');
                          }}
                          className="btn-secondary text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <HiXCircle className="w-4 h-4 mr-1" />
                          {t('dashboard.provider.reject_booking')}
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateBookingStatus(booking.id, 'in_progress');
                        }}
                        className="btn-primary text-sm"
                      >
                        {t('dashboard.provider.start_service')}
                      </button>
                    )}
                    
                    {booking.status === 'in_progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteClick(booking);
                        }}
                        className="btn-primary text-sm"
                      >
                        {t('dashboard.provider.complete')}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Customer Details */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">{t('dashboard.provider.customer_details')}</h4>
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
                      <h4 className="font-medium text-gray-700 mb-2">{t('dashboard.provider.service_address')}</h4>
                      <div className="text-sm text-gray-600">
                        <p>{booking.service_address}</p>
                        <p>{booking.service_city}, {booking.service_area}</p>
                      </div>
                    </div>
                  </div>
                  
                  {booking.customer_notes && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-700 mb-2">{t('dashboard.provider.customer_notes')}</h4>
                      <p className="text-sm text-gray-600">{booking.customer_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">{t('dashboard.provider.quick_actions')}</h3>
          <div className="space-y-2">
            <Link 
              to="/dashboard/bookings/today" 
              className="w-full btn-primary text-sm flex items-center justify-center"
            >
              {t('dashboard.provider.view_todays_bookings')}
            </Link>
            {/* <button className="w-full btn-outline text-sm">{t('dashboard.provider.update_availability')}</button> */}
            <Link 
              to="/dashboard/services" 
              className="w-full btn-outline text-sm flex items-center justify-center gap-2"
            >
              <HiCog className="w-4 h-4" />
              {t('dashboard.provider.manage_services')}
            </Link>
            <Link 
              to="/dashboard/reviews" 
              className="w-full btn-outline text-sm flex items-center justify-center gap-2"
            >
              <HiStar className="w-4 h-4" />
              {t('dashboard.provider.view_reviews')}
            </Link>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="font-semibold mb-4">{t('dashboard.provider.profile_status')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('dashboard.provider.profile_completion')}</span>
              <span className="text-sm font-medium">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-gray-500">{t('dashboard.provider.profile_completion_desc')}</p>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="font-semibold mb-4">{t('dashboard.provider.performance_tips')}</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• {t('dashboard.provider.tip_respond_quickly')}</li>
            <li>• {t('dashboard.provider.tip_update_availability')}</li>
            <li>• {t('dashboard.provider.tip_ask_reviews')}</li>
            <li>• {t('dashboard.provider.tip_add_photos')}</li>
          </ul>
        </div>
      </div>

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

export default ProviderDashboard;