// import React from "react";

// export default function WhyChooseBaitak() {
//   const features = [
//     {
//       icon: "🛡️",
//       title: "Trust & Security",
//       desc: "All service providers are thoroughly vetted and verified for your safety.",
//     },
//     {
//       icon: "⭐",
//       title: "Quality Guaranteed",
//       desc: "Read reviews and ratings from real customers to make informed decisions.",
//     },
//     {
//       icon: "📍",
//       title: "Local Services",
//       desc: "Find trusted professionals in your area for all your home needs.",
//     },
//   ];

//   return (
//     <div className="w-full bg-cover bg-center py-20 px-6" style={{ backgroundImage: `url('/mnt/data/4f494442-cd3f-44e5-9bd8-cdc12e2306c8.png')` }}>
//       <div className="backdrop-blur-sm bg-black/40 w-full h-full py-14 rounded-3xl">
//         <h2 className="text-white text-4xl font-semibold text-center mb-3">Why Choose Baitak?</h2>
//         <p className="text-white/80 text-center text-lg mb-12">
//           Your trusted partner for quality home services
//         </p>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//           {features.map((item, idx) => (
//             <div
//               key={idx}
//               className="bg-white rounded-2xl p-10 text-center shadow-md hover:shadow-lg transition"
//             >
//               <div className="flex justify-center mb-6 text-4xl">{item.icon}</div>
//               <h3 className="text-gray-900 font-semibold text-xl mb-3">{item.title}</h3>
//               <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { ShieldCheck, Star, MapPin } from 'lucide-react';
import { HiShieldCheck } from 'react-icons/hi';
import { useTranslation } from "react-i18next";

export default function WhyChooseBaitak() {
    const { t } = useTranslation();
  const features = [
    {
      icon: <HiShieldCheck/>,
      title: t("home.features.verified.title"),
      desc: t("home.features.verified.description"),
    },
    {
      icon: "⭐",
      title: t("home.features.quality.title"),
      desc: t("home.features.quality.description"),
    },
    {
      icon: "📍",
      title: t("home.features.local.title"),
      desc: t("home.features.local.description"),
    },
  ];

  return (
    <div className="w-full h-full bg-cover bg-center  " style={{ backgroundImage: `url('public/7c9a6c8b30a298bae43ae5cf2ed50fa2bdb3212b.jpg')` }}>
      <div className="backdrop-blur-sm bg-black/40 w-full h-full py-14">
<h2 className="text-white text-4xl font-semibold text-center mb-3">{t("home.features.choose")}</h2>
        <p className="text-white/80 text-center text-lg mb-12">
        {t("home.features.trusted")}
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-10 text-center shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-gray-900 font-semibold text-xl mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
