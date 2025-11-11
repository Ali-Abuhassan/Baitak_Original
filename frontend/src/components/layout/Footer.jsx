import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    [t('footer.company')]: [
      { name: t('footer.links.aboutUs'), href: '/about' },
      { name: t('footer.links.contact'), href: '/contact' },
      { name: t('footer.links.careers'), href: '/careers' },
      { name: t('footer.links.press'), href: '/press' },
    ],
    [t('footer.services')]: [
      { name: t('footer.links.browseServices'), href: '/services' },
      { name: t('footer.links.popularCategories'), href: '/services' },
      { name: t('footer.links.serviceAreas'), href: '/areas' },
      { name: t('footer.links.pricing'), href: '/pricing' },
    ],
    [t('footer.support')]: [
      { name: t('footer.links.helpCenter'), href: '/help' },
      { name: t('footer.links.safety'), href: '/safety' },
      { name: t('footer.links.termsOfService'), href: '/terms' },
      { name: t('footer.links.privacyPolicy'), href: '/privacy' },
    ],
    [t('footer.forProviders')]: [
      { name: t('footer.links.becomeProvider'), href: '/provider/register' },
      { name: t('footer.links.providerDashboard'), href: '/provider/dashboard' },
      { name: t('footer.links.providerResources'), href: '/provider/resources' },
      { name: t('footer.links.successStories'), href: '/success-stories' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container-custom py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/baitk-logo.png" alt="Baitak" className="h-8 w-8" />
              <span className="text-xl font-bold">Baitak</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.description')}
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">{t('footer.newsletter.title')}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {t('footer.newsletter.description')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <input
                type="email"
                placeholder={t('footer.newsletter.emailPlaceholder')}
                className="flex-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              <button className="btn-primary w-full sm:w-auto">{t('footer.newsletter.subscribe')}</button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">{t('footer.availableOn')}</span>
              <button className="text-gray-400 hover:text-white text-sm">
                {t('footer.appStore')}
              </button>
              <button className="text-gray-400 hover:text-white text-sm">
                {t('footer.googlePlay')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
