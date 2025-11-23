// import React, { useState, useEffect } from 'react';/
// import { Link, useNavigate } from 'react-router-dom';/
import { HiSearch, HiLocationMarker, HiStar, HiCheckCircle, HiCalendar } from 'react-icons/hi';
// import {serviceAPI, searchAPI } from '../../services/api';
// import ServiceCard from '../../services/ServiceCard';
// import CategoryTile from '../../services/CategoryTile';
// import toast from 'react-hot-toast';/
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';


// const Home = () => {
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState('');
//   const [location, setLocation] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [featuredProviders, setFeaturedProviders] = useState([]);
//   const [searchSuggestions, setSearchSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch categories and featured providers with filtering
//       const [categoriesRes, providersRes] = await Promise.all([
//         categoryAPI.getAll(),
//         providerAPI.getAll({ 
//           limit: 4, 
//           min_rating: 4.0,
//           status: 'approved',
//           page: 1
//         })
//       ]);
      
//       // Handle the API response structure: { success: true, data: { categories: [...] } }
//       const categoriesData = categoriesRes.data?.data?.categories || 
//                             categoriesRes.data?.categories || 
//                             categoriesRes.data || [];
      
//       // Handle providers response structure - providers are directly in data array
//       const providersData = providersRes.data?.data || [];

      
//       setCategories(Array.isArray(categoriesData) ? categoriesData : []);
//       setFeaturedProviders(Array.isArray(providersData) ? providersData : []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       console.error('Error details:', error.response?.data || error.message);
//       toast.error(t('home.errors.load_data_failed'));
      
//       // Set empty arrays on error
//       setCategories([]);
//       setFeaturedProviders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSearchSuggestions = async (query) => {
//     if (!query.trim() || query.length < 2) {
//       setSearchSuggestions([]);
//       setShowSuggestions(false);
//       return;
//     }

//     try {
//       setSearchLoading(true);
//       const response = await searchAPI.getSuggestions({ q: query });
      
//       // Check if response is HTML (API server not available)
//       if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
//         console.warn('Search suggestions API not available');
//         setSearchSuggestions([]);
//         setShowSuggestions(false);
//         return;
//       }
      
//       // Parse the API response structure
//       const suggestions = response.data?.data?.suggestions || response.data?.suggestions || response.data || [];
      
//       // Ensure suggestions is always an array
//       const suggestionsArray = Array.isArray(suggestions) ? suggestions : [];
      
//       // Use API suggestions or empty array
//       const finalSuggestions = suggestionsArray;
      
//       setSearchSuggestions(finalSuggestions);
//       setShowSuggestions(finalSuggestions.length > 0);
//     } catch (error) {
//       console.error('Suggestions error:', error);
//       console.error('Error details:', error.response?.data || error.message);
      
//       // Set empty suggestions on error
//       setSearchSuggestions([]);
//       setShowSuggestions(false);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleSearchInputChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
    
//     // Debounce the suggestions call
//     clearTimeout(window.searchTimeout);
//     window.searchTimeout = setTimeout(() => {
//       getSearchSuggestions(value);
//     }, 300);
//   };

//   const handleSuggestionClick = (suggestion) => {
//     const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.text;
//     setSearchQuery(suggestionText);
//     setShowSuggestions(false);
    
//     // Handle different suggestion types - navigate to services page
//     if (typeof suggestion === 'object' && suggestion.type === 'category' && suggestion.slug) {
//       navigate(`/services?category=${suggestion.slug}&search=${suggestionText}&location=${location}`);
//     } else {
//       navigate(`/services?search=${suggestionText}&location=${location}`);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
    
//     if (!searchQuery.trim()) {
//       toast.error(t('home.errors.search_required'));
//       return;
//     }
    
//     setShowSuggestions(false);
//     navigate(`/services?search=${searchQuery}&location=${location}`);
//   };




