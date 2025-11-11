import React from 'react';
import { Link } from 'react-router-dom';
import { HiCheckCircle, HiClock, HiMail } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const ProviderRegistrationSuccess = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('providerRegistrationSuccess.title')}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {t('providerRegistrationSuccess.message')}
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-4">{t('providerRegistrationSuccess.whatHappensNext')}</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <HiClock className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">{t('providerRegistrationSuccess.reviewProcess.title')}</p>
                  <p className="text-sm text-blue-700">
                    {t('providerRegistrationSuccess.reviewProcess.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <HiMail className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">{t('providerRegistrationSuccess.emailNotification.title')}</p>
                  <p className="text-sm text-blue-700">
                    {t('providerRegistrationSuccess.emailNotification.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <HiCheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">{t('providerRegistrationSuccess.startEarning.title')}</p>
                  <p className="text-sm text-blue-700">
                    {t('providerRegistrationSuccess.startEarning.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link to="/" className="btn-primary w-full">
              {t('providerRegistrationSuccess.backToHome')}
            </Link>
            <Link to="/services" className="btn-outline w-full">
              {t('providerRegistrationSuccess.browseServices')}
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('providerRegistrationSuccess.haveQuestions')} {' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('providerRegistrationSuccess.contactSupport')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistrationSuccess;
