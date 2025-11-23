import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiX, HiExclamation } from 'react-icons/hi';

const CancellationModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const cancellationReasons = [
    { value: 'rescheduled', label: t('booking.cancellation.reasons.rescheduled') },
    { value: 'price_issue', label: t('booking.cancellation.reasons.price_issue') },
    { value: 'found_someone_else', label: t('booking.cancellation.reasons.found_someone_else') },
    { value: 'no_longer_needed', label: t('booking.cancellation.reasons.no_longer_needed') },
    { value: 'provider_unavailable', label: t('booking.cancellation.reasons.provider_unavailable') },
    { value: 'location_issue', label: t('booking.cancellation.reasons.location_issue') },
    { value: 'other', label: t('booking.cancellation.reasons.other') },
  ];

  const handleConfirm = () => {
    if (!selectedReason) {
      return;
    }

    const reasonData = {
      reason: selectedReason,
      custom_reason: selectedReason === 'other' ? customReason : null,
    };

    onConfirm(reasonData);
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  if (!isOpen) {
    console.log('CancellationModal: isOpen is false, not rendering');
    return null;
  }

  console.log('CancellationModal: Rendering modal');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <HiExclamation className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('booking.cancellation.title')}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            {t('booking.cancellation.description')}
          </p>

          <div className="space-y-3 mb-6">
            {cancellationReasons.map((reason) => (
              <label
                key={reason.value}
                className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedReason === reason.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="cancellation_reason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{reason.label}</span>
              </label>
            ))}
          </div>

          {selectedReason === 'other' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.cancellation.custom_reason_label')}
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                placeholder={t('booking.cancellation.custom_reason_placeholder')}
              />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedReason || loading || (selectedReason === 'other' && !customReason.trim())}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('booking.cancellation.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
