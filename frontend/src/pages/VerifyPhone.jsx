import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomOTPInput from '../components/CustomOTPInput';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const VerifyPhone = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOTP, verifyOTP, isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Get phone number from location state or user data
    const phoneFromState = location.state?.phone;
    const userPhone = user?.phone;
    setPhone(phoneFromState || userPhone || '');
  }, [location.state, user]);

  // Only redirect if already authenticated (after OTP verification)
  // Don't redirect during signup flow - user should verify OTP first
  useEffect(() => {
    // Only redirect if user is authenticated AND we have a user object
    // This means OTP verification was successful and user is now logged in
    if (isAuthenticated && user) {
      // Redirect based on user role after successful verification
      if (user?.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error(t('verifyPhone.errors.invalidOtp'));
      return;
    }

    if (!phone) {
      toast.error(t('verifyPhone.errors.phoneNotFound'));
      return;
    }

    try {
      setLoading(true);
      const result = await verifyOTP(phone, otp, 'verify_phone');
      
      if (result.success) {
        toast.success(t('verifyPhone.messages.verificationSuccess'));
        // After successful verification, user is already logged in (token saved in AuthContext)
        // Redirect based on user role
        if (result.user?.role === 'provider') {
          navigate('/provider/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(t('verifyPhone.errors.invalidOtpTryAgain'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) {
      toast.error(t('verifyPhone.errors.cooldown', { seconds: cooldown }));
      return;
    }
    if (!phone) {
      toast.error(t('verifyPhone.errors.phoneNotFound'));
      return;
    }
    setLoading(true);
    try {
      // First try with 'verify_phone' purpose (signup verification)
      const result = await sendOTP(phone, 'verify_phone');
      if (result.success) {
        setCooldown(60);
        toast.success(t('verifyPhone.messages.otpSent'));
        return;
      }
      // If not success, check for 409 and fallback below
    } catch (error) {
      const errMsg = error.response?.data?.message || '';
      if ((error.response?.status === 409) && /موجود بالفعل|already exists|existe déjà/i.test(errMsg)) {
        // Try fallback with 'login' purpose
        try {
          const loginResult = await sendOTP(phone, 'login');
          if (loginResult.success) {
            setCooldown(60);
            toast.success(t('verifyPhone.messages.otpSent'));
            return;
          } else {
            throw new Error('Retry with login failed');
          }
        } catch (loginError) {
          toast.error(t('verifyPhone.errors.phoneAlreadyExists') !== 'verifyPhone.errors.phoneAlreadyExists'
            ? t('verifyPhone.errors.phoneAlreadyExists')
            : (t('common.lang') === 'ar'
                ? 'رقم الهاتف هذا مسجل بالفعل. يرجى تسجيل الدخول أو استخدام رقم آخر.'
                : 'This phone number is already registered. Please log in or use another number.'
              )
          );
        }
      } else if (error.response?.status === 429) {
        setCooldown(120);
        toast.error(t('verifyPhone.errors.tooManyRequests'));
      } else {
        toast.error(t('verifyPhone.errors.sendFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

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
            {t('verifyPhone.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('verifyPhone.subtitle', { phone })}
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="label">{t('verifyPhone.enterOtp')}</label>
              <CustomOTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                separator={<span className="mx-2">-</span>}
                inputStyle="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                containerStyle="flex justify-center"
                shouldAutoFocus
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full btn-primary"
              >
                {loading ? t('verifyPhone.verifying') : t('verifyPhone.verifyButton')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading || cooldown > 0}
                className={`text-sm ${cooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-500'}`}
              >
                {cooldown > 0 ? t('verifyPhone.resendIn', { seconds: cooldown }) : t('verifyPhone.resendOtp')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                {t('verifyPhone.backToSignup')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
