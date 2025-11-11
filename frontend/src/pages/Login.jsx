import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiPhone, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import CustomOTPInput from '../components/CustomOTPInput';
import VerificationModal from '../components/VerificationModal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP, isAuthenticated, user, loading } = useAuth();
  const { t } = useTranslation();
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    otp: '',
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationPhone, setVerificationPhone] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect based on user role
      if (user?.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Pre-fill phone number from guest booking
  useEffect(() => {
    const guestPhone = localStorage.getItem('guest_phone');
    if (guestPhone && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: guestPhone }));
    }
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const phoneOrEmail = loginMethod === 'otp' ? formData.phone : formData.email;
    
    if (!phoneOrEmail) {
      toast.error(t('auth.login.enter_phone'));
      return;
    }

    // Check if there's a guest phone number stored and pre-fill it
    const guestPhone = localStorage.getItem('guest_phone');
    if (guestPhone && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: guestPhone }));
    }

    const intlPhoneRegex = /^\+?\d{7,15}$/;
    if (!intlPhoneRegex.test(formData.phone)) {
      toast.error(t('auth.login.phone_10_digits_only'));
      return;
    }

    const result = await sendOTP(phoneOrEmail, 'login');
    if (result.success) {
      setStep('otp');
    } else if (result.needsVerification && result.phoneOrEmail) {
      // Show verification modal for unverified users
      setVerificationPhone(result.phoneOrEmail);
      setShowVerificationModal(true);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const phoneOrEmail = loginMethod === 'otp' ? formData.phone : formData.email;
    
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error(t('auth.login.invalid_otp'));
      return;
    }

    const result = await verifyOTP(phoneOrEmail, formData.otp, 'login');
    if (result.success) {
      // Redirect based on user role
      if (result.user.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else if (result.needsVerification && result.phoneOrEmail) {
      // Show verification modal for unverified users
      setVerificationPhone(result.phoneOrEmail);
      setShowVerificationModal(true);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    const inputValue = formData.email || formData.phone;
    if (!inputValue) {
      toast.error(t('auth.login.enter_email_or_phone') || t('auth.login.enter_phone'));
      return;
    }
    let credentials = { password: formData.password };
    if (inputValue.includes('@')) {
      credentials.email = inputValue;
    } else if (/^\+?\d{7,15}$/.test(inputValue)) {
      credentials.phone = inputValue;
    } else {
      toast.error(t('auth.login.email_or_phone_invalid') || "Please enter a valid email or 10-digit phone number.");
      return;
    }

    const result = await login(credentials);
    if (result.success) {
      // Redirect based on user role
      if (result.user.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else if (result.needsVerification && result.phoneOrEmail) {
      // Show verification modal for unverified users
      setVerificationPhone(result.phoneOrEmail);
      setShowVerificationModal(true);
    }
  };

  const handleModalOTPSent = async (phone) => {
    return await sendOTP(phone, 'verify_phone');
  };

  const handleModalOTPVerified = async (phone, otp) => {
    const result = await verifyOTP(phone, otp, 'verify_phone');
    if (result.success) {
      // Redirect based on user role after verification
      if (result.user?.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
    return result;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-12"
            src="/baitk-logo.png"
            alt="Baitak"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.login.subtitle')}{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
              {t('auth.login.sign_up_link')}
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Login Method Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              onClick={() => {
                setLoginMethod('otp');
                setStep('phone');
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'otp'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.login.login_with_phone')}
            </button>
            <button
              onClick={() => {
                setLoginMethod('password');
                setStep('phone');
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'password'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.login.password_login')}
            </button>
          </div>

          {loginMethod === 'otp' ? (
            // OTP Login Flow
            <form onSubmit={step === 'phone' ? handleSendOTP : handleVerifyOTP} className="space-y-6">
              {step === 'phone' ? (
                <>
                  <div>
                    <label htmlFor="phone" className="label">
                      {t('auth.login.phone')}
                    </label>
                    {localStorage.getItem('guest_phone') && (
                      <p className="text-sm text-blue-600 mb-2">
                        {t('auth.login.guestPhonePrefilled')}
                      </p>
                    )}
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          // Only allow numeric values, max 10 digits
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length > 10) value = value.substring(0, 10);
                          setFormData({ ...formData, phone: value });
                        }}
                        className="input pl-10"
                        placeholder={t('auth.login.phone_placeholder')}
                        disabled={!!localStorage.getItem('guest_phone')}
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-primary">
                    {t('auth.login.send_otp')}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="label">{t('auth.login.verify_otp')}</label>
                    <p className="text-sm text-gray-600 mb-4">
                      {t('auth.login.otp_sent')} {formData.phone}
                    </p>
                    <CustomOTPInput
                      value={formData.otp}
                      onChange={(otp) => setFormData({ ...formData, otp })}
                      numInputs={6}
                      separator={<span className="mx-2">-</span>}
                      inputStyle="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      containerStyle="flex justify-center"
                      shouldAutoFocus
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="flex-1 btn-secondary"
                    >
                      {t('common.back')}
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      {t('auth.login.verify_otp')}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendOTP({ preventDefault: () => {} })}
                    className="w-full text-sm text-primary-600 hover:text-primary-500"
                  >
                    {t('auth.login.resend_otp')}
                  </button>
                </>
              )}
            </form>
          ) : (
            // Password Login Flow
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="label">
                  {t('auth.login.email_or_phone_placeholder') || t('auth.login.email')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    value={formData.email || formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      // If the value is only digits with an optional leading +, treat as phone
                      const isPhoneLike = /^\+?\d*$/.test(value);
                      if (isPhoneLike) {
                        // Limit length to 16 to cover international formats
                        const phoneValue = value.length > 16 ? value.slice(0, 16) : value;
                        setFormData({ ...formData, phone: phoneValue, email: '' });
                      } else {
                        // Anything else (letters, symbols, typical email chars) treat as email
                        setFormData({ ...formData, email: value, phone: '' });
                      }
                    }}
                    className="input pl-10"
                    placeholder={t('auth.login.email_or_phone_placeholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="label">
                  {t('auth.login.password')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input pl-10 pr-10"
                    placeholder={t('auth.login.password')}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    {t('auth.login.remember_me')}
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    {t('auth.login.forgot_password')}
                  </a>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary">
                {t('auth.login.login_button')}
              </button>
            </form>
          )}

          
        </div>
      </div>

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        phone={verificationPhone}
        onOTPSent={handleModalOTPSent}
        onOTPVerified={handleModalOTPVerified}
      />
    </div>
  );
};

export default Login;
