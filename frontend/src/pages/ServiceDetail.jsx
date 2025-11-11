import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviceAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';
import { 
  HiStar, 
  HiClock, 
  HiCurrencyDollar, 
  HiLocationMarker, 
  HiUser, 
  HiPhone, 
  HiMail, 
  HiCalendar,
  HiCheckCircle,
  HiXCircle,
  HiEye,
  HiHeart,
  HiShare,
  HiArrowLeft,
  HiChevronLeft,
  HiChevronRight,
  HiPlusCircle,
  HiMinusCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const ServiceDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [duration, setDuration] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  // Helper function to get image URL - handles both full URLs and relative paths
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If already a full URL (starts with http:// or https://), return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, construct the full URL
    return `${import.meta.env.VITE_API_URL}/uploads/services/${imagePath}`;
  };

  // Helper function to safely parse JSON strings to arrays
  const parseJsonField = (value, defaultValue = []) => {
    if (!value) return defaultValue;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // Helper function to safely parse packages and add_ons (can be JSON strings or arrays)
  const parseJsonArrayField = (value, defaultValue = []) => {
    if (!value) return defaultValue;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // Format duration to remove unnecessary decimal places
  const formatDuration = (duration) => {
    const num = Number(duration);
    if (isNaN(num)) return '0';
    // If it's a whole number, show without decimals, otherwise show 1 decimal place
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getById(id);
      const serviceData = response.data.data.service;
      setService(serviceData);
      
      // Don't auto-select package - make it optional
      // Set default duration
      setDuration(Number(serviceData.duration_hours) || 1);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error(t('serviceDetail.errors.loadFailed'));
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!service) return { base: 0, addons: 0, total: 0 };
    
    let basePrice = parseFloat(service.base_price);
    
    // Apply package pricing if selected
    const packages = parseJsonArrayField(service.packages, []);
    if (selectedPackage && packages.length > 0) {
      const selectedPkg = packages.find(p => p.name === selectedPackage);
      if (selectedPkg) {
        basePrice = parseFloat(selectedPkg.price);
      }
    }
    
    // Calculate add-ons price
    let addOnsPrice = 0;
    const addOns = parseJsonArrayField(service.add_ons, []);
    if (selectedAddOns.length > 0 && addOns.length > 0) {
      selectedAddOns.forEach(addonName => {
        const addon = addOns.find(a => a.name === addonName);
        if (addon) {
          addOnsPrice += parseFloat(addon.price);
        }
      });
    }
    
    // Calculate based on duration for hourly services
    let subtotal = basePrice;
    if (service.price_type === 'hourly') {
      subtotal = basePrice * duration;
    }
    subtotal += addOnsPrice;
    
    // Calculate total (no tax)
    const total = subtotal;
    
    return {
      base: basePrice,
      addons: addOnsPrice,
      subtotal,
      total
    };
  };

  const toggleAddOn = (addonName) => {
    setSelectedAddOns(prev => {
      if (prev.includes(addonName)) {
        return prev.filter(name => name !== addonName);
      } else {
        return [...prev, addonName];
      }
    });
  };

  const nextImage = () => {
    if (service?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === service.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (service?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? service.images.length - 1 : prev - 1
      );
    }
  };

  const handleBookNow = () => {
    const params = new URLSearchParams();
    if (selectedPackage) {
      params.append('package', selectedPackage);
    }
    if (selectedAddOns.length > 0) {
      params.append('addons', selectedAddOns.join(','));
    }
    if (service.price_type === 'hourly' && duration) {
      params.append('duration', duration.toString());
    }
    const queryString = params.toString();
    navigate(`/booking/${id}${queryString ? `?${queryString}` : ''}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: service.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('serviceDetail.linkCopied'));
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? t('serviceDetail.removedFromFavorites') : t('serviceDetail.addedToFavorites'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('serviceDetail.loading')}</p>
          <p className="text-sm text-gray-500 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('serviceDetail.serviceNotFound')}</h2>
          <p className="text-gray-600 mb-4">{t('serviceDetail.serviceId')}: {id}</p>
          <Link to="/services" className="btn-primary">
            {t('serviceDetail.browseServices')}
          </Link>
        </div>
      </div>
    );
  }

  const pricing = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <HiArrowLeft className="w-5 h-5 mr-2" />
{t('common.back')}
            </button>
            {/* <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  isFavorited ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <HiHeart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              >
                <HiShare className="w-5 h-5" />
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Images - Only show if images exist */}
            {service.images && service.images.length > 0 && (
              <div className="card p-0 overflow-hidden">
                <div className="relative">
                  <div className="relative h-96 bg-gray-200">
                    <img
                      src={getImageUrl(service.images[currentImageIndex])}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {service.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          <HiChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          <HiChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {service.images.length}
                    </div>
                  </div>
                  
                  {service.images.length > 1 && (
                    <div className="p-4">
                      <div className="flex gap-2 overflow-x-auto">
                        {service.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                              index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                            }`}
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={`${service.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Service Information */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                  <div className="flex items-center gap-4 text-[10px] sm:text-xs md:text-sm text-gray-600">
                    <span className="flex items-center">
                      <HiEye className="w-4 h-4 mr-1" />
                      {service.view_count || 0} {t('serviceDetail.views')}
                    </span>
                    <span className="flex items-center">
                      <HiCalendar className="w-4 h-4 mr-1" />
                      {service.booking_count || 0} {t('serviceDetail.bookings')}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {service.is_featured ? t('serviceDetail.featured') : t('serviceDetail.available')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-600">
                    {formatPrice(service.base_price, i18n.language)}
                    {service.price_type === 'hourly' && <span className="text-sm sm:text-base md:text-lg font-normal">{t('serviceCard.perHour')}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{t(`serviceDetail.pricing.${service.price_type}`)}</p>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">{service.description}</p>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <HiClock className="w-5 h-5 mr-2 text-primary-600" />
                  <span>{formatDuration(service.duration_hours)} {t('serviceDetail.hoursDuration')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <HiCalendar className="w-5 h-5 mr-2 text-primary-600" />
                  <span>{t('serviceDetail.bookUpTo', { days: service.max_advance_booking_days })}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <HiClock className="w-5 h-5 mr-2 text-primary-600" />
                  <span>{t('serviceDetail.minAdvanceNotice', { hours: service.min_advance_booking_hours })}</span>
                </div>
              </div>

              {/* Included Services */}
              {(() => {
                const includedServices = parseJsonField(service.included_services, []);
                return includedServices && includedServices.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">{t('serviceDetail.whatsIncluded')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {includedServices.map((item, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <HiCheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Excluded Services */}
              {(() => {
                const excludedServices = parseJsonField(service.excluded_services, []);
                return excludedServices && excludedServices.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">{t('serviceDetail.whatsNotIncluded')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {excludedServices.map((item, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <HiXCircle className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Requirements */}
              {service.requirements && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">{t('serviceDetail.requirements')}</h3>
                  <p className="text-gray-700 leading-relaxed">{service.requirements}</p>
                </div>
              )}
            </div>

            {/* Packages */}
            {(() => {
              const packages = parseJsonArrayField(service.packages, []);
              return packages && packages.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">{t('serviceDetail.availablePackages')} <span className="text-sm font-normal text-gray-500">({t('common.optional')})</span></h3>
                  <div className="space-y-4">
                    {/* No Package Option */}
                    <label
                      className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                        !selectedPackage || selectedPackage === ''
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value=""
                        checked={!selectedPackage || selectedPackage === ''}
                        onChange={(e) => setSelectedPackage('')}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-lg">{t('serviceDetail.noPackage')}</p>
                          <p className="text-gray-600 mt-1">{t('serviceDetail.useBasePrice')}</p>
                        </div>
                        <p className="font-semibold text-xl text-primary-600 ml-4">{formatPrice(service.base_price, i18n.language)}</p>
                      </div>
                    </label>
                    
                    {packages.map((pkg, index) => (
                    <label
                      key={index}
                      className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPackage === pkg.name
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value={pkg.name}
                        checked={selectedPackage === pkg.name}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-lg">{pkg.name}</p>
                          <p className="text-gray-600 mt-1">{pkg.description}</p>
                          {pkg.features && (
                            <ul className="mt-3 space-y-1">
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="text-sm text-gray-500 flex items-center">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <p className="font-semibold text-xl text-primary-600 ml-4">{formatPrice(pkg.price, i18n.language)}</p>
                      </div>
                    </label>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Add-ons */}
            {(() => {
              const addOns = parseJsonArrayField(service.add_ons, []);
              return addOns && addOns.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">{t('serviceDetail.additionalServices')}</h3>
                  <div className="space-y-3">
                    {addOns.map((addon, index) => (
                    <label
                      key={index}
                      className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAddOns.includes(addon.name)
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAddOns.includes(addon.name)}
                            onChange={() => toggleAddOn(addon.name)}
                            className="mr-3 w-4 h-4 text-primary-600"
                          />
                          <div>
                            <p className="font-medium">{addon.name}</p>
                            <p className="text-sm text-gray-600">{addon.description}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-primary-600">+{formatPrice(addon.price, i18n.language)}</p>
                      </div>
                    </label>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Duration Selection for Hourly Services */}
            {service.price_type === 'hourly' && (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">{t('serviceDetail.duration')}</h3>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const newDuration = Math.max(0.5, Number(duration) - 0.5);
                      setDuration(Math.round(newDuration * 2) / 2);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <HiMinusCircle className="w-6 h-6 text-gray-600" />
                  </button>
                  <span className="text-2xl font-semibold w-20 text-center">
                    {formatDuration(duration)} {Number(duration) === 1 ? t('serviceDetail.hour') : t('serviceDetail.hours')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newDuration = Number(duration) + 0.5;
                      setDuration(Math.round(newDuration * 2) / 2);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <HiPlusCircle className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Provider Information */}
            {service.provider && (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">{t('serviceDetail.serviceProvider')}</h3>
                <div className="flex items-start gap-4">
                  <img
                    src={service.provider.user?.profile_image 
                      ? `/uploads/profiles/${service.provider.user.profile_image}`
                      : `https://ui-avatars.com/api/?name=${service.provider.user?.first_name}+${service.provider.user?.last_name}&background=random`}
                    alt={service.provider.business_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{service.provider.business_name}</h4>
                    <p className="text-gray-600 mb-2">
                      {service.provider.user?.first_name} {service.provider.user?.last_name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {service.provider.rating_avg && (
                        <div className="flex items-center">
                          <HiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>{parseFloat(service.provider.rating_avg).toFixed(1)}</span>
                        </div>
                      )}
                      <span>{service.booking_count || 0} {t('serviceDetail.bookings')}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      {/* {service.provider.user?.phone && (
                        <a
                          href={`tel:${service.provider.user.phone}`}
                          className="flex items-center text-primary-600 hover:text-primary-700"
                        >
                          {service.provider.user.phone}
                        </a>
                      )}
                      {service.provider.user?.email && (
                        <a
                          href={`mailto:${service.provider.user.email}`}
                          className="flex items-center text-primary-600 hover:text-primary-700"
                        >
                          {service.provider.user.email}
                        </a>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-semibold text-xl mb-4">{t('serviceDetail.bookThisService')}</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('serviceDetail.basePrice')}</span>
                  <span className="font-medium">{formatPrice(pricing.base, i18n.language)}</span>
                </div>
                
                {service.price_type === 'hourly' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('serviceDetail.duration')}</span>
                    <span className="font-medium">× {formatDuration(duration)} {t('serviceDetail.hours')}</span>
                  </div>
                )}
                
                {pricing.addons > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('serviceDetail.addOns')}</span>
                    <span className="font-medium">{formatPrice(pricing.addons, i18n.language)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">{t('serviceDetail.total')}</span>
                    <span className="font-bold text-xl text-primary-600">
                      {formatPrice(pricing.total, i18n.language)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBookNow}
                className="w-full btn-primary text-lg py-3 mb-4"
              >
{t('serviceDetail.bookNow')}
              </button>
              
              <div className="text-center text-sm text-gray-600 mb-4">
                <p>{t('serviceDetail.cancellationPolicy')}</p>
              </div>
              
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <HiCheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>{t('serviceDetail.verifiedProvider')}</span>
                </div>
                <div className="flex items-center">
                  <HiCheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>{t('serviceDetail.securePayment')}</span>
                </div>
                <div className="flex items-center">
                  <HiCheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>{t('serviceDetail.support247')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
