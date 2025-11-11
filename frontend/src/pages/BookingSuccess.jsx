import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiCheckCircle, HiCalendar, HiPhone, HiHome } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const BookingSuccess = () => {
  const { t } = useTranslation();
  const { bookingId } = useParams();
  const { isAuthenticated } = useAuth();
  const [guestAccountCreated, setGuestAccountCreated] = React.useState(false);

  React.useEffect(() => {
    const guestPhone = localStorage.getItem('guest_phone');
    if (guestPhone) {
      setGuestAccountCreated(true);
      localStorage.removeItem('guest_phone');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('bookingSuccess.title')}
          </h1>
          
          <p className="text-gray-600 mb-2">
            {t('bookingSuccess.subtitle')}
          </p>
          
          {/* Only show 'account created' box for guest bookings */}
          {guestAccountCreated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    {t('bookingSuccess.accountCreated')}
                  </p>
                  <p className="text-sm text-green-600">
                    {t('bookingSuccess.accountCreatedDesc')}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">{t('bookingSuccess.bookingNumber')}</p>
            <p className="text-lg font-semibold text-gray-900">#{bookingId}</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-4">{t('bookingSuccess.whatHappensNext')}</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <HiPhone className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">{t('bookingSuccess.providerConfirmation')}</p>
                  <p className="text-sm text-blue-700">
                    {t('bookingSuccess.providerConfirmationText')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <HiCalendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">{t('bookingSuccess.serviceDay')}</p>
                  <p className="text-sm text-blue-700">
                    {t('bookingSuccess.serviceDayText')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <HiCheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">{t('bookingSuccess.payment')}</p>
                  <p className="text-sm text-blue-700">
                    {t('bookingSuccess.paymentText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {!isAuthenticated && (
              <Link to="/login" className="btn-primary w-full">
                {t('bookingSuccess.loginToViewBookings')}
              </Link>
            )}
            <Link to="/" className="btn-outline w-full">
              <HiHome className="mr-2 inline" />
              {t('bookingSuccess.backToHome')}
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('bookingSuccess.needHelp')} {' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('bookingSuccess.contactSupport')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
