import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { providerAPI, categoryAPI, locationAPI } from '../utils/api';
import { useTranslation } from 'react-i18next';
import { HiStar, HiClock, HiCurrencyDollar, HiLocationMarker, HiFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CityDropdown from '../components/CityDropdown';
import AreaDropdown from '../components/AreaDropdown';

const Providers = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [providers, setProviders] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCitySlug, setSelectedCitySlug] = useState('');
  const [filters, setFilters] = useState({
    min_rating: '',
    max_price: '',
    city: '',
    area: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  // Convert numbers to Arabic numerals when language is Arabic
  const toArabicNumerals = (num) => {
    if (i18n.language === 'ar') {
      return num.toString().replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
    }
    return num;
  };

  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug) {
      fetchCategoryAndProviders(categorySlug);
    } else {
      // If no category parameter, show empty state
      setProviders([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCitySlug) {
      fetchAreas(selectedCitySlug);
    } else {
      setAreas([]);
    }
  }, [selectedCitySlug]);

  const fetchCities = async () => {
    try {
      const response = await locationAPI.getCities();
      if (response.data.success) {
        setCities(response.data.data.cities || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchAreas = async (citySlug) => {
    try {
      const response = await locationAPI.getAreasByCity(citySlug);
      if (response.data.success) {
        setAreas(response.data.data.areas || []);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    }
  };

  const fetchCategoryAndProviders = async (categorySlug) => {
    try {
      setLoading(true);
      
      // First, get category by slug to get the category ID
      const categoryRes = await categoryAPI.getBySlug(categorySlug);
      if (!categoryRes.data.success) {
        throw new Error('Category not found');
      }
      
      const category = categoryRes.data.data.category;
      setCategory(category);
      
      // Convert city and area slugs to IDs for API
      const apiFilters = { ...filters };
      if (apiFilters.city) {
        const city = cities.find(c => c.slug === apiFilters.city);
        if (city) {
          apiFilters.city_id = city.id;
        }
        delete apiFilters.city;
      }
      if (apiFilters.area) {
        const area = areas.find(a => a.slug === apiFilters.area);
        if (area) {
          apiFilters.area_id = area.id;
        }
        delete apiFilters.area;
      }
      
      // Now fetch providers by category ID
      const providersRes = await providerAPI.getByCategory(category.id, apiFilters);
      console.log('Providers API Response:', providersRes.data);
      
      if (providersRes.data.success) {
        // The API returns providers directly in data array, not nested under data.providers
        const providersData = providersRes.data.data || [];
        console.log('Providers Data:', providersData);
        setProviders(Array.isArray(providersData) ? providersData : []);
        
        // Use pagination object from response
        const paginationData = providersRes.data.pagination || {};
        setPagination({
          current_page: paginationData.current_page || 1,
          last_page: paginationData.total_pages || 1,
          total: paginationData.total_items || 0
        });
      } else {
        console.log('API returned success: false');
        setProviders([]);
        setPagination({ current_page: 1, last_page: 1, total: 0 });
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load providers');
      setProviders([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleCityChange = (e) => {
    const citySlug = e.target.value;
    
    setSelectedCitySlug(citySlug);
    setFilters(prev => ({
      ...prev,
      city: citySlug,
      area: '', // Reset area when city changes
      page: 1
    }));
  };

  const handleAreaChange = (e) => {
    const areaSlug = e.target.value;
    
    setFilters(prev => ({
      ...prev,
      area: areaSlug,
      page: 1
    }));
  };

  const applyFilters = () => {
    const categorySlug = searchParams.get('category');
    if (categorySlug) {
      fetchCategoryAndProviders(categorySlug);
    }
  };

  const clearFilters = () => {
    setFilters({
      min_rating: '',
      max_price: '',
      city: '',
      area: '',
      page: 1,
      limit: 12
    });
    setSelectedCitySlug('');
    setAreas([]);
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category ? `${t('providers.title')} - ${category.name}` : t('providers.title')}
          </h1>
          <p className="text-gray-600">
            {t('providers.subtitle')} {category?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{t('providers.filters')}</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {t('common.clear')}
                </button>
              </div>

              <div className="space-y-4">
                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('providers.minRating')}
                  </label>
                  <select
                    value={filters.min_rating}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                    className="w-full input"
                  >
                    <option value="">{t('providers.anyRating')}</option>
                    <option value="3">3+ {t('providers.stars')}</option>
                    <option value="4">4+ {t('providers.stars')}</option>
                    <option value="4.5">4.5+ {t('providers.stars')}</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('providers.maxPrice')}
                  </label>
                  <input
                    type="number"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    placeholder={t('providers.anyPrice')}
                    className="w-full input"
                  />
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.city')}
                  </label>
                  <CityDropdown
                    value={selectedCitySlug}
                    onChange={handleCityChange}
                    className="w-full"
                  />
                </div>

                {/* Area Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.area')}
                  </label>
                  <AreaDropdown
                    value={filters.area}
                    onChange={handleAreaChange}
                    citySlug={selectedCitySlug}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full btn-primary"
                >
                  {t('common.apply')}
                </button>
              </div>
            </div>
          </div>

          {/* Providers Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card p-6">
                    <Skeleton height={200} />
                  </div>
                ))}
              </div>
            ) : providers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {providers.map((provider) => {
                    // Debug: Log verification badges data
                    console.log('Provider verification badges:', provider.verification_badges);
                    return (
                    <div key={provider.id} className="card p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start mb-4">
                        <img
                          src={provider.user?.profile_image 
                            ? `/uploads/profiles/${provider.user.profile_image}`
                            : `https://ui-avatars.com/api/?name=${provider.user?.first_name}+${provider.user?.last_name}&background=random`}
                          alt={provider.business_name}
                          className="w-16 h-16 rounded-full mr-4 object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {provider.business_name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {provider.user?.first_name} {provider.user?.last_name}
                          </p>
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <HiStar
                                  key={i}
                                  className={i < Math.floor(provider.rating_avg || 0) ? 'fill-current' : 'fill-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {toArabicNumerals(provider.rating_avg || 0)} ({toArabicNumerals(provider.rating_count || 0)} {t('providers.reviews')})
                            </span>
                          </div>
                          
                          {/* Verification Badges */}
                          {(() => {
                            // Use verification_badges if available, otherwise create from individual flags
                            let badges = [];
                            if (provider.verification_badges && provider.verification_badges.length > 0) {
                              badges = provider.verification_badges;
                            } else {
                              // Create badges from individual verification flags
                              if (provider.is_id_verified) {
                                badges.push({
                                  icon: '🆔',
                                  label: 'ID Verified',
                                  description: 'This provider has verified their identity'
                                });
                              }
                              if (provider.is_license_verified) {
                                badges.push({
                                  icon: '📜',
                                  label: 'Vocational License',
                                  description: 'This provider holds a valid vocational license'
                                });
                              }
                              if (provider.is_police_clearance_verified) {
                                badges.push({
                                  icon: '✅',
                                  label: 'Police Clearance',
                                  description: 'This provider has a clean police record'
                                });
                              }
                            }
                            
                            return badges.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {badges.slice(0, 3).map((badge, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1  text-green-700 rounded-full px-2 py-0.5 text-xs font-medium"
                                    title={badge.description}
                                  >
                                    <span>{badge.icon}</span>
                                    <span className="hidden sm:inline">{badge.label}</span>
                                  </div>
                                ))}
                                {badges.length > 3 && (
                                  <div className="flex items-center bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">
                                    +{badges.length - 3}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {provider.bio}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <HiClock className="w-4 h-4 mr-2" />
                          <span>{t('providers.experience')}: {toArabicNumerals(provider.experience_years)} {t('providers.years')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <HiCurrencyDollar className="w-4 h-4 mr-2" />
                          <span>{t('providers.hourlyRate')}: {toArabicNumerals(provider.hourly_rate)} {t('common.currency')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <HiLocationMarker className="w-4 h-4 mr-2" />
                          <span>{t('providers.available')}: {toArabicNumerals(Array.isArray(provider.available_days) ? provider.available_days.length : 0)} {t('providers.daysWeek')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {t('providers.bookings')}: {toArabicNumerals(provider.total_bookings || 0)}
                        </div>
                        <button
                          onClick={() => navigate(`/providers/${provider.id}`)}
                          className="btn-primary text-sm"
                        >
                          {t('providers.viewProfile')}
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('common.previous')}
                    </button>
                    
                    {[...Array(pagination.last_page)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm rounded ${
                            page === pagination.current_page
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {toArabicNumerals(page)}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('common.next')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('providers.noProviders')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('providers.noProvidersDesc')}
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  {t('providers.browseAll')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Providers;
