import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, bookingAPI, ratingAPI } from '../../services/api';
import { HiCalendar, HiClock, HiCurrencyDollar, HiStar, HiShoppingBag, HiPhone, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';
import CancellationModal from '../../components/users/CancellationModal';
import RatingModal from '../../components/users/RatingModal';

const UserDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellationModal, setCancellationModal] = useState({ isOpen: false, bookingId: null });
  const [cancelling, setCancelling] = useState(false);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, booking: null });
  const [bookingsWithRatings, setBookingsWithRatings] = useState(new Set());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        userAPI.getStatistics(),
        userAPI.getBookings({ limit: 5 })
      ]);
      
      setStatistics(statsRes.data.data.statistics);
      const bookingsData = bookingsRes.data.data.bookings || [];
      setBookings(bookingsData);
      
      // Check which bookings already have ratings
      const ratingsSet = new Set();
      
      // First, check if bookings have rating property directly
      bookingsData.forEach(booking => {
        if (booking.rating || booking.has_rating || booking.user_rating) {
          ratingsSet.add(booking.id);
        }
      });
      
      // Then check via API for completed bookings that don't have rating property
      await Promise.all(
        bookingsData
          .filter(booking => {
            const normalizedStatus = String(booking.status || '').toLowerCase().replace(/[\s_-]+/g, '_').trim();
            const isCompleted = normalizedStatus === 'completed';
            const alreadyHasRating = booking.rating || booking.has_rating || booking.user_rating || ratingsSet.has(booking.id);
            return isCompleted && !alreadyHasRating;
          })
          .map(async (booking) => {
            try {
              const ratingRes = await ratingAPI.getByBooking(booking.id);
              if (ratingRes.data?.data?.rating || ratingRes.data?.rating || ratingRes.data?.data) {
                ratingsSet.add(booking.id);
              }
            } catch (error) {
              // If error is 404, no rating exists (which is fine)
              // Other errors we can ignore for this check
              if (error.response?.status !== 404) {
                console.warn('Error checking rating for booking:', booking.id, error);
              }
            }
          })
      );
      setBookingsWithRatings(ratingsSet);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(t('dashboard.user.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending_provider_accept: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      in_progress: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancelBooking = (booking) => {
    if (!booking || !booking.status) {
      console.log('🔴 CANCEL CHECK - No booking or status:', booking?.id);
      return false;
    }
    
    // Normalize status: convert to lowercase and replace spaces/underscores
    const normalizeStatus = (status) => {
      if (!status) return '';
      return String(status).toLowerCase().replace(/[\s_]+/g, '_').trim();
    };
    
    const bookingStatus = normalizeStatus(booking.status);
    const originalStatus = booking.status;
    
    console.log('🔍 CANCEL CHECK:', {
      bookingId: booking.id,
      originalStatus: originalStatus,
      normalizedStatus: bookingStatus,
      serviceName: booking.service?.name
    });
    
    // Always allow cancellation for pending statuses (regardless of time)
    if (bookingStatus === 'pending' || bookingStatus === 'pending_provider_accept') {
      console.log('✅ CANCEL ALLOWED - PENDING status');
      return true;
    }
    
    // For confirmed status, check if booking is more than 2 hours away
    if (bookingStatus === 'confirmed') {
      try {
        let bookingDateTime;
        
        if (booking.booking_date && booking.booking_time) {
          const dateStr = booking.booking_date;
          const timeStr = booking.booking_time;
          bookingDateTime = new Date(`${dateStr}T${timeStr}`);
          if (isNaN(bookingDateTime.getTime())) {
            bookingDateTime = new Date(`${dateStr} ${timeStr}`);
          }
        } else if (booking.booking_date) {
          bookingDateTime = new Date(booking.booking_date);
        } else {
          console.log('❌ CANCEL DENIED - No date/time for confirmed booking');
          return false;
        }
        
        if (isNaN(bookingDateTime.getTime())) {
          console.log('❌ CANCEL DENIED - Invalid date');
          return false;
        }
        
        const now = new Date();
        const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
        const canCancel = hoursUntilBooking > 2;
        
        console.log('📅 CANCEL CHECK - Confirmed booking:', {
          hoursUntilBooking: hoursUntilBooking.toFixed(2),
          canCancel
        });
        
        return canCancel;
      } catch (error) {
        console.log('❌ CANCEL DENIED - Date parse error:', error);
        return false;
      }
    }
    
    console.log('❌ CANCEL DENIED - Status not cancellable:', bookingStatus);
    return false;
  };

  const handleCancelBooking = (bookingId) => {
    console.log('Opening cancellation modal for booking:', bookingId);
    setCancellationModal({ isOpen: true, bookingId });
  };

  const handleBookingClick = (bookingId) => {
    navigate(`/booking/details/${bookingId}`);
  };

  const handleConfirmCancellation = async (reasonData) => {
    try {
      setCancelling(true);
      await bookingAPI.cancel(cancellationModal.bookingId, reasonData);
      
      // Refresh bookings data
      await fetchDashboardData();
      
      toast.success(t('booking.cancellation.success'));
      setCancellationModal({ isOpen: false, bookingId: null });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || t('booking.cancellation.error'));
    } finally {
      setCancelling(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Hide middle digits for privacy
    return phone.replace(/(\+\d{3})\d{4}(\d{3})/, '$1****$2');
  };

  const handleRateService = (booking) => {
    setRatingModal({ isOpen: true, booking });
  };

  const handleRatingSubmitted = async () => {
    // Add the booking to the ratings set immediately (before closing modal)
    if (ratingModal.booking?.id) {
      setBookingsWithRatings(prev => new Set([...prev, ratingModal.booking.id]));
    }
    // Close the modal first
    setRatingModal({ isOpen: false, booking: null });
    // Then refresh bookings data to show updated rating status
    await fetchDashboardData();
  };

  const handleCloseRatingModal = () => {
    setRatingModal({ isOpen: false, booking: null });
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('dashboard.user.welcome', { name: user?.first_name })}</h1>
            <p className="text-gray-600">{t('dashboard.user.subtitle')}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/services" 
              className="btn-primary flex items-center space-x-2"
            >
              <HiShoppingBag className="w-5 h-5" />
              <span>{t('dashboard.user.browse_services')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div key={index} className="card p-6">
              <Skeleton height={60} />
            </div>
          ))
        ) : (
          <>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.user.stats.total_bookings')}</h2>
                <HiCalendar className="text-primary-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.total_bookings || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.user.stats.upcoming')}</h2>
                <HiClock className="text-blue-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.upcoming_bookings || 0}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.user.stats.total_spent')}</h2>
                <HiCurrencyDollar className="text-green-600 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatPrice(statistics?.total_spent || 0, i18n.language)}</p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">{t('dashboard.user.stats.reviews_given')}</h2>
                <HiStar className="text-yellow-500 w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.ratings_given || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">{t('dashboard.user.recent_bookings')}</h2>
        </div>
        
        {loading ? (
          <div className="p-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton height={80} />
              </div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="divide-y">
            {bookings.map(booking => (
              <div 
                key={booking.id} 
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleBookingClick(booking.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-lg mr-3">
                        {booking.service?.name || 'Service'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {(booking.status || '').replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{t('dashboard.user.booking.provider')}: {booking.provider?.business_name || 'N/A'}</p>
                      <p>{t('dashboard.user.booking.date')}: {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'} {booking.booking_time ? `at ${booking.booking_time}` : ''}</p>
                      <p>{t('dashboard.user.booking.location')}: {booking.service_address}</p>
                      
                      {/* Show provider phone only when booking is confirmed/accepted */}
                      {booking.status === 'confirmed' && booking.provider?.phone && (
                        <div className="flex items-center space-x-2 mt-2">
                          <HiPhone className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            {t('dashboard.user.booking.provider_phone')}: {booking.provider.phone}
                          </span>
                        </div>
                      )}
                      
                      {/* Show status-specific messages */}
                      {booking.status === 'pending_provider_accept' && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                          {t('dashboard.user.booking.waiting_provider_accept')}
                        </div>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                          {t('dashboard.user.booking.provider_accepted')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">{formatPrice(booking.total_price)}</p>
                    <p className="text-sm text-gray-500">{booking.booking_number}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  {(() => {
                    // Normalize status for comparison - handle various formats
                    const normalizeStatus = (status) => {
                      if (!status) return '';
                      return String(status).toLowerCase().replace(/[\s_-]+/g, '_').trim();
                    };
                    const normalizedStatus = normalizeStatus(booking.status);
                    const isCompleted = normalizedStatus === 'completed';
                    // Check multiple sources for rating existence
                    const hasRating = bookingsWithRatings.has(booking.id) || 
                                     booking.rating || 
                                     booking.has_rating || 
                                     booking.user_rating;
                    
                    // Show rate button only for completed bookings that don't have a rating yet
                    if (isCompleted && !hasRating) {
                      return (
                        <button 
                          className="btn-primary text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateService(booking);
                          }}
                        >
                          {t('dashboard.user.rate_service')}
                        </button>
                      );
                    }
                    
                    // Show message if already rated
                    if (isCompleted && hasRating) {
                      return (
                        <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded">
                          <HiStar className="w-4 h-4 text-yellow-500 mr-2" />
                          {t('dashboard.user.already_rated')}
                        </div>
                      );
                    }
                    
                    return null;
                  })()}
                  
                  {(() => {
                    const showCancel = canCancelBooking(booking);
                    console.log(`🎯 RENDER CHECK - Booking ${booking.id} (${booking.status}): showCancel =`, showCancel);
                    return showCancel ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🚀 Cancel button clicked for booking:', booking.id);
                          handleCancelBooking(booking.id);
                        }}
                        className="btn-secondary text-sm text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center"
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <HiX className="w-4 h-4 mr-1" />
                        {t('booking.cancel')}
                      </button>
                    ) : null;
                  })()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">{t('dashboard.user.no_bookings')}</p>
            <Link to="/services" className="btn-primary">
              {t('dashboard.user.browse_services')}
            </Link>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={cancellationModal.isOpen}
        onClose={() => setCancellationModal({ isOpen: false, bookingId: null })}
        onConfirm={handleConfirmCancellation}
        loading={cancelling}
      />

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={handleCloseRatingModal}
        booking={ratingModal.booking}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};

export default UserDashboard;