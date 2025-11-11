import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiLocationMarker, HiRefresh, HiMap } from 'react-icons/hi';

const LocationSelector = ({ 
  onLocationSelect, 
  onLocationError, 
  className = '', 
  required = false,
  value = null 
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(value);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Check if geolocation is supported
  const isGeolocationSupported = () => {
    return 'geolocation' in navigator;
  };

  // Get current position using geolocation API
  const getCurrentPosition = () => {
    if (!isGeolocationSupported()) {
      setError(t('location.geolocationNotSupported'));
      onLocationError?.(t('location.geolocationNotSupported'));
      return;
    }

    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout for better accuracy
      maximumAge: 0 // Always get fresh location, don't use cached
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLoading(false);
        
        // Always call the error handler first to trigger fallback
        onLocationError?.(error.message || 'Location detection failed');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionDenied(true);
            setError(t('location.permissionDenied'));
            try {
              sessionStorage.setItem('geoPermissionDenied', 'true');
            } catch (_) {}
            break;
          case error.POSITION_UNAVAILABLE:
            setError(t('location.positionUnavailable'));
            break;
          case error.TIMEOUT:
            setError(t('location.timeout'));
            break;
          default:
            setError(t('location.unknownError'));
            break;
        }
      },
      options
    );
    setHasAttempted(true);
  };

  // Reverse geocoding to get city and area from coordinates
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Try multiple reverse geocoding services for better accuracy
      // First try: OpenStreetMap Nominatim (more accurate for local areas)
      let response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BaitakApp/1.0'
          }
        }
      );
      
      let data;
      let useFallback = false;
      
      if (response.ok) {
        data = await response.json();
        // Check if we got good location data
        if (data.address) {
          const address = data.address;
          const city = address.city || address.town || address.village || address.municipality || address.county || '';
          let area = address.suburb || address.neighbourhood || address.quarter || address.road || address.district || '';
          
          // If area is still empty, try to extract from display_name or locality
          if (!area && data.display_name) {
            // Try to extract area from display_name (format: "Area, City, Country")
            const parts = data.display_name.split(',');
            if (parts.length > 0) {
              // First part is usually the most specific location (area/suburb)
              const firstPart = parts[0].trim();
              // If it doesn't match the city, it's likely the area
              if (firstPart && firstPart !== city) {
                area = firstPart;
              } else if (parts.length > 1) {
                // Try second part if first is city
                area = parts[1].trim();
              }
            }
          }
          
          if (city || area) {
            const locationData = {
              latitude,
              longitude,
              city: city,
              area: area,
              fullAddress: data.display_name || `${city}${area ? ', ' + area : ''}`,
              country: address.country || '',
              mode: 'auto'
            };
            
            setLocation(locationData);
            onLocationSelect?.(locationData);
            setError(null);
            setLoading(false);
            return;
          }
        }
        useFallback = true;
      } else {
        useFallback = true;
      }
      
      // Fallback: BigDataCloud (more reliable for country-level data)
      if (useFallback) {
        response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (!response.ok) {
          throw new Error('Reverse geocoding failed');
        }
        
        data = await response.json();
        
        if (data.city) {
          // Try to get area from various fields
          const area = data.principalSubdivision || data.locality || data.localityInfo?.administrative?.[0]?.name || '';
          
          const locationData = {
            latitude,
            longitude,
            city: data.city,
            area: area,
            fullAddress: data.locality || data.display_name || `${data.city}${area ? ', ' + area : ''}`,
            country: data.countryName || '',
            mode: 'auto'
          };
          
          setLocation(locationData);
          onLocationSelect?.(locationData);
          setError(null);
          setLoading(false);
        } else {
          throw new Error('Unable to determine location details');
        }
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setError(t('location.reverseGeocodingFailed'));
      onLocationError?.(t('location.reverseGeocodingFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Manual location input fallback
  const handleManualInput = () => {
    setLocation(null);
    setError(null);
    setPermissionDenied(false);
    try {
      sessionStorage.setItem('geoPermissionDenied', 'true');
    } catch (_) {}
    // Notify parent component to switch to manual mode
    onLocationError?.('switch_to_manual');
  };

  // Retry geolocation
  const handleRetry = () => {
    setLocation(null);
    setError(null);
    setPermissionDenied(false);
    try {
      sessionStorage.removeItem('geoPermissionDenied');
    } catch (_) {}
    setHasAttempted(false);
    getCurrentPosition();
  };

  // Clear location
  const clearLocation = () => {
    setLocation(null);
    setError(null);
    setPermissionDenied(false);
    onLocationSelect?.(null);
  };

  // Initialize with current location if no value provided
  useEffect(() => {
    const deniedInSession = (() => {
      try {
        return sessionStorage.getItem('geoPermissionDenied') === 'true';
      } catch (_) {
        return false;
      }
    })();
    if (!value && isGeolocationSupported() && !deniedInSession && !hasAttempted) {
      // Auto-detect location on component mount
      getCurrentPosition();
    }
  }, []);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Location Detection Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={getCurrentPosition}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
            loading
              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
              : location
              ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
              : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <HiLocationMarker className="w-5 h-5" />
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              {t('location.detecting')}
            </span>
          ) : location ? (
            <span>{t('location.locationDetected')}</span>
          ) : (
            <span>{t('location.detectLocation')}</span>
          )}
        </button>

        {location && (
          <button
            type="button"
            onClick={clearLocation}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title={t('location.clearLocation')}
          >
            <HiRefresh className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Location Display */}
      {location && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <HiMap className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-800">{t('location.detectedLocation')}</p>
              {location.fullAddress && (
                <p className="text-sm text-green-700 mt-1">{location.fullAddress}</p>
              )}
              {location.city && (
                <p className="text-sm text-green-700 mt-1">{location.city}{location.area ? `, ${location.area}` : ''}</p>
              )}
              {location.latitude && location.longitude && (
                <p className="text-xs text-green-600 mt-1">
                  {t('location.coordinates')}: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <HiLocationMarker className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">{t('location.error')}</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('location.tryAgain')}
                </button>
                <button
                  type="button"
                  onClick={handleManualInput}
                  className="px-3 py-2 bg-white text-red-600 text-sm rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
                >
                  {t('location.enterManually')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Denied Message */}
      {permissionDenied && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <HiLocationMarker className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800">{t('location.permissionRequired')}</p>
              <p className="text-sm text-yellow-700 mt-1">{t('location.permissionInstructions')}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  {t('location.tryAgain')}
                </button>
                <button
                  type="button"
                  onClick={handleManualInput}
                  className="px-3 py-2 bg-white text-yellow-600 text-sm rounded-lg border border-yellow-300 hover:bg-yellow-50 transition-colors"
                >
                  {t('location.enterManually')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Input Fallback */}
      {!location && !loading && !error && !permissionDenied && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleManualInput}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            {t('location.enterManually')}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