//   return (
  //     <div className="min-h-screen">
  //       {/* Hero Section */}
  //       <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
  //         <div className="container-custom">
  //           <div className="text-center mb-12">
  //             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
  //               {t('home.title')}
  //             </h1>
  //             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
  //               {t('home.subtitle')}
  //             </p>
  //           </div>
  
  //           {/* Search Bar */}
  //           <form onSubmit={handleSearch} className="max-w-4xl mx-auto" dir={isArabic ? 'rtl' : 'ltr'}>
  //             <div className={isArabic ? "bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row-reverse gap-2 relative" : "bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2 relative"}>
  //               {/* In RTL, button first, then city, then service input */}
  //               {isArabic ? (
    //                 <>
    //                   <button type="submit" className="btn-primary px-8 order-1 md:order-none">
    //                     {t('common.search')}
    //                   </button>
    //                   <div className="flex items-center px-4 border-l order-2 md:order-none">
    //                     <HiLocationMarker className="text-gray-400 ml-2" />
    //                     <input
    //                       type="text"
    //                       placeholder={t('home.location_placeholder')}
    //                       value={location}
    //                       onChange={(e) => setLocation(e.target.value)}
    //                       className={isArabic ? "w-full py-3 focus:outline-none text-right" : "w-full py-3 focus:outline-none text-left"}
    //                       style={{ textAlign: isArabic ? 'right' : 'left' }}
    //                     />
    //                   </div>
    //                   <div className="flex-1 flex items-center px-4 relative order-3 md:order-none">
    //                     <HiSearch className="text-gray-400 ml-2" />
    //                     <input
    //                       type="text"
    //                       placeholder={t('home.search_placeholder')}
    //                       value={searchQuery}
    //                       onChange={handleSearchInputChange}
    //                       onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
    //                       onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
    //                       className={isArabic ? "w-full py-3 focus:outline-none text-right" : "w-full py-3 focus:outline-none text-left"}
    //                       style={{ textAlign: isArabic ? 'right' : 'left' }}
    //                     />
    //                     {/* Search Suggestions Dropdown */}
    //                     {showSuggestions && (
      //                       <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
      //                         {searchLoading ? (
        //                           <div className="p-4 text-center text-gray-500">
        //                             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
        //                             <p className="mt-2">{t('home.search.loading_suggestions')}</p>
        //                           </div>
        //                         ) : Array.isArray(searchSuggestions) && searchSuggestions.length > 0 ? (
          //                           searchSuggestions.map((suggestion, index) => {
            //                             const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.text;
            //                             const suggestionType = typeof suggestion === 'object' ? suggestion.type : 'service';
            //                             const isCategory = suggestionType === 'category';
            
            //                             return (
              //                               <button
              //                                 key={index}
              //                                 type="button"
              //                                 onClick={() => handleSuggestionClick(suggestion)}
              //                                 className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center group"
              //                               >
              //                                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary-50 mr-3 flex-shrink-0">
              //                                   {isCategory ? (
                //                                     <span className="text-sm font-semibold text-primary-600">C</span>
                //                                   ) : (
                  //                                     <HiSearch className="text-gray-400 group-hover:text-primary-600" />
                  //                                   )}
                  //                                 </div>
                  //                                 <div className="flex-1">
                  //                                   <span className="text-gray-700 block">{suggestionText}</span>
                  //                                   {isCategory && (
                    //                                     <span className="text-xs text-gray-500">{t('home.search.category_label')}</span>
                    //                                   )}
                    //                                 </div>
                    //                                 {isCategory && (
                      //                                   <span className="text-xs text-primary-600 font-medium">{t('home.search.browse_label')}</span>
                      //                                 )}
                      //                               </button>
                      //                             );
                      //                           })
                      //                         ) : searchQuery.length >= 2 && (
                        //                           <div className="p-4 text-center text-gray-500">
                        //                             {t('home.search.no_suggestions', { query: searchQuery })}
                        //                           </div>
                        //                         )}
                        //                       </div>
                        //                     )}
                        //                   </div>
                        //                 </>
                        //               ) : (
                          //                 /* LTR: service, city, then button */
                          //                 <>
                          //                   <div className="flex-1 flex items-center px-4 relative order-1 md:order-none">
                          //                     <HiSearch className="text-gray-400 mr-2" />
                          //                     <input
                          //                       type="text"
                          //                       placeholder={t('home.search_placeholder')}
                          //                       value={searchQuery}
                          //                       onChange={handleSearchInputChange}
                          //                       onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                          //                       onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          //                       className={isArabic ? "w-full py-3 focus:outline-none text-right" : "w-full py-3 focus:outline-none text-left"}
                          //                       style={{ textAlign: isArabic ? 'right' : 'left' }}
                          //                     />
                          //                     {/* Search Suggestions Dropdown */}
                          //                     {showSuggestions && (
                            //                       <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                            //                         {searchLoading ? (
                              //                           <div className="p-4 text-center text-gray-500">
                              //                             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                              //                             <p className="mt-2">{t('home.search.loading_suggestions')}</p>
                              //                           </div>
                              //                         ) : Array.isArray(searchSuggestions) && searchSuggestions.length > 0 ? (
                                //                           searchSuggestions.map((suggestion, index) => {
                                  //                             const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.text;
                                  //                             const suggestionType = typeof suggestion === 'object' ? suggestion.type : 'service';
                                  //                             const isCategory = suggestionType === 'category';
                                  
                                  //                             return (
                                    //                               <button
                                    //                                 key={index}
                                    //                                 type="button"
                                    //                                 onClick={() => handleSuggestionClick(suggestion)}
                                    //                                 className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center group"
                                    //                               >
                                    //                                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary-50 mr-3 flex-shrink-0">
                                    //                                   {isCategory ? (
                                      //                                     <span className="text-sm font-semibold text-primary-600">C</span>
                                      //                                   ) : (
                                        //                                     <HiSearch className="text-gray-400 group-hover:text-primary-600" />
                                        //                                   )}
                                        //                                 </div>
                                        //                                 <div className="flex-1">
                                        //                                   <span className="text-gray-700 block">{suggestionText}</span>
                                        //                                   {isCategory && (
                                          //                                     <span className="text-xs text-gray-500">{t('home.search.category_label')}</span>
                                          //                                   )}
                                          //                                 </div>
                                          //                                 {isCategory && (
                                            //                                   <span className="text-xs text-primary-600 font-medium">{t('home.search.browse_label')}</span>
                                            //                                 )}
                                            //                               </button>
                                            //                             );
                                            //                           })
                                            //                         ) : searchQuery.length >= 2 && (
                                              //                           <div className="p-4 text-center text-gray-500">
                                              //                             {t('home.search.no_suggestions', { query: searchQuery })}
                                              //                           </div>
                                              //                         )}
                                              //                       </div>
                                              //                     )}
                                              //                   </div>
                                              //                   <div className="flex items-center px-4 border-l order-2 md:order-none">
                                              //                     <HiLocationMarker className="text-gray-400 mr-2" />
                                              //                     <input
                                              //                       type="text"
                                              //                       placeholder={t('home.location_placeholder')}
                                              //                       value={location}
                                              //                       onChange={(e) => setLocation(e.target.value)}
                                              //                       className={isArabic ? "w-full py-3 focus:outline-none text-right" : "w-full py-3 focus:outline-none text-left"}
                                              //                       style={{ textAlign: isArabic ? 'right' : 'left' }}
                                              //                     />
                                              //                   </div>
                                              //                   <button type="submit" className="btn-primary px-8 order-3 md:order-none">
                                              //                     {t('common.search')}
                                              //                   </button>
                                              //                 </>
                                              //               )}
                                              //             </div>
                                              //           </form>
                                              
                                              //           {/* Quick Search Tags */}
                                              //           <div className="flex flex-wrap justify-center gap-2 mt-6">
                                              //             <span className="text-sm text-gray-600">{t('home.hero.popularTags')}</span>
                                              //             {t('home.hero.popularServices', { returnObjects: true }).map((tag) => (
                                                //               <button
                                                //                 key={tag}
                                                //                 onClick={() => {
                                                  //                   setSearchQuery(tag);
                                                  //                   setShowSuggestions(false);
                                                  //                   navigate(`/services?search=${tag}&location=${location}`);
                                                  //                 }}
                                                  //                 className="text-sm px-3 py-1 bg-white rounded-full hover:bg-primary-50 transition-colors"
                                                  //               >
                                                  //                 {tag}
                                                  //               </button>
                                                  //             ))}
                                                  //           </div>
                                                  //         </div>
                                                  //       </section>
                                                  
                                                  
                                                  //       {/* Categories Section */}
                                                  //       <section className="py-16">
                                                  //         <div className="container-custom">
                                                  //           <div className="text-center mb-12">
                                                  //             <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.browse_categories')}</h2>
                                                  //             <p className="text-gray-600">{t('home.categories_subtitle')}</p>
                                                  //           </div>
                                                  
                                                  //           {loading ? (
                                                    //             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    //               {[...Array(8)].map((_, index) => (
                                                      //                 <div key={index} className="card p-6">
                                                      //                   <Skeleton height={150} />
                                                      //                 </div>
                                                      //               ))}
                                                      //             </div>
                                                      //           ) : Array.isArray(categories) && categories.length > 0 ? (
                                                        //             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        //               {categories.map((category) => (
