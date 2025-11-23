import React from 'react';
import { Link } from 'react-router-dom';
import { HiStar, HiClock, HiCurrencyDollar, HiCheckCircle } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { formatPrice } from './currency';

const ServiceCard = ({ service, provider }) => {
  const { t, i18n } = useTranslation();
  // Handle both embedded provider and separate provider prop
  const serviceProvider = provider || service.provider;
  
  // Convert numbers to Arabic numerals when language is Arabic
  const toArabicNumerals = (num) => {
    if (i18n.language === 'ar') {
      return num.toString().replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
    }
    return num;
  };

  // Format duration to remove unnecessary decimal places
  const formatDuration = (duration) => {
    const num = Number(duration);
    if (isNaN(num)) return '0';
    // If it's a whole number, show without decimals, otherwise show 1 decimal place
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  // Get verification badges
  const getVerificationBadges = () => {
    let badges = [];
    if (serviceProvider.verification_badges && serviceProvider.verification_badges.length > 0) {
      badges = serviceProvider.verification_badges;
    } else {
      // Create badges from individual verification flags
      if (serviceProvider.is_id_verified) {
        badges.push({ icon: '🆔', description: 'ID Verified' });
      }
      if (serviceProvider.is_license_verified) {
        badges.push({ icon: '📜', description: 'Vocational License' });
      }
      if (serviceProvider.is_police_clearance_verified) {
        badges.push({ icon: '✅', description: 'Police Clearance' });
      }
    }
    return badges;
  };

  const verificationBadges = getVerificationBadges();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div className="card border border-gray-100 rounded-xl bg-white hover:shadow-xl transition-all duration-300 h-full min-h-[480px] flex flex-col overflow-hidden">
      <div className="pt-6 px-5 sm:px-6 pb-6 flex flex-col flex-grow">
        {/* Provider Info */}
        <div className="mb-5">
          <div className="flex items-center mb-3">
            <img
              src={serviceProvider.user?.profile_image 
                ? `/uploads/profiles/${serviceProvider.user.profile_image}`
                : `https://ui-avatars.com/api/?name=${serviceProvider.user?.first_name}+${serviceProvider.user?.last_name}&background=random`}
              alt={serviceProvider.business_name}
              className={`w-16 h-16 rounded-full object-cover flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`}
            />
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <p className="font-semibold text-base text-gray-900 truncate">{serviceProvider.business_name}</p>
              {verificationBadges.length > 0 && (
                <HiCheckCircle 
                  className="w-5 h-5 text-green-500 flex-shrink-0" 
                  title={verificationBadges.map(b => b.description).join(', ')}
                />
              )}
            </div>
          </div>

          {/* Rating and Verification Badges */}
          <div className={`flex items-center flex-wrap gap-3 ${isRTL ? 'mr-[60px]' : 'ml-[60px]'}`}>
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
              <HiStar className="w-4 h-4 text-yellow-500 fill-current" />
              <span className={`text-sm font-medium text-gray-700 ${isRTL ? 'mr-1.5' : 'ml-1.5'}`}>
                {toArabicNumerals(serviceProvider.rating_avg || 0)}
              </span>
              <span className={`text-xs text-gray-500 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                ({toArabicNumerals(service.booking_count || 0)} {t('serviceCard.bookings')})
              </span>
            </div>
            {verificationBadges.length > 0 && (
              <div className="flex gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                {verificationBadges.slice(0, 3).map((badge, index) => (
                  <span
                    key={index}
                    className="text-sm"
                    title={badge.description}
                  >
                    {badge.icon}
                  </span>
                ))}
                {verificationBadges.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{verificationBadges.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Service Name */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h3 className="font-bold text-xl text-gray-900 leading-tight">{service.name}</h3>
        </div>

        {/* Service Description */}
        <div className="mb-6 flex-grow">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{service.description}</p>
        </div>

        {/* Service Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-gray-700">
              <HiClock className={`w-5 h-5 text-primary-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="text-sm font-medium">{toArabicNumerals(formatDuration(service.duration_hours))} {t('serviceCard.hours')}</span>
            </div>
            <div className="flex items-center text-primary-600">
              <span className="text-lg font-bold">{toArabicNumerals(formatPrice(service.base_price, i18n.language))}</span>
              {service.price_type === 'hourly' && <span className={`text-sm font-normal ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('serviceCard.perHour')}</span>}
            </div>
          </div>
          {service.price_type && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              {service.price_type === 'hourly' ? t('serviceCard.hourlyService') : t('')}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/services/${service.id}`}
            className="flex-1 btn-outline text-sm text-center py-3 font-medium"
          >
            {t('serviceCard.viewDetails')}
          </Link>
          <Link
            to={`/booking/${service.id}`}
            className="flex-1 btn-primary text-sm text-center py-3 font-medium"
          >
            {t('serviceCard.bookNow')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;