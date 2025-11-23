import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiLocationMarker, HiRefresh, HiMap, HiChevronDown } from 'react-icons/hi';
import LocationSelector from './LocationSelector';
import CityDropdown from './sharedInputs/CityDropdown';
import AreaDropdown from './sharedInputs/AreaDropdown';

const HybridLocationSelector = ({ 
  onLocationChange, 
  className = '', 
  required = false,
  value = null 
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState('manual'); // 'auto' or 'manual'
  const [locationData, setLocationData] = useState(value);
  const [selectedCitySlug, setSelectedCitySlug] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualArea, setManualArea] = useState('');
  const [autoSwitchMessage, setAutoSwitchMessage] = useState('');

  // Handle location selection from GPS
  const handleLocationSelect = (location) => {
    if (location) {
      setLocationData(location);
      // Try to map the detected city to our city list
      // This would need to be enhanced with proper city mapping
      setManualCity(location.city || '');
      setManualArea(location.area || '');
    } else {
      setLocationData(null);
    }
    onLocationChange?.(location);
  };

  // Handle location error from GPS
  const handleLocationError = (error) => {
    console.info('Location detection failed:', error);
    console.info('Switching to manual mode automatically...');
    
    // Show message about automatic switch
    setAutoSwitchMessage(t('location.switchedToManual'));
    setTimeout(() => setAutoSwitchMessage(''), 3000);
    
    // Automatically switch to manual mode on any error
    setMode('manual');
    setLocationData(null);
    onLocationChange?.(null);
  };

  // Handle manual city change
  const handleCityChange = (e) => {
    const citySlug = e.target.value;
    setSelectedCitySlug(citySlug);
    setManualCity(citySlug);
    
    // Reset area when city changes
    setManualArea('');
    
    // Create location data object for manual selection
    const locationData = {
      city: citySlug,
      area: '',
      mode: 'manual'
    };
    setLocationData(locationData);
    onLocationChange?.(locationData);
  };

  // Handle manual area change
  const handleAreaChange = (e) => {
    const area = e.target.value;
    setManualArea(area);
    
    // Update location data with area
    const locationData = {
      city: selectedCitySlug,
      area: area,
      mode: 'manual'
    };
    setLocationData(locationData);
    onLocationChange?.(locationData);
  };

  // Switch to manual mode
  const switchToManual = () => {
    setMode('manual');
    setLocationData(null);
    onLocationChange?.(null);
  };

  // Switch to auto mode
  const switchToAuto = () => {
    setMode('auto');
    setLocationData(null);
    setManualCity('');
    setManualArea('');
    setSelectedCitySlug('');
    onLocationChange?.(null);
  };

  // Initialize with manual mode if location data exists and is manual
  useEffect(() => {
    if (value && value.mode === 'manual') {
      setMode('manual');
      setManualCity(value.city || '');
      setManualArea(value.area || '');
      setSelectedCitySlug(value.city || '');
    }
  }, [value]);

  // Auto-switch to manual mode after a delay if auto mode is selected but no location is detected
  useEffect(() => {
    if (mode === 'auto' && !locationData) {
      const timer = setTimeout(() => {
        console.log('Auto-switching to manual mode due to timeout...');
        setMode('manual');
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    }
  }, [mode, locationData]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Auto-switch message */}
      {autoSwitchMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">{autoSwitchMessage}</p>
        </div>
      )}

      {/* Mode Selection */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2">{t('location.selectMethod')}</h4>
          <p className="text-sm text-gray-600">{t('location.chooseDetectionMethod')}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={switchToAuto}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'auto'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <HiLocationMarker className="w-4 h-4 inline mr-2" />
            {t('location.autoDetect')}
          </button>
          <button
            type="button"
            onClick={switchToManual}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <HiMap className="w-4 h-4 inline mr-2" />
            {t('location.manualSelect')}
          </button>
        </div>
      </div>

      {/* Auto Location Detection */}
      {mode === 'auto' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiLocationMarker className="w-4 h-4" />
            <span>{t('location.autoDetectionDescription')}</span>
          </div>
          <LocationSelector
            onLocationSelect={handleLocationSelect}
            onLocationError={handleLocationError}
            value={locationData}
            required={required}
          />
        </div>
      )}

      {/* Manual City/Area Selection */}
      {mode === 'manual' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiMap className="w-4 h-4" />
            <span>{t('location.manualSelectionDescription')}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('common.city')}</label>
              <CityDropdown
                value={manualCity}
                onChange={handleCityChange}
                required={required}
              />
            </div>
            <div>
              <label className="label">{t('common.area')}</label>
              {/* <AreaDropdown
                value={manualArea}
                onChange={handleAreaChange}
                citySlug={selectedCitySlug}
                required={required}
              /> */}
              <AreaDropdown
  value={manualArea}
                onChange={handleAreaChange}
                citySlug={selectedCitySlug}
  className="my-custom-classes"
  variant="outline" // or "filled"
  size="md"
/>
            </div>
          </div>
        </div>
      )}

      {/* Current Selection Display - Only show for manual mode (LocationSelector handles auto mode display) */}
      {locationData && mode === 'manual' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <HiMap className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-800">
                {t('location.selectedLocation')}
              </p>
              <p className="text-sm text-green-700 mt-1">
                {locationData.city && locationData.area 
                  ? `${locationData.city}, ${locationData.area}`
                  : locationData.city || locationData.area || t('location.incompleteSelection')
                }
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLocationData(null);
                setManualCity('');
                setManualArea('');
                setSelectedCitySlug('');
                onLocationChange?.(null);
              }}
              className="p-1 text-green-600 hover:text-red-600 transition-colors"
              title={t('location.clearSelection')}
            >
              <HiRefresh className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HybridLocationSelector;
