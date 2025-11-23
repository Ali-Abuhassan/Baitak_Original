import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiX, HiStar, HiCheckCircle } from 'react-icons/hi';
import { ratingAPI } from '../../services/api';
import toast from 'react-hot-toast';

const RatingModal = ({ isOpen, onClose, booking, onRatingSubmitted }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error(t('rating.please_select_rating'));
      return;
    }

    if (!review.trim()) {
      toast.error(t('rating.please_write_review'));
      return;
    }

    try {
      setLoading(true);
      
      const ratingData = {
        booking_id: booking.id,
        rating: rating,
        review: review.trim()
      };

      await ratingAPI.create(ratingData);
      
      toast.success(t('rating.submitted_successfully'));
      onRatingSubmitted && onRatingSubmitted();
      handleClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Check if error is because rating already exists
      if (error.response?.status === 400 || error.response?.status === 409) {
        const errorMessage = error.response?.data?.message || '';
        if (errorMessage.toLowerCase().includes('already') || errorMessage.toLowerCase().includes('rated')) {
          toast.error(t('rating.already_rated_error'));
          handleClose();
          return;
        }
      }
      toast.error(error.response?.data?.message || t('rating.submission_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    setHoveredRating(0);
    onClose();
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return t('rating.very_poor');
      case 2: return t('rating.poor');
      case 3: return t('rating.average');
      case 4: return t('rating.good');
      case 5: return t('rating.excellent');
      default: return '';
    }
  };

  if (!isOpen) {
    console.log('RatingModal: isOpen is false, not rendering');
    return null;
  }

  console.log('RatingModal: Rendering modal for booking:', booking?.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('rating.rate_service')}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Service Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{booking?.service?.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
              {t('rating.booking_number')}: {booking?.booking_number}
            </p>
            <p className="text-sm text-gray-600">
              {t('rating.provider')}: {booking?.provider?.first_name} {booking?.provider?.last_name}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Rating Stars */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('rating.your_rating')} *
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <HiStar
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {getRatingText(rating)}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                {t('rating.your_review')} *
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder={t('rating.review_placeholder')}
                disabled={loading}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  {t('rating.review_help')}
                </p>
                <span className="text-xs text-gray-400">
                  {review.length}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                disabled={loading}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0 || !review.trim()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('common.submitting')}
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-4 h-4 mr-2" />
                    {t('rating.submit_rating')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
