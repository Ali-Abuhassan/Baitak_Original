import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI } from '../../services/api';
import { 
  HiArrowLeft, 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiUser, 
  HiPhone, 
  HiMail, 
  HiCurrencyDollar,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    } else {
      setBooking(null);
      setLoading(false);
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getById(id);
      
      // Handle the actual API response structure
      const bookingData = response.data?.data?.booking || response.data?.booking || response.data;
      
      if (bookingData && bookingData.id) {
        setBooking(bookingData);
      } else {
        console.error('Invalid booking data structure:', bookingData);
        setBooking(null);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error(t('bookingDetails.errors.loadFailed'));
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const colors = {
      pending_provider_accept: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      provider_on_way: 'bg-indigo-100 text-indigo-800',
      provider_arrived: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      in_progress: 'bg-green-100 text-green-800',
      refunded: 'bg-gray-200 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_provider_accept':
        return <HiExclamationCircle className="w-5 h-5" />;
      case 'confirmed':
        return <HiCheckCircle className="w-5 h-5" />;
      case 'in_progress':
        return <HiClock className="w-5 h-5" />;
      case 'completed':
        return <HiCheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <HiXCircle className="w-5 h-5" />;
      case 'provider_on_way':
        return <HiClock className="w-5 h-5" />;
      case 'provider_arrived':
        return <HiCheckCircle className="w-5 h-5" />;
      case 'refunded':
        return <HiExclamationCircle className="w-5 h-5" />;
      default:
        return <HiExclamationCircle className="w-5 h-5" />;
    }
  };

  const translateStatus = (status) => {
    if (!status) return '';
    const key = `dashboard.todays_bookings.status_${status}`;
    const value = t(key);
    // If key not found, fallback to prettified status
    if (value === key) {
      return status.replace(/_/g, ' ').toUpperCase();
    }
    return value;
  };


  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Hide middle digits for privacy
    return phone.replace(/(\+\d{3})\d{4}(\d{3})/, '$1****$2');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="mb-6">
          <Skeleton height={40} width={200} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <Skeleton height={300} />
            </div>
          </div>
          <div>
            <div className="card p-6">
              <Skeleton height={200} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking || !booking.id) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('bookingDetails.bookingNotFound')}</h1>
          <p className="text-gray-600 mb-6">{t('bookingDetails.bookingNotFoundDesc')}</p>
          <Link to="/dashboard" className="btn-primary">
            {t('bookingDetails.backToDashboard')}
          </Link>
        </div>
      </div>
    );
  }

  const isProvider = user?.role === 'provider';
  const isCustomer = user?.role === 'customer';

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <HiArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')}
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {booking.service?.name || t('bookingDetails.title')}
            </h1>
            <p className="text-gray-600">
              {t('bookingDetails.bookingNumber', { number: booking.booking_number })}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(booking?.status)}`}>
              {getStatusIcon(booking?.status)}
              <span>{translateStatus(booking?.status) || 'UNKNOWN'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">{t('bookingDetails.bookingInformation')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <HiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.date')}</p>
                    <p className="font-medium">{formatDate(booking?.booking_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <HiClock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.time')}</p>
                    <p className="font-medium">{formatTime(booking?.booking_time)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <HiLocationMarker className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.location')}</p>
                    <p className="font-medium">{booking?.service_address || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{booking?.service_city || 'N/A'}, {booking?.service_area || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <HiCurrencyDollar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.totalPrice')}</p>
                    <p className="font-medium text-lg">{formatPrice(booking?.total_price || 0, i18n.language)}</p>
                  </div>
                </div>
                
                {(booking?.duration || booking?.duration_hours) && (
                  <div className="flex items-center space-x-3">
                    <HiClock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">{t('bookingDetails.duration')}</p>
                      <p className="font-medium">{booking.duration || booking.duration_hours} {t('bookingDetails.hours')}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <HiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.created')}</p>
                    <p className="font-medium">{formatDate(booking?.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          {booking.service && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">{t('bookingDetails.serviceDetails')}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{booking.service.name}</h3>
                  {booking.service.description && (
                    <p className="text-gray-600">{booking.service.description}</p>
                  )}
                </div>
                
                {(booking.service.category || booking.service.category_other) && (
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.category')}</p>
                    <p className="font-medium">{booking.service.category_other || booking.service.category?.name}</p>
                  </div>
                )}
                
                {(booking.package_name || booking.package_selected) && (
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.package')}</p>
                    <p className="font-medium">{booking.package_name || booking.package_selected}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Notes */}
          {booking.customer_notes && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">{t('bookingDetails.specialInstructions')}</h2>
              <p className="text-gray-600">{booking.customer_notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isProvider ? t('bookingDetails.customerInformation') : t('bookingDetails.providerInformation')}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <HiUser className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">
                    {isProvider 
                      ? `${booking.customer?.first_name || ''} ${booking.customer?.last_name || ''}`.trim()
                      : `${booking.provider?.user?.first_name || booking.provider?.first_name || ''} ${booking.provider?.user?.last_name || booking.provider?.last_name || ''}`.trim()
                    }
                  </p>
                  {isProvider && booking.provider?.business_name && (
                    <p className="text-sm text-gray-500">{booking.provider.business_name}</p>
                  )}
                </div>
              </div>
              
              {(isProvider ? booking.customer?.phone : (booking.provider?.phone || booking.provider?.user?.phone)) && (
                <div className="flex items-center space-x-3">
                  <HiPhone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.phone')}</p>
                    <a 
                      href={`tel:${isProvider ? booking.customer?.phone : (booking.provider?.phone || booking.provider?.user?.phone)}`}
                      className="font-medium hover:text-primary-600"
                    >
                      {isProvider ? booking.customer?.phone : (booking.provider?.phone || booking.provider?.user?.phone)}
                    </a>
                  </div>
                </div>
              )}
              
              {(isProvider ? booking.customer?.email : booking.provider?.email) && (
                <div className="flex items-center space-x-3">
                  <HiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t('bookingDetails.email')}</p>
                    <a 
                      href={`mailto:${isProvider ? booking.customer?.email : booking.provider?.email}`}
                      className="font-medium hover:text-primary-600"
                    >
                      {isProvider ? booking.customer?.email : booking.provider?.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Status Messages */}
          
        </div>
      </div>

    </div>
  );
};

export default BookingDetails;
