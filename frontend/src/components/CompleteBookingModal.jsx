import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiX, HiCheckCircle } from 'react-icons/hi';
import { formatPrice } from '../utils/currency';

const CompleteBookingModal = ({ isOpen, onClose, onConfirm, booking, loading = false }) => {
  const { t, i18n } = useTranslation();
  const [amountPaid, setAmountPaid] = useState('');
  const [providerSatisfaction, setProviderSatisfaction] = useState('');
  const [errors, setErrors] = useState({});

  // Set default amount_paid to booking total_price when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      const defaultAmount = booking.total_price || booking.price || '';
      setAmountPaid(defaultAmount.toString());
      setProviderSatisfaction('');
      setErrors({});
    }
  }, [isOpen, booking]);

  const handleConfirm = () => {
    const newErrors = {};

    // Validate amount_paid (required)
    if (!amountPaid || amountPaid.trim() === '') {
      newErrors.amountPaid = t('booking.complete.amount_required');
    } else {
      const amount = parseFloat(amountPaid);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amountPaid = t('booking.complete.amount_invalid');
      }
    }

    // Validate provider_satisfaction (optional, but if provided must be valid)
    if (providerSatisfaction && providerSatisfaction.trim() !== '') {
      const satisfaction = parseFloat(providerSatisfaction);
      if (isNaN(satisfaction) || satisfaction < 0 || satisfaction > 5) {
        newErrors.providerSatisfaction = t('booking.complete.satisfaction_invalid');
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const completionData = {
      status: 'completed',
      amount_paid: parseFloat(amountPaid),
    };

    // Only include provider_satisfaction if it's provided
    if (providerSatisfaction && providerSatisfaction.trim() !== '') {
      completionData.provider_satisfaction = parseFloat(providerSatisfaction);
    }

    onConfirm(completionData);
  };

  const handleClose = () => {
    setAmountPaid('');
    setProviderSatisfaction('');
    setErrors({});
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('booking.complete.title')}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            {t('booking.complete.description')}
          </p>

          {/* Booking Info */}
          {booking && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{booking.service?.name}</h4>
              <p className="text-sm text-gray-600">
                {t('booking.complete.booking_total')}: {formatPrice(booking.total_price || booking.price || 0, i18n.language)}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Status Field (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.complete.status')}
              </label>
              <input
                type="text"
                value={t('booking.complete.status_completed')}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Amount Paid Field (required) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.complete.amount_paid')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountPaid}
                  onChange={(e) => {
                    setAmountPaid(e.target.value);
                    if (errors.amountPaid) {
                      setErrors(prev => ({ ...prev, amountPaid: '' }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.amountPaid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('booking.complete.amount_placeholder')}
                  disabled={loading}
                />
              </div>
              {errors.amountPaid && (
                <p className="mt-1 text-sm text-red-600">{errors.amountPaid}</p>
              )}
            </div>

            {/* Provider Satisfaction Field (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.complete.provider_satisfaction')} <span className="text-gray-500 text-xs">({t('booking.complete.optional')})</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={providerSatisfaction}
                onChange={(e) => {
                  setProviderSatisfaction(e.target.value);
                  if (errors.providerSatisfaction) {
                    setErrors(prev => ({ ...prev, providerSatisfaction: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.providerSatisfaction ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('booking.complete.satisfaction_placeholder')}
                disabled={loading}
              />
              {errors.providerSatisfaction && (
                <p className="mt-1 text-sm text-red-600">{errors.providerSatisfaction}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {t('booking.complete.satisfaction_help')}
              </p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !amountPaid}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <HiCheckCircle className="w-4 h-4 mr-2" />
                  {t('booking.complete.confirm')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteBookingModal;

