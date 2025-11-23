import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ratingAPI } from '../../services/api';
import { 
  HiStar, 
  HiUser, 
  HiCalendar, 
  HiThumbUp, 
  HiArrowLeft,
  HiFilter,
  HiSearch
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const { isProvider } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    if (isProvider) {
      fetchReviews();
    }
  }, [currentPage, ratingFilter, sortBy, sortOrder, isProvider]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 10,
        sort_by: sortBy,
        order: sortOrder,
        ...(ratingFilter !== 'all' && { rating: ratingFilter }),
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await ratingAPI.getMyReviews(params);
      
      setReviews(response.data.data);
      setTotalPages(response.data.pagination?.total_pages || 1);
      setTotalReviews(response.data.pagination?.total_reviews || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(t('dashboard.reviews.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews();
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return t('dashboard.reviews.very_poor');
      case 2: return t('dashboard.reviews.poor');
      case 3: return t('dashboard.reviews.average');
      case 4: return t('dashboard.reviews.good');
      case 5: return t('dashboard.reviews.excellent');
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'ar' ? 'ar-JO' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (!isProvider) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('dashboard.reviews.access_denied')}</h1>
          <p className="text-gray-600 mb-4">{t('dashboard.reviews.access_denied_desc')}</p>
          <Link to="/provider/dashboard" className="btn-primary">
            {t('dashboard.reviews.go_to_dashboard')}
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
            {t('common.back_to_dashboard')}
          </Link>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('dashboard.reviews.title')}</h1>
            <p className="text-gray-600">
              {totalReviews} {t('dashboard.reviews.total_reviews')} • {t('dashboard.reviews.average_rating')}: {calculateAverageRating()}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Summary */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Average Rating Card */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.reviews.overall_rating')}</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary-600">
                {calculateAverageRating()}
              </div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <HiStar
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(parseFloat(calculateAverageRating()))
                          ? 'fill-current'
                          : 'fill-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {totalReviews} {t('dashboard.reviews.reviews')}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.reviews.rating_distribution')}</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = getRatingDistribution()[rating];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{rating}</span>
                    <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="md:col-span-2">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('dashboard.reviews.search_placeholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('dashboard.reviews.all_ratings')}</option>
            <option value="5">{t('dashboard.reviews.five_stars')}</option>
            <option value="4">{t('dashboard.reviews.four_stars')}</option>
            <option value="3">{t('dashboard.reviews.three_stars')}</option>
            <option value="2">{t('dashboard.reviews.two_stars')}</option>
            <option value="1">{t('dashboard.reviews.one_star')}</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="created_at-DESC">{t('dashboard.reviews.newest_first')}</option>
            <option value="created_at-ASC">{t('dashboard.reviews.oldest_first')}</option>
            <option value="rating-DESC">{t('dashboard.reviews.highest_rating')}</option>
            <option value="rating-ASC">{t('dashboard.reviews.lowest_rating')}</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="card p-6">
              <Skeleton height={120} />
            </div>
          ))
        ) : reviews.length === 0 ? (
          <div className="card p-12 text-center">
            <HiStar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || ratingFilter !== 'all' 
                ? t('dashboard.reviews.no_reviews_found')
                : t('dashboard.reviews.no_reviews_yet')
              }
            </h3>
            <p className="text-gray-600">
              {searchTerm || ratingFilter !== 'all'
                ? t('dashboard.reviews.try_different_filters')
                : t('dashboard.reviews.reviews_will_appear_here')
              }
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <HiUser className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">
                        {review.customer?.first_name} {review.customer?.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <HiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-current' : 'fill-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`ml-2 font-medium ${getRatingColor(review.rating)}`}>
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.review}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <HiCalendar className="w-4 h-4" />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiThumbUp className="w-4 h-4" />
                      <span>{review.helpful_count} {t('dashboard.reviews.helpful')}</span>
                    </div>
                    {review.is_verified_purchase && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {t('dashboard.reviews.verified_purchase')}
                      </span>
                    )}
                  </div>
                </div>
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
            {t('common.previous')}
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            {t('common.page')} {currentPage} {t('common.of')} {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
