import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
                import { categoryAPI, providerAPI,ratingAPI } from "../../services/api";

import { useTranslation } from "react-i18next";
export default function CustomerReviews() {

  const [loading, setLoading] = useState(true);
  const [reviews,setReviews]=useState([]);

  // Avatar colors for different users
  const avatarColors = [
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500'
  ];
  const { t ,i18n} = useTranslation();
  const isArabic = i18n.language === "ar";
  // Get initials from name
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  };

  // Format location (you can modify this based on your data)
  const getLocation = (customer) => {
    // If you have location data in customer object, use it
    // Otherwise, return a default
    return customer.city || 'Amman, Jordan';
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       // Replace this with your actual API call
//       // const { data } = await ratingAPI.getData();
      
//       // Mock data for demonstration
//     //   const mockData = {
//     //     success: true,
//     //     data: [
//     //       {
//     //         id: 1,
//     //         rating: 5,
//     //         review: "Excellent service! I found a reliable electrician within minutes. The booking process was smooth and the professional arrived on time. Highly recommend Baitak!",
//     //         customer: { id: 1, first_name: 'Ahmed', last_name: 'Hassan', profile_image: null },
//     //         created_at: "2025-11-17T13:31:52.000Z"
//     //       },
//     //       {
//     //         id: 2,
//     //         rating: 5,
//     //         review: "The plumber I hired through Baitak was professional and solved my problem quickly. The platform is user-friendly and prices are transparent. Great experience!",
//     //         customer: { id: 2, first_name: 'Layla', last_name: 'Mohammad', profile_image: null },
//     //         created_at: "2025-11-16T10:20:00.000Z"
//     //       },
//     //       {
//     //         id: 3,
//     //         rating: 4,
//     //         review: "Very satisfied with the cleaning service. The provider was verified and trustworthy. The AI assistant helped me find the right service quickly!",
//     //         customer: { id: 3, first_name: 'Khaled', last_name: 'Ahmad', profile_image: null },
//     //         created_at: "2025-11-15T14:45:00.000Z"
//     //       },
//     //       {
//     //         id: 4,
//     //         rating: 5,
//     //         review: "Best platform for home services in Jordan! I've used it multiple times for different services. All providers were professional and reasonably priced.",
//     //         customer: { id: 4, first_name: 'Sara', last_name: 'Mahmoud', profile_image: null },
//     //         created_at: "2025-11-14T09:30:00.000Z"
//     //       },
//     //       {
//     //         id: 5,
//     //         rating: 5,
//     //         review: "The Name-The-Estimate feature is brilliant! I set my budget and providers competed for my job. Saved money and got quality work done.",
//     //         customer: { id: 5, first_name: 'Omar', last_name: 'Yousef', profile_image: null },
//     //         created_at: "2025-11-13T16:00:00.000Z"
//     //       },
//     //       {
//     //         id: 6,
//     //         rating: 4,
//     //         review: "Great platform with verified providers. The rating system gives me confidence in choosing the right professional. Customer support is also responsive.",
//     //         customer: { id: 6, first_name: 'Rania', last_name: 'Ali', profile_image: null },
//     //         created_at: "2025-11-12T11:15:00.000Z"
//     //       }
//     //     ]
//     //   };
      
//       if (mockData.success) {
//         setformattedReviews(mockData.data);
//       }
      
//       // Uncomment this for actual API call:
//       // if (data.success) {
//       //   setReviews(data.data);
//       // }
//     } catch (err) {
//       console.error('Error fetching reviews:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
const fetchReviews = async () => {
  try {
    setLoading(true);
    // Use the ratingAPI method instead of direct axios call
    const { data } = await ratingAPI.getData();
    console.log('API Response:', data);
    
    if (data.success) {
      setReviews(data.data);
      console.log("Reviews set:", data.data);
    } else {
      console.error('API returned success: false', data.message);
    }
  } catch (err) {
    console.error('Error fetching reviews:', err);
    console.error('Error details:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data
    });
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("home.customer_testo")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("home.join")}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    avatarColors[index % avatarColors.length]
                  }`}
                >
                  {getInitials(
                    review.customer.first_name,
                    review.customer.last_name
                  )}
                </div>

                {/* Name and Location */}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.customer.first_name} {review.customer.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getLocation(review.customer)}
                  </p>
                </div>
              </div>

              {/* Rating Stars */}
              {renderStars(review.rating)}

              {/* Review Text */}
             <p className="text-gray-600 leading-relaxed text-start md:text-left">
  "{isArabic ? review?.review_ar : review.review}"
</p>
            </div>
          ))}
        </div>

        {/* Read More Button */}
        <div className="flex justify-center">
          <button className="px-8 py-3 border-2 border-green-500 text-green-500 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-300">
            {t("home.read-more")}
          </button>
        </div>
      </div>
    </div>
  );
}