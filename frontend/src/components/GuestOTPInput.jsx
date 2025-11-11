import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const GuestOTPInput = ({ 
  onOTPSubmit, 
  onResendOTP, 
  phone, 
  loading = false,
  error = null 
}) => {
  const { t, i18n } = useTranslation();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Convert numbers to Arabic numerals when language is Arabic
  const toArabicNumerals = (num) => {
    if (i18n.language === 'ar') {
      return num.toString().replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
    }
    return num;
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onOTPSubmit(otp);
    }
  };

  const handleResend = () => {
    if (canResend) {
      onResendOTP();
      setTimeLeft(600); // Reset to 10 minutes
      setCanResend(false);
      setOtp('');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${toArabicNumerals(minutes)}:${toArabicNumerals(remainingSeconds.toString().padStart(2, '0'))}`;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('home.guest_booking.title')}
        </h3>
        <p className="text-gray-600">
          {t('home.guest_booking.subtitle')}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {t('home.guest_booking.otp_sent')}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              {phone}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('home.guest_booking.otp_required')}
          </label>
          <input
            type="text"
            value={otp}
            onChange={handleOTPChange}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            maxLength={6}
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-600">
              {t('home.guest_booking.otp_countdown', { 
                minutes: Math.floor(timeLeft / 60), 
                seconds: timeLeft % 60 
              })}
            </p>
          ) : (
            <p className="text-sm text-red-600">
              {t('home.guest_booking.otp_expired')}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={otp.length !== 6 || loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('common.loading') : t('booking.steps.verification')}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || loading}
            className={`text-sm font-medium ${
              canResend 
                ? 'text-primary-600 hover:text-primary-500' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {canResend 
              ? t('home.guest_booking.resend_otp')
              : t('home.guest_booking.resend_in', { seconds: timeLeft })
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestOTPInput;
