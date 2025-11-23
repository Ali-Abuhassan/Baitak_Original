import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { providerAPI, serviceAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';
import { 
  HiStar, 
  HiLocationMarker, 
  HiClock, 
  HiCurrencyDollar,
  HiCheckCircle,
  HiBriefcase,
  HiChat,
  HiCalendar
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProviderProfile = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderDetails();
  }, [id]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getById(id);
      
      // Handle the API response structure: { success: true, data: { provider: {...} } }
      const providerData = response.data?.data?.provider || 
                          response.data?.provider || 
                          response.data || null;
      setProvider(providerData);
    } catch (error) {
      console.error('Error fetching provider:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(t('providerProfile.errors.loadFailed'));
      
      // Set null provider on error
      setProvider(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton height={400} />
            </div>
            <div className="lg:col-span-2">
              <Skeleton height={600} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('providerProfile.providerNotFound')}</h2>
          <Link to="/services" className="btn-primary">
            {t('providerProfile.browseServices')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <img
              src={provider.user?.profile_image 
                ? `/uploads/profiles/${provider.user.profile_image}`
                : `https://ui-avatars.com/api/?name=${provider.user?.first_name}+${provider.user?.last_name}&background=random&size=200`}
              alt={provider.business_name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{provider.business_name}</h1>
              <p className="text-xl mb-4">
                {provider.user?.first_name} {provider.user?.last_name}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <HiLocationMarker className="mr-1" />
                  {provider.user?.city?.name_en || provider.user?.city}, {provider.user?.area?.name_en || provider.user?.area}
                </div>
                <div className="flex items-center">
                  <HiBriefcase className="mr-1" />
                  {provider.experience_years} {t('providerProfile.yearsExperience')}
                </div>
                <div className="flex items-center">
                  <HiStar className="mr-1 text-yellow-400" />
                  {provider.rating_avg || 0} ({provider.rating_count || 0} {t('providerProfile.reviews')})
                </div>
              </div>
              
              {/* Verification Badges */}
              {provider.verification_badges && provider.verification_badges.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {provider.verification_badges.map((badge, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium"
                        title={badge.description}
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span>{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <h3 className="font-semibold mb-4">{t('providerProfile.about')}</h3>
              <p className="text-gray-600 mb-4">{provider.bio}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">{t('providerProfile.languages')}</p>
                  <p className="font-medium">
                    {Array.isArray(provider.languages) 
                      ? provider.languages.join(', ') 
                      : provider.languages || t('providerProfile.defaultLanguage')
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('providerProfile.serviceAreas')}</p>
                  <p className="font-medium">
                    {Array.isArray(provider.service_areas) 
                      ? provider.service_areas.join(', ') 
                      : provider.service_areas || t('providerProfile.allAreas')
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('providerProfile.workingHours')}</p>
                  <p className="font-medium">
                    {provider.working_hours?.start} - {provider.working_hours?.end}
                  </p>
                </div>
                
                {/* Verification Badges */}
                {provider.verification_badges && provider.verification_badges.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{t('providerProfile.verification')}</p>
                    <div className="space-y-2">
                      {provider.verification_badges.map((badge, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <span className="text-lg">{badge.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-green-800">{badge.label}</p>
                            <p className="text-xs text-green-600">{badge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">{t('providerProfile.availableDays')}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                      <span
                        key={day}
                        className={`px-2 py-1 text-xs rounded ${
                          provider.available_days?.includes(day)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {day.slice(0, 3).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">{t('providerProfile.badges')}</h3>
              <div className="space-y-2">
                {provider.instant_booking && (
                  <div className="flex items-center text-sm">
                    <HiCheckCircle className="text-green-500 mr-2" />
                    {t('providerProfile.instantBooking')}
                  </div>
                )}
                {provider.is_verified && (
                  <div className="flex items-center text-sm">
                    <HiCheckCircle className="text-blue-500 mr-2" />
                    {t('providerProfile.verifiedProvider')}
                  </div>
                )}
                {provider.rating_avg >= 4.5 && (
                  <div className="flex items-center text-sm">
                    <HiStar className="text-yellow-500 mr-2" />
                    {t('providerProfile.topRated')}
                  </div>
                )}
                {provider.total_bookings > 100 && (
                  <div className="flex items-center text-sm">
                    <HiCalendar className="text-green-500 mr-2" />
                    {t('providerProfile.completedJobs')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex space-x-8">
                {['services', 'portfolio', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t(`providerProfile.tabs.${tab}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                {provider.services?.length > 0 ? (
                  provider.services.map(service => (
                    <div key={service.id} className="card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                          <p className="text-gray-600 mb-2">{service.description}</p>
                          <p className="text-sm text-gray-500">
                            {t('providerProfile.category')}: {service.category_other || service.category?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            {formatPrice(service.base_price, i18n.language)}
                            {service.price_type === 'hourly' && '/hr'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {Number(service.duration_hours) % 1 === 0 ? Number(service.duration_hours) : Number(service.duration_hours).toFixed(1)} {t('providerProfile.hours')}
                          </p>
                        </div>
                      </div>
                      
                      {service.packages && service.packages.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="font-medium mb-2">{t('providerProfile.availablePackages')}:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {service.packages.map((pkg, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium">{pkg.name}</span>
                                  <span className="font-bold">{formatPrice(pkg.price, i18n.language)}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                                {pkg.features && pkg.features.length > 0 && (
                                  <ul className="text-xs text-gray-500 space-y-1">
                                    {pkg.features.map((feature, idx) => (
                                      <li key={idx} className="flex items-center">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {service.add_ons && service.add_ons.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="font-medium mb-2">{t('providerProfile.availableAddons')}:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {service.add_ons.map((addon, index) => (
                              <div key={index} className="bg-blue-50 p-3 rounded">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium">{addon.name}</span>
                                  <span className="font-bold text-blue-600">+{formatPrice(addon.price, i18n.language)}</span>
                                </div>
                                <p className="text-sm text-gray-600">{addon.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Link
                          to={`/booking/${service.id}`}
                          className="btn-primary text-sm"
                        >
{t('providerProfile.bookThisService')}
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-gray-500">{t('providerProfile.noServices')}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                {provider.portfolio_images?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {provider.portfolio_images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={`/uploads/portfolios/${image}`}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-gray-500">{t('providerProfile.noPortfolio')}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {provider.ratings_received?.length > 0 ? (
                  <>
                    {/* Reviews Summary */}
                    <div className="card p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{t('providerProfile.customerReviews')}</h3>
                          <div className="flex items-center mt-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <HiStar
                                  key={i}
                                  className={i < Math.floor(parseFloat(provider.rating_avg)) ? 'fill-current' : 'fill-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-lg font-semibold">{provider.rating_avg}</span>
                            <span className="ml-2 text-gray-500">({provider.rating_count} {t('providerProfile.reviews')})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{t('providerProfile.totalBookings')}</p>
                          <p className="text-2xl font-bold text-primary-600">{provider.total_bookings}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Individual Reviews */}
                    {provider.ratings_received.map(rating => (
                      <div key={rating.id} className="card p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium">
                              {rating.customer?.first_name} {rating.customer?.last_name}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <HiStar
                                    key={i}
                                    className={i < rating.rating ? 'fill-current' : 'fill-gray-300'}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(rating.created_at).toLocaleDateString()}
                              </span>
                              {rating.is_verified_purchase && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {t('providerProfile.verifiedPurchase')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{rating.review}</p>
                        
                        {rating.images && rating.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                            {rating.images.map((image, idx) => (
                              <img
                                key={idx}
                                src={`/uploads/reviews/${image}`}
                                alt={`Review image ${idx + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                        
                        {rating.provider_response && (
                          <div className="mt-4 pl-4 border-l-2 border-primary-200 bg-primary-50 p-3 rounded">
                            <p className="text-sm font-medium text-primary-700 mb-1">
                              {t('providerProfile.providerResponse')}:
                            </p>
                            <p className="text-sm text-primary-600">{rating.provider_response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-gray-500">{t('providerProfile.noReviews')}</p>
                    <p className="text-sm text-gray-400 mt-2">{t('providerProfile.firstReview')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;