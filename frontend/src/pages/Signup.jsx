import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import CityDropdown from '../components/CityDropdown';
import AreaDropdown from '../components/AreaDropdown';
import { locationAPI } from '../utils/api';
import { useTranslation } from 'react-i18next';
import { validateJordanianPhone } from '../utils/phoneValidation';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, user, loading, logout } = useAuth();
  const { t } = useTranslation();
  const [cities, setCities] = useState([]);
  const [selectedCitySlug, setSelectedCitySlug] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    city: '',
    citySlug: '',
    area: ''
  });

  // Fetch cities on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesRes = await locationAPI.getCities();
        
        if (citiesRes.data.success) {
          setCities(citiesRes.data.data.cities);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // City change handler
  const handleCityChange = (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const citySlug = selectedOption?.getAttribute('data-slug') || e.target.value;
    const cityId = selectedOption?.getAttribute('data-id') || e.target.value;
    
    setFormData({ 
      ...formData, 
      city: cityId, // Store city ID
      citySlug: citySlug, // Store slug for area dropdown
      area: '' // Reset area when city changes
    });
    setSelectedCitySlug(citySlug);
  };

  // Redirect if already logged in (users should not be logged in during signup)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      // User is already logged in, redirect them away from signup
      if (user?.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate first name
    if (!formData.first_name) {
      toast.error(t('auth.signup.validation.firstNameRequired'));
      return;
    }
    // Validate last name
    if (!formData.last_name) {
      toast.error(t('auth.signup.validation.lastNameRequired'));
      return;
    }
    
    // Validate phone number
    if (!validateJordanianPhone(formData.phone)) {
      toast.error(t('auth.errors.jordanianPhone'));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth.signup.validation.passwordsDoNotMatch'));
      return;
    }
    

    // Remove confirmPassword and citySlug from the data sent to API
    const { confirmPassword, citySlug, ...signupData } = formData;
    
    // Remove empty email field if it's empty (since email is optional)
    if (!signupData.email || signupData.email.trim() === '') {
      delete signupData.email;
    }
    
    // Convert city and area to IDs for API
    // city already contains the ID from the dropdown
    if (signupData.city) {
      signupData.city_id = parseInt(signupData.city);
      delete signupData.city;
    }
    // area already contains the ID from AreaDropdown
    if (signupData.area) {
      signupData.area_id = parseInt(signupData.area);
      delete signupData.area;
    }
    
    console.log('Cleaned signup data:', signupData);
    
    // Ensure user is logged out before signup (in case they were logged in)
    if (isAuthenticated) {
      logout();
    }
    
    const result = await signup(signupData);
    if (result.success) {
      // User should NOT be logged in at this point - only after OTP verification
      // Get phone from result (API response) or form data
      const phoneToVerify = result.phone || signupData.phone;
      // Navigate to verify phone with the phone number from API response
      navigate('/verify-phone', { state: { phone: phoneToVerify, expires_at: result.expires_at } });
    }
  };


  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img src="/baitk-logo.png" alt="Baitak" className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">{t('auth.signup.title')}</h2>
          <p className="text-gray-600 mt-2">
            {t('auth.signup.have_account')}{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              {t('auth.signup.login_link')}
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-4">
         
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('auth.signup.first_name')}</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">{t('auth.signup.last_name')}</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">{t('auth.signup.phone')}</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => {
                // Only allow digits and limit to 10 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phone: value });
              }}
              className="input"
              placeholder={t('auth.signup.phone_placeholder')}
              maxLength={10}
            />
          </div>

          <div>
            <label className="label">{t('auth.signup.email')} ({t('common.optional')})</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="label">{t('auth.signup.password')}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5" />
                ) : (
                  <HiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="label">{t('auth.signup.confirm_password')}</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <HiEyeOff className="h-5 w-5" />
                ) : (
                  <HiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('common.city')}</label>
              <CityDropdown
                value={formData.citySlug || formData.city}
                onChange={handleCityChange}
                required
              />
            </div>
            <div>
              <label className="label">{t('common.area')}</label>
              <AreaDropdown
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                citySlug={formData.citySlug || selectedCitySlug}
                required
              />
            </div>
          </div>


          <button type="submit" className="w-full btn-primary">
            {t('auth.signup.create_account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
