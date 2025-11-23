import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { validateJordanianPhone } from '../../services/phoneValidation';
import CityDropdown from '../../components/sharedInputs/CityDropdown';
import AreaDropdown from '../../components/sharedInputs/AreaDropdown';
import CategoryDropdown from '../../components/providers/CategoryDropdown';
import VerificationModal from '../../components/VerificationModal';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HiUser, 
  HiBriefcase, 
  HiClock, 
  HiLocationMarker,
  HiChat
} from 'react-icons/hi';

const ProviderRegister = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { sendOTP, verifyOTP } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    city: '',
    area: '',
    
    // Business Info
    business_name: '',
    bio: '',
    hourly_rate: '',
    experience_years: '',
    categories: [],
    languages: ['English'],
    service_areas: [],
    
    // Availability
    available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    working_hours: {
      start: '09:00',
      end: '18:00'
    },
    
    // Additional
    certifications: [],
    instant_booking: false,
    cancellation_policy: '',
    
    // File uploads
    id_verified_image: null,
    vocational_license_image: null,
    police_clearance_image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCitySlug, setSelectedCitySlug] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  
  // Raw input strings for comma-separated fields (allows free typing)
  const [rawInputs, setRawInputs] = useState({
    service_areas: '',
    certifications: '',
    languages: 'English'
  });

  // Convert numbers to Arabic numerals when language is Arabic
  const toArabicNumerals = (num) => {
    if (i18n.language === 'ar') {
      return num.toString().replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
    }
    return num;
  };


  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.first_name) newErrors.first_name = t('providerRegister.validation.firstNameRequired');
      if (!formData.last_name) newErrors.last_name = t('providerRegister.validation.lastNameRequired');
      if (!formData.phone) {
        newErrors.phone = t('providerRegister.validation.phoneRequired');
      } else if (!validateJordanianPhone(formData.phone)) {
        newErrors.phone = t('providerRegister.validation.phoneInvalid');
      }
      if (!formData.password) newErrors.password = t('providerRegister.validation.passwordRequired');
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = t('providerRegister.validation.passwordsDoNotMatch');
      }
      if (!formData.city) newErrors.city = t('providerRegister.validation.cityRequired');
    }
    
    if (stepNumber === 2) {
      if (!formData.business_name) newErrors.business_name = t('providerRegister.validation.businessNameRequired');
      if (!formData.bio) newErrors.bio = t('providerRegister.validation.bioRequired');
      if (!formData.hourly_rate) newErrors.hourly_rate = t('providerRegister.validation.hourlyRateRequired');
      if (!formData.experience_years) newErrors.experience_years = t('providerRegister.validation.experienceRequired');
      if (!formData.categories || formData.categories.length === 0) newErrors.categories = t('providerRegister.validation.categoryRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleFileChange = (field, file) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only allow submission on step 3
    if (step !== 3) {
      return;
    }
    
    if (!validateStep(3)) {
      return;
    }
    
    
    try {
      setLoading(true);
      
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          // Skip empty email field to avoid validation error
          if (key === 'email' && (!formData[key] || formData[key].trim() === '')) {
            return;
          }
          
          if (key === 'working_hours' || key === 'languages' || key === 'service_areas' || key === 'available_days' || key === 'certifications' || key === 'categories') {
            // Convert arrays and objects to JSON strings
            // Only send non-empty arrays
            if (Array.isArray(formData[key]) && formData[key].length > 0) {
              submitData.append(key, JSON.stringify(formData[key]));
            } else if (key === 'working_hours') {
              // Always send working_hours even if default
              submitData.append(key, JSON.stringify(formData[key]));
            }
          } else if (key === 'id_verified_image' || key === 'vocational_license_image' || key === 'police_clearance_image') {
            // Handle file uploads
            if (formData[key]) {
              submitData.append(key, formData[key]);
            }
          } else if (key === 'hourly_rate' || key === 'experience_years') {
            // Convert numeric fields to numbers
            submitData.append(key, parseFloat(formData[key]) || 0);
          } else if (key === 'instant_booking') {
            // Convert boolean to string
            submitData.append(key, formData[key] ? '1' : '0');
          } else {
            // Regular string fields
            submitData.append(key, formData[key]);
          }
        }
      });
      
      // Rename city and area to city_id and area_id for API
      if (formData.city) {
        submitData.append('city_id', formData.city);
        submitData.delete('city'); // Remove the original city field
      }
      if (formData.area) {
        submitData.append('area_id', formData.area);
        submitData.delete('area'); // Remove the original area field
      }
      
      // Debug: Log the form data being sent
      console.log('Form data being sent:', formData);
      console.log('FormData entries:');
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await providerAPI.register(submitData);
      
      if (response.data.success) {
        toast.success(t('providerRegister.messages.registrationSuccess'));
        // Show verification modal instead of navigating immediately
        setShowVerificationModal(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', error.response?.data?.errors);
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || t('providerRegister.messages.registrationFailed');
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors && validationErrors.length > 0) {
        console.error('Validation errors:', validationErrors);
        toast.error(`${t('providerRegister.messages.validationError')}: ${validationErrors[0].message}`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (field, value) => {
    // Store the raw input value for free typing
    setRawInputs({ ...rawInputs, [field]: value });
    
    // Parse and update the array in formData (for submission)
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    setFormData({ ...formData, [field]: values });
  };
  
  // Initialize raw inputs from formData when component mounts
  useEffect(() => {
    if (formData.service_areas.length > 0 && !rawInputs.service_areas) {
      setRawInputs(prev => ({ ...prev, service_areas: formData.service_areas.join(', ') }));
    }
    if (formData.certifications.length > 0 && !rawInputs.certifications) {
      setRawInputs(prev => ({ ...prev, certifications: formData.certifications.join(', ') }));
    }
    if (formData.languages.length > 0 && rawInputs.languages === 'English') {
      setRawInputs(prev => ({ ...prev, languages: formData.languages.join(', ') }));
    }
  }, []);

  const handleCityChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = e.target.selectedOptions[0];
    const citySlug = selectedOption?.getAttribute('data-slug') || selectedValue;
    const cityId = selectedOption?.getAttribute('data-id') || selectedValue;
    
    setFormData({ 
      ...formData, 
      city: cityId, // Store city ID for API
      area: '' // Reset area when city changes
    });
    setSelectedCitySlug(citySlug); // Keep slug for area dropdown
    setSelectedCityId(cityId); // Keep ID for reference
  };

  const toggleDay = (day) => {
    const days = [...formData.available_days];
    const index = days.indexOf(day);
    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(day);
    }
    setFormData({ ...formData, available_days: days });
  };

  // Get phone number in the format needed for verification (local format: 07XXXXXXXX)
  const getPhoneForVerification = () => {
    // Phone is stored in local format (07XXXXXXXX), which is what verify_phone purpose expects
    return formData.phone;
  };

  const handleModalOTPSent = async (phone) => {
    return await sendOTP(phone, 'verify_phone');
  };

  const handleModalOTPVerified = async (phone, otp) => {
    const result = await verifyOTP(phone, otp, 'verify_phone');
    if (result.success) {
      // After successful verification, navigate to success page
      navigate('/provider/registration-success');
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('providerRegister.title')}</h1>
          <p className="text-gray-600">{t('providerRegister.subtitle')}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-start justify-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {toArabicNumerals(1)}
              </div>
              <span className="text-sm mt-2 text-center">{t('providerRegister.steps.personalInfo')}</span>
            </div>
            
            {/* Connector 1-2 */}
            <div className="flex items-center mt-5">
              <div
                className={`w-24 h-1 ${
                  step > 1 ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 2
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {toArabicNumerals(2)}
              </div>
              <span className="text-sm mt-2 text-center">{t('providerRegister.steps.businessInfo')}</span>
            </div>
            
            {/* Connector 2-3 */}
            <div className="flex items-center mt-5">
              <div
                className={`w-24 h-1 ${
                  step > 2 ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 3
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {toArabicNumerals(3)}
              </div>
              <span className="text-sm mt-2 text-center">{t('providerRegister.steps.availability')}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <HiUser className="mr-2 text-primary-600" />
                {t('providerRegister.sections.personalInfo')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">{t('providerRegister.fields.firstName')} *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className={`input ${errors.first_name ? 'border-red-500' : ''}`}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="label">{t('providerRegister.fields.lastName')} *</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className={`input ${errors.last_name ? 'border-red-500' : ''}`}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">{t('providerRegister.fields.phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      // Only allow digits and limit to 10 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: value });
                    }}
                    className={`input ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder={t('providerRegister.placeholders.phone')}
                    maxLength={10}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="label">{t('providerRegister.fields.email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder={t('providerRegister.placeholders.email')}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">{t('providerRegister.fields.password')} *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`input ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="label">{t('providerRegister.fields.confirmPassword')} *</label>
                  <input
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className={`input ${errors.confirm_password ? 'border-red-500' : ''}`}
                  />
                  {errors.confirm_password && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">{t('providerRegister.fields.city')} *</label>
                  <CityDropdown
                    value={selectedCitySlug}
                    onChange={handleCityChange}
                    className={errors.city ? 'border-red-500' : ''}
                    required
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                
                <div>
                  <label className="label">{t('providerRegister.fields.area')}</label>
                  {/* <AreaDropdown
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    citySlug={selectedCitySlug}
                  /> */}
                <AreaDropdown
 value={formData.area}
onChange={(e) => setFormData({ ...formData, area: e.target.value })}
  citySlug={selectedCitySlug}
  className="my-custom-classes"
  variant="outline" // or "filled"
  size="md"
/>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <HiBriefcase className="mr-2 text-primary-600" />
                {t('providerRegister.sections.businessInfo')}
              </h2>
              
              <div>
                <label className="label">{t('providerRegister.fields.businessName')} *</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className={`input ${errors.business_name ? 'border-red-500' : ''}`}
                  placeholder={t('providerRegister.placeholders.businessName')}
                />
                {errors.business_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.business_name}</p>
                )}
              </div>
              
              <div>
                <label className="label">{t('providerRegister.fields.bio')} *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className={`input min-h-[120px] ${errors.bio ? 'border-red-500' : ''}`}
                  placeholder={t('providerRegister.placeholders.bio')}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                )}
              </div>
              
              <div>
                <label className="label">{t('providerRegister.fields.category')} *</label>
                <CategoryDropdown
                  value={formData.categories.length > 0 ? formData.categories[0] : ''}
                  onChange={(e) => {
                    const selectedCategory = e.target.value;
                    if (selectedCategory) {
                      setFormData({ ...formData, categories: [selectedCategory] });
                    } else {
                      setFormData({ ...formData, categories: [] });
                    }
                  }}
                  className={errors.categories ? 'border-red-500' : ''}
                  required
                />
                {errors.categories && (
                  <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">{t('providerRegister.fields.hourlyRate')} *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                      {i18n.language === 'ar' ? 'د.أ' : 'JD'}
                    </span>
                    <input
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                      className={`input pl-10 ${errors.hourly_rate ? 'border-red-500' : ''}`}
                      placeholder="50"
                      min="0"
                    />
                  </div>
                  {errors.hourly_rate && (
                    <p className="text-red-500 text-sm mt-1">{errors.hourly_rate}</p>
                  )}
                </div>
                
                <div>
                  <label className="label">{t('providerRegister.fields.experienceYears')} *</label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    className={`input ${errors.experience_years ? 'border-red-500' : ''}`}
                    placeholder="5"
                    min="0"
                  />
                  {errors.experience_years && (
                    <p className="text-red-500 text-sm mt-1">{errors.experience_years}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="label">{t('providerRegister.fields.languages')}</label>
                <input
                  type="text"
                  value={rawInputs.languages}
                  onChange={(e) => handleArrayInput('languages', e.target.value)}
                  className="input"
                  placeholder={t('providerRegister.placeholders.languages')}
                />
                <p className="text-sm text-gray-500 mt-1">{t('providerRegister.help.commaSeparated')}</p>
              </div>
              
              <div>
                <label className="label">{t('providerRegister.fields.serviceAreas')}</label>
                <input
                  type="text"
                  value={rawInputs.service_areas}
                  onChange={(e) => handleArrayInput('service_areas', e.target.value)}
                  className="input"
                  placeholder={t('providerRegister.placeholders.serviceAreas')}
                />
                <p className="text-sm text-gray-500 mt-1">{t('providerRegister.help.commaSeparated')}</p>
              </div>
              
              <div>
                <label className="label">{t('providerRegister.fields.certifications')}</label>
                <input
                  type="text"
                  value={rawInputs.certifications}
                  onChange={(e) => handleArrayInput('certifications', e.target.value)}
                  className="input"
                  placeholder={t('providerRegister.placeholders.certifications')}
                />
                <p className="text-sm text-gray-500 mt-1">{t('providerRegister.help.commaSeparated')}</p>
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <HiClock className="mr-2 text-primary-600" />
                {t('providerRegister.sections.availability')}
              </h2>
              
              <div>
                <label className="label">{t('providerRegister.fields.availableDays')}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.available_days.includes(day)}
                        onChange={() => toggleDay(day)}
                        className="mr-2"
                      />
                      <span className="capitalize">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">{t('providerRegister.fields.workingHoursStart')}</label>
                  <input
                    type="time"
                    value={formData.working_hours.start}
                    onChange={(e) => setFormData({
                      ...formData,
                      working_hours: { ...formData.working_hours, start: e.target.value }
                    })}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="label">{t('providerRegister.fields.workingHoursEnd')}</label>
                  <input
                    type="time"
                    value={formData.working_hours.end}
                    onChange={(e) => setFormData({
                      ...formData,
                      working_hours: { ...formData.working_hours, end: e.target.value }
                    })}
                    className="input"
                  />
                </div>
              </div>
              
              {/* <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.instant_booking}
                    onChange={(e) => setFormData({ ...formData, instant_booking: e.target.checked })}
                    className="mr-2"
                  />
                  <span>{t('providerRegister.fields.instantBooking')}</span>
                </label>
              </div> */}
              
              <div>
                <label className="label">{t('providerRegister.fields.cancellationPolicy')}</label>
                <textarea
                  value={formData.cancellation_policy}
                  onChange={(e) => setFormData({ ...formData, cancellation_policy: e.target.value })}
                  className="input min-h-[100px]"
                  placeholder={t('providerRegister.placeholders.cancellationPolicy')}
                />
              </div>
              
              {/* File Upload Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  {t('providerRegister.sections.verificationDocuments')}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {t('providerRegister.info.verificationDocumentsNote')}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">{t('providerRegister.fields.idVerifiedImage')}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('id_verified_image', e.target.files[0])}
                      className="input"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t('providerRegister.placeholders.idVerifiedImage')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="label">{t('providerRegister.fields.vocationalLicenseImage')}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('vocational_license_image', e.target.files[0])}
                      className="input"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t('providerRegister.placeholders.vocationalLicenseImage')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="label">{t('providerRegister.fields.policeClearanceImage')}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('police_clearance_image', e.target.files[0])}
                      className="input"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t('providerRegister.placeholders.policeClearanceImage')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn-secondary"
              >
                {t('common.previous')}
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary ml-auto"
              >
                {t('common.next')}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary ml-auto"
              >
                {loading ? t('providerRegister.buttons.submitting') : t('providerRegister.buttons.submitApplication')}
              </button>
            )}
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 card p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">{t('providerRegister.info.title')}</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• {t('providerRegister.info.reviewTime')}</li>
            <li>• {t('providerRegister.info.emailNotification')}</li>
            <li>• {t('providerRegister.info.afterApproval')}</li>
            <li>• {t('providerRegister.info.competitivePrices')}</li>
          </ul>
        </div>
      </div>

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => {
          // Allow closing but still navigate to success page
          setShowVerificationModal(false);
          navigate('/provider/registration-success');
        }}
        phone={getPhoneForVerification()}
        onOTPSent={handleModalOTPSent}
        onOTPVerified={handleModalOTPVerified}
      />
    </div>
  );
};

export default ProviderRegister;
