// src/components/home/FeaturedProvidersSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { HiSearch, HiLocationMarker, HiStar, HiCheckCircle, HiCalendar } from 'react-icons/hi';

const FeaturedProvidersSection = ({ providers, isLoading, error }) => {
  if (isLoading) {
    return <p className="text-center py-10 text-gray-500">Loading providers...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">Failed to load providers.</p>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Featured Providers</h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {console.log(providers)}
          {providers?.map((provider) => (
            <div
              key={provider.id}
              className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
            >
             <img
                       src={provider.user?.profile_image 
                         ? `/uploads/profiles/${provider.user.profile_image}`
                         : `https://ui-avatars.com/api/?name=${provider.user?.first_name}+${provider.user?.last_name}&background=random`}
                      alt={provider.business_name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                   />
              <h3 className="text-lg font-semibold mt-4">{provider.
business_name
}</h3>
              {console.log(provider?.name)}
              <p className="text-gray-500 text-sm mt-1">{provider.category.name}</p>
               <div className="flex text-yellow-400">
                       {[...Array(5)].map((_, i) => (
                        <HiStar
                          key={i}
                          className={i < Math.floor(provider.rating_avg || 0) ? 'fill-current' : 'fill-gray-300'}
                        />
                      ))}
                    </div>
              <Link
                to={`/providers/${provider.id}`}
                className="text-blue-600 text-sm mt-3 inline-block hover:underline"
              >
                View Profile →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProvidersSection;
