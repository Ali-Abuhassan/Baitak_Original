import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceAPI, categoryAPI, searchAPI } from '../utils/api';
import ServiceCard from '../components/services/ServiceCard';
import { HiFilter, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const locationQuery = searchParams.get('location');
  
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smartSearchData, setSmartSearchData] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [filters, setFilters] = useState({
    category: categorySlug || '',
    priceRange: '',
    rating: '',
    search: searchQuery || '',
    location: locationQuery || '',
    sort: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_services: 0,
    limit: 9,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [filters, pagination.current_page]);

  // Map frontend sort values to backend sort_by values
  const mapSortToBackend = (sortValue) => {
    const sortMap = {
      'relevance': 'relevance',
      'price_low_high': 'price_low',
      'price_high_low': 'price_high',
      'rating_high_low': 'rating',
      'most_booked': 'popularity'
    };
    return sortMap[sortValue] || 'relevance';
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      
      // Handle the API response structure
      if (response.data?.success && response.data?.data) {
        const categoriesData = response.data.data.categories || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } else {
        // Handle different response structures for backward compatibility
        const categoriesData = response.data?.data?.categories || 
                              response.data?.categories || 
                              response.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(t('services.errors.load_categories_failed'));
      
      // Set empty categories on error
      setCategories([]);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // If there's a search query, use smart search API
      if (filters.search && filters.search.trim()) {
        const searchParams = {
          query: filters.search,
          page: pagination.current_page,
          limit: pagination.limit,
        };
        
        // Add optional filters to search
        if (filters.category) {
          const category = categories.find(c => c.slug === filters.category);
          if (category) {
            searchParams.category = category.slug;
          }
        }
        
        if (filters.location) {
          searchParams.city = filters.location;
        }
        
        if (filters.rating) {
          searchParams.min_rating = filters.rating;
        }
        
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-');
          searchParams.min_price = min;
          searchParams.max_price = max;
        }
        
        // Add sort_by parameter for backend sorting across all pages
        if (filters.sort) {
          searchParams.sort_by = mapSortToBackend(filters.sort);
        }
        
        const response = await searchAPI.search(searchParams);
        
        // Check if response is HTML (API server not available)
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
          setIsUsingFallback(true);
          
          // Fallback to regular service API
          const fallbackParams = {
            page: pagination.current_page,
            limit: pagination.limit,
            search: filters.search,
          };
          
          if (filters.category) {
            const category = categories.find(c => c.slug === filters.category);
            if (category) {
              fallbackParams.category_id = category.id;
            }
          }
          
          if (filters.rating) {
            fallbackParams.min_rating = filters.rating;
          }
          
          if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-');
            fallbackParams.min_price = min;
            fallbackParams.max_price = max;
          }
          
          // Add sort_by parameter for backend sorting across all pages
          if (filters.sort) {
            fallbackParams.sort_by = mapSortToBackend(filters.sort);
          }
          
          const fallbackResponse = await serviceAPI.getAll(fallbackParams);
          console.log('Fallback service response:', fallbackResponse.data);
          
          // Check if fallback also returns HTML (backend completely down)
          if (typeof fallbackResponse.data === 'string' && fallbackResponse.data.includes('<!DOCTYPE html>')) {
         
            
            // Show demo data when backend is unavailable - filter based on search query
            const allDemoServices = [
              {
                id: 1,
                name: "House Cleaning Service",
                description: "Professional house cleaning with eco-friendly products",
                base_price: 50.00,
                provider: {
                  id: 1,
                  business_name: "Clean Pro Services",
                  rating_avg: 4.8,
                  user: {
                    first_name: "Jane",
                    last_name: "Smith",
                    city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                    area: { name_en: "Abdoun", name_ar: "عبدون", slug: "abdoun" }
                  }
                },
                category: { name: "Cleaning", slug: "cleaning" },
                keywords: ["clean", "cleaning", "house", "home", "sofa", "carpet", "dust", "vacuum"]
              },
              {
                id: 2,
                name: "Plumbing Repair",
                description: "Expert plumbing services for all your needs",
                base_price: 75.00,
                provider: {
                  id: 2,
                  business_name: "Fix It Fast",
                  rating_avg: 4.6,
                  user: {
                    first_name: "Ahmed",
                    last_name: "Hassan",
                    city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                    area: { name_en: "Jabal Amman", name_ar: "جبل عمان", slug: "jabal-amman" }
                  }
                },
                category: { name: "Plumbing", slug: "plumbing" },
                keywords: ["plumb", "plumbing", "pipe", "water", "leak", "fix", "repair", "bathroom", "kitchen"]
              },
              {
                id: 3,
                name: "Tutoring Services",
                description: "Professional tutoring for all subjects",
                base_price: 30.00,
                provider: {
                  id: 3,
                  business_name: "EduCare Tutors",
                  rating_avg: 4.9,
                  user: {
                    first_name: "Sarah",
                    last_name: "Johnson",
                    city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                    area: { name_en: "Shmeisani", name_ar: "الشميساني", slug: "shmeisani" }
                  }
                },
                category: { name: "Education", slug: "education" },
                keywords: ["tutor", "tutoring", "education", "learn", "teach", "study", "math", "english", "science"]
              },
              {
                id: 4,
                name: "TV Mounting Service",
                description: "Professional TV mounting and installation",
                base_price: 40.00,
                provider: {
                  id: 4,
                  business_name: "Mount Masters",
                  rating_avg: 4.7,
                  user: {
                    first_name: "Omar",
                    last_name: "Ali",
                    city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                    area: { name_en: "Rainbow Street", name_ar: "شارع الرينبو", slug: "rainbow-street" }
                  }
                },
                category: { name: "Mounting", slug: "mounting" },
                keywords: ["mount", "tv", "television", "install", "wall", "bracket", "samsung", "lg"]
              },
              {
                id: 5,
                name: "Painting Services",
                description: "Interior and exterior painting with premium materials",
                base_price: 60.00,
                provider: {
                  id: 5,
                  business_name: "Color Perfect",
                  rating_avg: 4.5,
                  user: {
                    first_name: "Fatima",
                    last_name: "Ahmad",
                    city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                    area: { name_en: "Jubeiha", name_ar: "الجبيهة", slug: "jubeiha" }
                  }
                },
                category: { name: "Painting", slug: "painting" },
                keywords: ["paint", "painting", "color", "wall", "interior", "exterior", "brush", "roller"]
              },
              {
                id: 6,
                name: "Electrical Services",
                description: "Complete electrical installation and repair services",
                base_price: 55.00,
                provider: {
                  id: 6,
                  business_name: "Power Solutions",
                  rating_avg: 4.8,
                  user: {
                    first_name: "Khalid",
                    last_name: "Mohammed",
                    city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                    area: { name_en: "Tlaa Al Ali", name_ar: "تلاع العلي", slug: "tlaa-al-ali" }
                  }
                },
                category: { name: "Electrical", slug: "electrical" },
                keywords: ["electric", "electrical", "wire", "outlet", "switch", "light", "power", "circuit"]
              }
            ];

            // Filter demo services based on search query
            const searchQuery = filters.search.toLowerCase();
            const demoServices = allDemoServices.filter(service => 
              service.keywords.some(keyword => keyword.includes(searchQuery)) ||
              service.name.toLowerCase().includes(searchQuery) ||
              service.description.toLowerCase().includes(searchQuery) ||
              service.category.name.toLowerCase().includes(searchQuery)
            );
            
            setServices(demoServices);
            setPagination({
              current_page: 1,
              total_pages: 1,
              total_services: demoServices.length,
              limit: 9
            });
            // Determine detected category based on search query
            let detectedCategory = 'General';
            let reasoning = 'Demo mode - Backend unavailable';
            
            if (filters.search.toLowerCase().includes('clean') || filters.search.toLowerCase().includes('sofa') || filters.search.toLowerCase().includes('carpet')) {
              detectedCategory = 'Cleaning';
              reasoning = 'Matched keywords: cleaning, sofa, carpet';
            } else if (filters.search.toLowerCase().includes('plumb') || filters.search.toLowerCase().includes('pipe') || filters.search.toLowerCase().includes('water')) {
              detectedCategory = 'Plumbing';
              reasoning = 'Matched keywords: plumbing, pipe, water';
            } else if (filters.search.toLowerCase().includes('tutor') || filters.search.toLowerCase().includes('teach') || filters.search.toLowerCase().includes('learn')) {
              detectedCategory = 'Education';
              reasoning = 'Matched keywords: tutoring, teaching, learning';
            } else if (filters.search.toLowerCase().includes('mount') || filters.search.toLowerCase().includes('tv') || filters.search.toLowerCase().includes('install')) {
              detectedCategory = 'Mounting';
              reasoning = 'Matched keywords: mount, TV, install';
            } else if (filters.search.toLowerCase().includes('paint') || filters.search.toLowerCase().includes('color')) {
              detectedCategory = 'Painting';
              reasoning = 'Matched keywords: paint, color';
            } else if (filters.search.toLowerCase().includes('electric') || filters.search.toLowerCase().includes('wire') || filters.search.toLowerCase().includes('power')) {
              detectedCategory = 'Electrical';
              reasoning = 'Matched keywords: electrical, wire, power';
            }
            
            setSmartSearchData({
              detected_category: detectedCategory,
              confidence: 'demo',
              reasoning: reasoning
            });
            setIsUsingFallback(true);
            return;
          }
          
          if (fallbackResponse.data?.success && fallbackResponse.data?.data) {
            const servicesData = fallbackResponse.data.data.services || [];
            const paginationData = fallbackResponse.data.data.pagination || pagination;
            
            setServices(Array.isArray(servicesData) ? servicesData : []);
            setPagination(paginationData);
            setSmartSearchData(null);
            setIsUsingFallback(false);
          } else {
            throw new Error('Fallback API also failed');
          }
        } else if (response.data?.success && response.data?.data) {
          // Handle smart search response
          const servicesData = response.data.data.results || [];
          const paginationData = response.data.data.pagination || pagination;
          const smartData = response.data.data.smart_search || null;
          
          setServices(Array.isArray(servicesData) ? servicesData : []);
          setPagination(paginationData);
          setSmartSearchData(smartData);
          setIsUsingFallback(false);
        } else {
          setServices([]);
          toast.error(t('services.errors.invalid_search_response'));
        }
      } else {
        // Use regular service API when no search query
        const params = {
          page: pagination.current_page,
          limit: pagination.limit,
        };
        
        if (filters.category) {
          const category = categories.find(c => c.slug === filters.category);
          if (category) {
            params.category_id = category.id;
          }
        }
        
        if (filters.rating) {
          params.min_rating = filters.rating;
        }
        
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-');
          params.min_price = min;
          params.max_price = max;
        }
        
        // Add sort_by parameter for backend sorting across all pages
        if (filters.sort) {
          params.sort_by = mapSortToBackend(filters.sort);
        }
        
        const response = await serviceAPI.getAll(params);
        console.log('Services response:', response.data);
        
        // Check if response is HTML (backend completely down)
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
          
          // Show demo data when backend is unavailable
          const allDemoServices = [
            {
              id: 1,
              name: "House Cleaning Service",
              description: "Professional house cleaning with eco-friendly products",
              base_price: 50.00,
              provider: {
                id: 1,
                business_name: "Clean Pro Services",
                rating_avg: 4.8,
                user: {
                  first_name: "Jane",
                  last_name: "Smith",
                  city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                  area: { name_en: "Abdoun", name_ar: "عبدون", slug: "abdoun" }
                }
              },
              category: { name: "Cleaning", slug: "cleaning" }
            },
            {
              id: 2,
              name: "Plumbing Repair",
              description: "Expert plumbing services for all your needs",
              base_price: 75.00,
              provider: {
                id: 2,
                business_name: "Fix It Fast",
                rating_avg: 4.6,
                user: {
                  first_name: "Ahmed",
                  last_name: "Hassan",
                  city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                  area: { name_en: "Jabal Amman", name_ar: "جبل عمان", slug: "jabal-amman" }
                }
              },
              category: { name: "Plumbing", slug: "plumbing" }
            },
            {
              id: 3,
              name: "Tutoring Services",
              description: "Professional tutoring for all subjects",
              base_price: 30.00,
              provider: {
                id: 3,
                business_name: "EduCare Tutors",
                rating_avg: 4.9,
                user: {
                  first_name: "Sarah",
                  last_name: "Johnson",
                  city: { name_en: "Amman", name_ar: "عمان", slug: "amman" },
                  area: { name_en: "Shmeisani", name_ar: "الشميساني", slug: "shmeisani" }
                }
              },
              category: { name: "Education", slug: "education" }
            }
          ];
          
          setServices(allDemoServices);
          setPagination({
            current_page: 1,
            total_pages: 1,
            total_services: allDemoServices.length,
            limit: 9
          });
          setSmartSearchData(null);
          setIsUsingFallback(true);
          return;
        }
        
        // Handle the API response structure
        if (response.data?.success && response.data?.data) {
          const servicesData = response.data.data.services || [];
          const paginationData = response.data.data.pagination || pagination;
          
          console.log('Parsed services:', servicesData);
          console.log('Parsed pagination:', paginationData);
          
          setServices(Array.isArray(servicesData) ? servicesData : []);
          setPagination(paginationData);
          setSmartSearchData(null);
          setIsUsingFallback(false);
        } else {
          console.error('Invalid API response structure:', response.data);
          setServices([]);
          toast.error(t('services.errors.invalid_server_response'));
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Provide more specific error messages
      if (error.response?.status === 404) {
        toast.error(t('services.errors.api_not_found'));
      } else if (error.response?.status >= 500) {
        toast.error(t('services.errors.server_error'));
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        toast.error(t('services.errors.network_error'));
      } else {
        toast.error(t('services.errors.load_services_failed'));
      }
      
      // Set empty state on error
      setServices([]);
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_services: 0,
        limit: 9
      });
      setSmartSearchData(null);
      setIsUsingFallback(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When rendering services, only sort locally for demo/fallback data
  // For API responses, backend handles sorting across all pages
  const getSortedServices = () => {
    // Only apply client-side sorting if we're using fallback/demo data
    if (isUsingFallback && filters.sort !== 'relevance') {
      if (filters.sort === 'price_low_high') {
        return [...services].sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
      } else if (filters.sort === 'price_high_low') {
        return [...services].sort((a, b) => (b.base_price || 0) - (a.base_price || 0));
      } else if (filters.sort === 'rating_high_low') {
        return [...services].sort((a, b) => (b.provider?.rating_avg || 0) - (a.provider?.rating_avg || 0));
      }
    }
    return services;
  };

  // Handler for sort changes - reset to page 1
  const handleSortChange = (newSort) => {
    setFilters({ ...filters, sort: newSort });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {filters.search 
                  ? `${t('services.search_results')}: "${filters.search}"`
                  : filters.category 
                    ? categories.find(c => c.slug === filters.category)?.name + ' ' + t('services.title')
                    : t('services.all_services')}
              </h1>
            
            
             
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-secondary flex items-center"
            >
              <HiFilter className="mr-2" />
              {t('services.filters')}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
                placeholder={t('services.search_placeholder')}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-6 sm:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6 md:sticky md:top-24`}>
            <div className="bg-white rounded-lg p-6">
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{t('services.filter_by_category')}</h3>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full input"
                >
                  <option value="">{t('services.all_categories')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{t('services.price_range')}</h3>
                <div className="space-y-2">
                  {['0-50', '50-100', '100-200', '200-500'].map(range => (
                    <label key={range} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range}
                        checked={filters.priceRange === range}
                        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        className="mr-2"
                      />
                      {range.replace('-', ' - ')} {i18n.language === 'ar' ? 'دينار' : 'JOD'}
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value=""
                      checked={filters.priceRange === ''}
                      onChange={(e) => setFilters({ ...filters, priceRange: '' })}
                      className="mr-2"
                    />
                    {t('services.any_price')}
                  </label>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{t('services.minimum_rating')}</h3>
                <div className="space-y-2">
                  {['4.5', '4', '3.5', '3'].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                        className="mr-2"
                      />
                      {rating}+ {t('services.stars')}
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value=""
                      checked={filters.rating === ''}
                      onChange={(e) => setFilters({ ...filters, rating: '' })}
                      className="mr-2"
                    />
                    {t('services.any_rating')}
                  </label>
                </div>
              </div>

              {/* Sort Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{t('services.sort_by')}</h3>
                <select
                  value={filters.sort}
                  onChange={e => handleSortChange(e.target.value)}
                  className="w-full input"
                >
                  <option value="relevance">{t('services.sort.relevance')}</option>
                  <option value="price_low_high">{t('services.sort.price_low_high')}</option>
                  <option value="price_high_low">{t('services.sort.price_high_low')}</option>
                  <option value="rating_high_low">{t('services.sort.rating_high_low')}</option>
                  <option value="most_booked">{t('services.sort.most_booked')}</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilters({ category: '', priceRange: '', rating: '', search: '', location: '', sort: 'relevance' });
                  setPagination(prev => ({ ...prev, current_page: 1 }));
                  setSmartSearchData(null);
                  setIsUsingFallback(false);
                }}
                className="w-full btn-secondary"
              >
                {t('services.clear_filters')}
              </button>
            </div>
          </aside>

          {/* Services Grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-gray-600 text-sm">
                {t('services.showing_results', { 
                  showing: services.length, 
                  total: pagination.total_services 
                })}
              </p>
              {/* <select className="input w-full sm:w-auto" value={filters.sort} onChange={e => handleSortChange(e.target.value)}>
                <option value="relevance">{t('services.sort.relevance')}</option>
                <option value="price_low_high">{t('services.sort.price_low_high')}</option>
                <option value="price_high_low">{t('services.sort.price_high_low')}</option>
                <option value="rating_high_low">{t('services.sort.rating_high_low')}</option>
                <option value="most_booked">{t('services.sort.most_booked')}</option>
              </select> */}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card">
                    <Skeleton height={200} />
                    <div className="p-4">
                      <Skeleton height={20} className="mb-2" />
                      <Skeleton height={40} />
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                  {getSortedServices().map(service => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      provider={service.provider}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-full overflow-x-auto">
                      <div className="inline-flex gap-1 sm:gap-2 items-center">
                      <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-2 py-1 sm:px-3 sm:py-1 text-sm border rounded disabled:opacity-50"
                      >
                        {t('common.previous')}
                      </button>
                      {[...Array(pagination.total_pages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-2 py-1 sm:px-3 sm:py-1 text-sm border rounded ${
                            pagination.current_page === index + 1
                              ? 'bg-primary-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.total_pages}
                        className="px-2 py-1 sm:px-3 sm:py-1 text-sm border rounded disabled:opacity-50"
                      >
                        {t('common.next')}
                      </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div>
                  <p className="text-gray-500 text-lg">{t('services.no_services_found')}</p>
                  <button
                    onClick={() => {
                      setFilters({ category: '', priceRange: '', rating: '', search: '', location: '', sort: 'relevance' });
                      setPagination(prev => ({ ...prev, current_page: 1 }));
                      setSmartSearchData(null);
                      setIsUsingFallback(false);
                    }}
                    className="mt-4 btn-primary"
                  >
                    {t('services.clear_filters')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;