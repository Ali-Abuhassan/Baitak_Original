import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiCheckCircle, 
  HiUsers, 
  HiStar, 
  HiShieldCheck,
  HiTrendingUp,
  HiHeart,
  HiLightBulb
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t, i18n } = useTranslation();
  
  const stats = [
    { label: t('about.stats.active_users'), value: '10,000+', icon: HiUsers },
    { label: t('about.stats.service_providers'), value: '500+', icon: HiShieldCheck },
    { label: t('about.stats.services_completed'), value: '50,000+', icon: HiCheckCircle },
    { label: t('about.stats.average_rating'), value: '4.8/5', icon: HiStar },
  ];

  const values = [
    {
      icon: HiHeart,
      title: t('about.values.customer_first.title'),
      description: t('about.values.customer_first.description'),
    },
    {
      icon: HiShieldCheck,
      title: t('about.values.trust_safety.title'),
      description: t('about.values.trust_safety.description'),
    },
    {
      icon: HiLightBulb,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
    },
    {
      icon: HiTrendingUp,
      title: t('about.values.growth_together.title'),
      description: t('about.values.growth_together.description'),
    },
  ];

  const team = [
    {
      name: 'Ahmed Hassan',
      role: t('about.team.ceo.role'),
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      bio: t('about.team.ceo.bio'),
    },
    {
      name: 'Sarah Johnson',
      role: t('about.team.coo.role'),
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      bio: t('about.team.coo.bio'),
    },
    {
      name: 'Michael Chen',
      role: t('about.team.cto.role'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: t('about.team.cto.bio'),
    },
    {
      name: 'Maria Garcia',
      role: t('about.team.customer_success.role'),
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
      bio: t('about.team.customer_success.bio'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20">
        <div className="container-custom text-center">
          <p className="text-2xl md:text-3xl font-semibold mb-4">{t('about.hero.tagline')}</p>
          {/* <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about.hero.title')}</h1> */}
          <p className="text-xl max-w-3xl mx-auto">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Intro Section - About Baitak */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{t('about.intro.title')}</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p className="text-lg leading-relaxed">
                {t('about.intro.paragraph1')}
              </p>
              <blockquote className={`${i18n.language === 'ar' ? 'l-4 pl-4' : 'r-4 pr-4'} py-2 text-xl font-medium text-primary-700 italic`}>
                {t('about.intro.quote')}
              </blockquote>
              <p className="text-lg leading-relaxed font-semibold text-primary-700">
                {t('about.intro.paragraph2')}
              </p>
              {i18n.language === 'ar' && (
                <>
                  <p className="text-lg leading-relaxed">
                    {t('about.intro.paragraph3')}
                  </p>
                  <p className="text-lg leading-relaxed">
                    {t('about.intro.paragraph4')}
                  </p>
                  <p className="text-lg leading-relaxed">
                    {t('about.intro.paragraph5')}
                  </p>
                  <p className="text-lg leading-relaxed font-semibold text-primary-600 mt-6">
                    {t('about.intro.paragraph6')}
                  </p>
                </>
              )}
              {i18n.language !== 'ar' && (
                <>
                  <p className="text-lg leading-relaxed">
                    {t('about.intro.paragraph3')}
                  </p>
                  <p className="text-lg leading-relaxed">
                    {t('about.intro.paragraph4')}
                  </p>
                  <p className="text-lg leading-relaxed font-semibold text-primary-600 mt-6">
                    {t('about.intro.paragraph5')}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.impact.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-4">{t('about.mission.title')}</h3>
              <p className="text-gray-600">
                {t('about.mission.description')}
              </p>
            </div>
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-4">{t('about.vision.title')}</h3>
              <p className="text-gray-600">
                {t('about.vision.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <value.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">{t('about.team.title')}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('about.team.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-6 text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">{t('about.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services" className="btn bg-white text-primary-600 hover:bg-gray-100">
              {t('about.cta.find_services')}
            </Link>
            <Link to="/provider/register" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10">
              {t('about.cta.become_provider')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;