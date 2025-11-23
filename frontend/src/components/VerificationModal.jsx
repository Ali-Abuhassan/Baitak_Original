import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiX, HiPhone } from 'react-icons/hi';
import CustomOTPInput from './sharedInputs/CustomOTPInput';
import toast from 'react-hot-toast';

const VerificationModal = ({ isOpen, onClose, phone, onOTPSent, onOTPVerified }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState('send'); // 'send' or 'verify'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('send');
      setOtp('');
      setCooldown(0);
    }
  }, [isOpen]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async () => {
    if (!phone) {
      toast.error(t('auth.verificationModal.phoneRequired'));
      return;
    }

    setLoading(true);
    try {
      if (onOTPSent) {
        const result = await onOTPSent(phone);
        if (result?.success) {
          setStep('verify');
          setCooldown(60);
          toast.success(t('auth.verificationModal.otpSent'));
        }
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error(t('auth.verificationModal.invalidOtp'));
      return;
    }

    setLoading(true);
    try {
      if (onOTPVerified) {
        const result = await onOTPVerified(phone, otp);
        if (result?.success) {
          handleClose();
          toast.success(t('auth.verificationModal.verificationSuccess'));
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) {
      toast.error(t('auth.verificationModal.cooldown', { seconds: cooldown }));
      return;
    }
    await handleSendOTP();
  };

  const handleClose = () => {
    setStep('send');
    setOtp('');
    setCooldown(0);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <HiPhone className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('auth.verificationModal.title')}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {step === 'send' ? (
            <>
              <p className="text-gray-600 mb-6">
                {t('auth.verificationModal.description', { phone })}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiPhone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      {t('auth.verificationModal.phoneNumber')}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      {phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('common.loading') : t('auth.verificationModal.sendOtp')}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                {t('auth.verificationModal.otpSentDescription', { phone })}
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="label">{t('auth.verificationModal.enterOtp')}</label>
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
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('common.loading') : t('auth.verificationModal.verifyButton')}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading || cooldown > 0}
                    className={`text-sm ${
                      cooldown > 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-primary-600 hover:text-primary-500'
                    }`}
                  >
                    {cooldown > 0
                      ? t('auth.verificationModal.resendIn', { seconds: cooldown })
                      : t('auth.verificationModal.resendOtp')
                    }
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('send')}
                    className="text-sm text-gray-600 hover:text-gray-500"
                  >
                    {t('common.back')}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;

