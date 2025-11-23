import React from "react";
                import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; 

export default function CallToActionSection() {
                        const { t } = useTranslation();

  return (
    <div className="w-full bg-white py-20 px-4 md:px-12 lg:px-24 text-center">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
       {t('home.cta_section.title')}
      </h2>

      {/* Subtitle */}
      <p className="text-gray-600 text-base md:text-lg mb-10">
        {t('home.cta_section.subtitle')}
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button >
           <Link to="/provider/register" className="bg-green-600 hover:bg-green-700 transition text-white font-medium px-8 py-3 rounded-md text-sm md:text-base">
              {t('home.cta_section.become_provider')}
            </Link>
        </button>

        <button >
          <Link to="/services" className="border border-green-600 text-green-600 hover:bg-green-50 transition font-medium px-8 py-3 rounded-md text-sm md:text-base">
              {t('home.cta_section.find_service')}
            </Link>
        </button>
      </div>
    </div>
  );
}