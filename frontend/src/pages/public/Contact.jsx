import React, { useState } from 'react';
import { 
  HiPhone, 
  HiMail, 
  HiLocationMarker, 
  HiClock,
  HiChat,
  HiQuestionMarkCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
  });

  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: HiPhone,
      title: t('contact.info.phone.title'),
      details: '+1 (555) 123-4567',
      subtext: t('contact.info.phone.subtext'),
    },
    {
      icon: HiMail,
      title: t('contact.info.email.title'),
      details: 'support@baitak.com',
      subtext: t('contact.info.email.subtext'),
    },
    {
      icon: HiLocationMarker,
      title: t('contact.info.office.title'),
      details: '123 Business Avenue',
      subtext: 'New York, NY 10001',
    },
    {
      icon: HiClock,
      title: t('contact.info.hours.title'),
      details: t('contact.info.hours.details'),
      subtext: '9:00 AM - 6:00 PM EST',
    },
  ];

  const faqs = [
    {
      question: t('contact.faqs.book_service.question'),
      answer: t('contact.faqs.book_service.answer'),
    },
    {
      question: t('contact.faqs.verified_providers.question'),
      answer: t('contact.faqs.verified_providers.answer'),
    },
    {
      question: t('contact.faqs.cancel_booking.question'),
      answer: t('contact.faqs.cancel_booking.answer'),
    },
    {
      question: t('contact.faqs.become_provider.question'),
      answer: t('contact.faqs.become_provider.answer'),
    },
    {
      question: t('contact.faqs.payment_security.question'),
      answer: t('contact.faqs.payment_security.answer'),
    },
    {
      question: t('contact.faqs.pricing.question'),
      answer: t('contact.faqs.pricing.answer'),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // In a real app, this would send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('contact.form.success_message'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general',
      });
    } catch (error) {
      toast.error(t('contact.form.error_message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('contact.hero.title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="card p-6 text-center">
                <info.icon className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium">{info.details}</p>
                <p className="text-sm text-gray-600">{info.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('contact.form.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">{t('contact.form.name')}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder={t('contact.form.name_placeholder')}
                    />
                  </div>
                  <div>
                    <label className="label">{t('contact.form.email')}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder={t('contact.form.email_placeholder')}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">{t('contact.form.phone')}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                      placeholder={t('contact.form.phone_placeholder')}
                    />
                  </div>
                  <div>
                    <label className="label">{t('contact.form.inquiry_type')}</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="input"
                    >
                      <option value="general">{t('contact.form.inquiry_types.general')}</option>
                      <option value="support">{t('contact.form.inquiry_types.support')}</option>
                      <option value="provider">{t('contact.form.inquiry_types.provider')}</option>
                      <option value="partnership">{t('contact.form.inquiry_types.partnership')}</option>
                      <option value="feedback">{t('contact.form.inquiry_types.feedback')}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="label">{t('contact.form.subject')}</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input"
                    placeholder={t('contact.form.subject_placeholder')}
                  />
                </div>
                
                <div>
                  <label className="label">{t('contact.form.message')}</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input min-h-[150px]"
                    placeholder={t('contact.form.message_placeholder')}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full md:w-auto"
                >
                  {loading ? t('contact.form.sending') : t('contact.form.send')}
                </button>
              </form>
            </div>
            
            {/* Map / Office Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('contact.office.title')}</h2>
              <div className="card h-[400px] overflow-hidden mb-6">
                {/* In production, replace with actual map */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <HiLocationMarker className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t('contact.office.map_placeholder')}</p>
                    <p className="text-sm text-gray-500 mt-2">123 Business Avenue, New York, NY</p>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="font-semibold mb-4">{t('contact.office.other_ways')}</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-gray-600 hover:text-primary-600">
                    <HiChat className="w-5 h-5 mr-3" />
                    {t('contact.office.live_chat')}
                  </a>
                  <a href="#" className="flex items-center text-gray-600 hover:text-primary-600">
                    <HiQuestionMarkCircle className="w-5 h-5 mr-3" />
                    {t('contact.office.help_center')}
                  </a>
                  <a href="mailto:support@baitak.com" className="flex items-center text-gray-600 hover:text-primary-600">
                    <HiMail className="w-5 h-5 mr-3" />
                    {t('contact.office.email_support')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">{t('contact.faqs.title')}</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="card p-6 cursor-pointer group">
                  <summary className="flex items-center justify-between font-semibold">
                    {faq.question}
                    <span className="ml-4 flex-shrink-0 text-primary-600">
                      <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">{t('contact.cta.title')}</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('contact.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+15551234567" className="btn-primary">
              <HiPhone className="mr-2 inline" />
              {t('contact.cta.call_us')}
            </a>
            <a href="mailto:support@baitak.com" className="btn-outline">
              <HiMail className="mr-2 inline" />
              {t('contact.cta.email_support')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;