//                 <CategoryTile key={category.id} category={category} />
//               ))}
//             </div>
//           ) : (
  //             <div className="text-center text-gray-500">
  //               <p>{t('home.errors.no_categories')}</p>
  //             </div>
  //           )}
  
  //           <div className="text-center mt-8">
  //             <Link to="/services" className="btn-outline">
  //               {t('home.view_all_services')}
  //             </Link>
  //           </div>
  //         </div>
  //       </section>
  
  //       {/* Featured Providers */}
  //       <section className="py-16 bg-gray-50">
  //         <div className="container-custom">
  //           <div className="text-center mb-12">
  //             <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.featured_providers')}</h2>
  //             <p className="text-gray-600">{t('home.featured_subtitle')}</p>
  //           </div>
  
  //           {loading ? (
    //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //               {[...Array(4)].map((_, index) => (
      //                 <div key={index} className="card p-6">
      //                   <Skeleton height={200} />
      //                 </div>
      //               ))}
      //             </div>
      //           ) : (
        //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        //               {featuredProviders.map((provider) => (
          //                 <div key={provider.id} className="card p-6 flex flex-col">
          //                   <div className="flex items-center mb-4">
          //                     <img
          //                       src={provider.user?.profile_image 
          //                         ? `/uploads/profiles/${provider.user.profile_image}`
          //                         : `https://ui-avatars.com/api/?name=${provider.user?.first_name}+${provider.user?.last_name}&background=random`}
          //                       alt={provider.business_name}
          //                       className="w-16 h-16 rounded-full mr-4 object-cover"
          //                     />
          //                     <div>
          //                       <h3 className="font-semibold">{provider.business_name}</h3>
          //                       <p className="text-sm text-gray-600">
          //                         {provider.user?.first_name} {provider.user?.last_name}
          //                       </p>
          //                     </div>
          //                   </div>
          //                   <div className="flex items-center mb-2">
          //                     <div className="flex text-yellow-400">
          //                       {[...Array(5)].map((_, i) => (
            //                         <HiStar
            //                           key={i}
            //                           className={i < Math.floor(provider.rating_avg || 0) ? 'fill-current' : 'fill-gray-300'}
            //                         />
            //                       ))}
            //                     </div>
            //                     <span className="ml-2 text-sm text-gray-600">
            //                       {t('home.providers.reviews', { rating: provider.rating_avg || 0, count: provider.rating_count || 0 })}
            //                     </span>
            //                   </div>
            //                   <p className="text-gray-600 text-sm mb-3 line-clamp-2">{provider.bio}</p>
            
            //                   {/* Additional provider info */}
            //                   <div className="mb-3 space-y-1">
            //                     <div className="flex justify-between text-xs text-gray-500">
            //                       <span>{t('home.providers.experience', { years: provider.experience_years })}</span>
            //                       {/* <span>{t('home.providers.min_booking', { hours: provider.min_booking_hours })}</span> */}
            //                     </div>
            //                     <div className="flex justify-between text-xs text-gray-500">
            //                       <span>{t('home.providers.bookings', { count: provider.total_bookings })}</span>
            //                       {/* <span>{t('home.providers.status', { status: provider.status })}</span> */}
            //                     </div>
            //                   </div>
            
            //                   <div className="flex justify-between items-start mt-auto">
            //                     <div>
            //                       <span className="font-semibold text-primary-600">{t('home.providers.hourly_rate', { rate: provider.hourly_rate })}</span>
            //                       <div className="text-xs text-gray-500">
            //                         {t('home.providers.available_days', { days: provider.available_days?.length || 0 })}
            //                       </div>
            //                     </div>
            //                     <Link to={`/providers/${provider.id}`} className="text-xs btn-outline -mt-6">
            //                       {t('home.providers.view_profile')}
            //                     </Link>
            //                   </div>
            //                 </div>
            //               ))}
            //             </div>
            //           )}
            //         </div>
            //       </section>
            
            //       {/* How It Works */}
            //       <section className="py-16">
            //         <div className="container-custom">
            //           <div className="text-center mb-12">
            //             <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.how_it_works.title')}</h2>
            //             <p className="text-gray-600">{t('home.how_it_works.subtitle')}</p>
            //           </div>
            
            //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            //             {howItWorks.map((step) => (
              //               <div key={step.step} className="text-center">
              //                 <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              //                   <span className="text-2xl font-bold text-primary-600">{step.step}</span>
              //                 </div>
              //                 <h3 className="font-semibold mb-2">{step.title}</h3>
              //                 <p className="text-gray-600 text-sm">{step.description}</p>
              //               </div>
              //             ))}
              //           </div>
              //         </div>
              //       </section>
              
              //       {/* Features Section */}
              //       <section className="py-16 bg-primary-50">
              //         <div className="container-custom">
              //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              //             {features.map((feature, index) => (
                //               <div key={index} className="text-center">
                //                 <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                //                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                //                 <p className="text-gray-600">{feature.description}</p>
                //               </div>
                //             ))}
                //           </div>
                //         </div>
                //       </section>
                
                //       {/* CTA Section */}
                //       <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-500">
                //         <div className="container-custom text-center">
                //           <h2 className="text-3xl font-bold text-white mb-4">
                //             {t('home.cta_section.title')}
                //           </h2>
                //           <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                //             {t('home.cta_section.subtitle')}
                //           </p>
                //           <div className="flex flex-col sm:flex-row gap-4 justify-center">
                //             <Link to="/services" className="btn bg-white text-primary-600 hover:bg-gray-100">
                //               {t('home.cta_section.find_service')}
                //             </Link>
                //             <Link to="/provider/register" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10">
                //               {t('home.cta_section.become_provider')}
                //             </Link>
                //           </div>
                //         </div>
                //       </section>
                //     </div>
                //   );
                // };
                
                // export default Home;
                
                
                import React, { useState, useEffect } from "react";
                import { Link,useNavigate } from "react-router-dom";
                import toast from "react-hot-toast";
                import { categoryAPI, providerAPI,ratingAPI } from "../../services/api";
                import axios from 'axios';
                import HeroSection from "../../components/sharedComp/HeroSection";
                import HowItWorks from "../../components/sharedComp/HowItWorks";
                import CategoriesSection from "../../components/sharedComp/CategoriesSection";
                import FeaturedProvidersSection from "../../components/sharedComp/FeaturedProvidersSection";
                import WhyChooseBaitak from '../../components/sharedComp/WhyChooseBaitak';
import { useTranslation } from 'react-i18next'; 
import CustomerReviews from '../../components/sharedComp/CustomerReviews';
import CallToActionSection from '../../components/sharedComp/CallToActionSection';

                // import HowItWorksSection from "./HowItWorksSection";
                // import FeaturesSection from "./FeaturesSection";
                // import CTASection from "./CTASection";
                
                const Home = () => {
                  const navigate = useNavigate();
                  const [searchQuery, setSearchQuery] = useState("");
                  const [location, setLocation] = useState("");
                      const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
                    const howItWorks = [
                      {
                        step: 1,
                        title: t('home.how_it_works.steps.search.title'),
                        description: t('home.how_it_works.steps.search.description'),
                      },
                      {
                        step: 2,
                        title: t('home.how_it_works.steps.choose.title'),
                        description: t('home.how_it_works.steps.choose.description'),
                      },
                      {
                        step: 3,
                        title: t('home.how_it_works.steps.book.title'),
                        description: t('home.how_it_works.steps.book.description'),
                      },
                      {
                        step: 4,
                        title: t('home.how_it_works.steps.enjoy.title'),
                        description: t('home.how_it_works.steps.enjoy.description'),
                      },
                    ];
  const features = [
    {
      icon: HiCheckCircle,
      title: t('home.features.verified.title'),
      description: t('home.features.verified.description'),
    },
    {
      icon: HiStar,
      title: t('home.features.quality.title'),
      description: t('home.features.quality.description'),
    },
    {
      icon: HiLocationMarker,
      title: t('home.features.local.title'),
      description: t('home.features.local.description'),
    },
  ];
  const [categories, setCategories] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews,setReviews]=useState([]);

 useEffect(() => {
  fetchData();
  fetchReviews();
}, []);

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
  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, providersRes] = await Promise.all([
        categoryAPI.getAll(),
        providerAPI.getAll({ limit: 4, min_rating: 4.0, status: "approved", page: 1 }),
      ]);

      setCategories(categoriesRes.data?.data?.categories || []);
      setFeaturedProviders(providersRes.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full min-h-screen">
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
        navigate={navigate}
      />
      <CategoriesSection categories={categories} loading={loading} />

<HowItWorks/>
 
      <WhyChooseBaitak/>

      <CustomerReviews/>
  
      <CallToActionSection/>
    </div>
  );
};

export default Home;
