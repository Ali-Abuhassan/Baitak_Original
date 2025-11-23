import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { providerAPI, categoryAPI } from '../../services/api';
import { HiPlus, HiPencil, HiTrash, HiEye, HiEyeOff, HiX, HiPhotograph } from 'react-icons/hi';
import { HiCurrencyDollar, HiClock, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';

const ServiceManagement = () => {
  const { t } = useTranslation();
  const { user, isProvider, loading: authLoading } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Check if user is a provider and has completed registration
  useEffect(() => {
    console.log('User role check:', {
      user: user,
      role: user?.role,
      isProvider: isProvider,
      isAuthenticated: !!user,
      userKeys: user ? Object.keys(user) : 'No user object'
    });
    
    // Don't redirect if still loading
    if (authLoading) {
      return;
    }
    
    if (!user) {
      console.log('No user object, redirecting to login');
      toast.error(t('dashboard.service_management.errors.login_required'));
      window.location.href = '/login';
      return;
    }
    
    if (!isProvider) {
      console.log('User is not a provider, redirecting');
      toast.error(t('dashboard.service_management.errors.access_denied'));
      window.location.href = '/provider/dashboard';
      return;
    }
  }, [user, isProvider, authLoading]);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [currentPage]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getMyServices({
        page: currentPage,
        limit: 10,
        status: 'active'
      });
      setServices(response.data.data.services);
      setTotalPages(response.data.data.pagination.total_pages);
      setTotalServices(response.data.data.pagination.total_services);
    } catch (error) {
      console.error('Error fetching services:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage === 'Provider not found or not approved') {
          toast.error(t('dashboard.service_management.errors.pending_approval'));
          // Redirect to provider registration
          window.location.href = '/provider/register';
        } else {
          toast.error(t('dashboard.service_management.errors.access_denied_generic'));
        }
      } else {
        toast.error(t('dashboard.service_management.errors.load_services_failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    
    try {
      await providerAPI.deleteService(serviceToDelete.id);
      toast.success(t('dashboard.service_management.errors.delete_success'));
      fetchServices();
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(t('dashboard.service_management.errors.delete_failed'));
    }
  };

  const cancelDeleteService = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCreateService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const handleFormSubmit = () => {
    fetchServices();
    handleFormClose();
  };

  const getCategoryName = (service) => {
    // If service has category_other, use that
    if (service.category_other) {
      return service.category_other;
    }
    // Otherwise, look up by category_id
    const category = categories.find(cat => cat.id === service.category_id);
    return category ? category.name : t('dashboard.service_management.unknown_category');
  };

  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '0.00';
    return `${numericPrice.toFixed(2)} JOD`;
  };

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('dashboard.service_management.loading')}</p>
        </div>
      </div>
    );
  }

  // Show loading or access denied if not a provider
  if (!isProvider) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('dashboard.service_management.access_denied')}</h1>
          <p className="text-gray-600 mb-4">{t('dashboard.service_management.access_denied_desc')}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-semibold text-yellow-800 mb-2">{t('dashboard.service_management.registration_required')}</h3>
            <p className="text-sm text-yellow-700 mb-3">
              {t('dashboard.service_management.registration_desc')}
            </p>
            <a 
              href="/provider/register" 
              className="btn-primary text-sm"
            >
              {t('dashboard.service_management.complete_registration')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('dashboard.service_management.title')}</h1>
            <p className="text-gray-600">{t('dashboard.service_management.subtitle')}</p>
           
          </div>
          <button
            onClick={handleCreateService}
            className="btn-primary flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            {t('dashboard.service_management.add_new_service')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.service_management.total_services')}</p>
                <p className="text-2xl font-bold">{totalServices}</p>
              </div>
              <HiEye className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.service_management.active_services')}</p>
                <p className="text-2xl font-bold">{services.filter(s => s.is_active).length}</p>
              </div>
              <HiEye className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.service_management.total_bookings')}</p>
                <p className="text-2xl font-bold">
                  {services.reduce((sum, service) => sum + (service.booking_count || 0), 0)}
                </p>
              </div>
              <HiStar className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.service_management.your_services')}</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <Skeleton height={100} />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <HiEye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.service_management.no_services_yet')}</h3>
              <p className="text-gray-600 mb-4">{t('dashboard.service_management.no_services_desc')}</p>
              <button
                onClick={handleCreateService}
                className="btn-primary"
              >
                {t('dashboard.service_management.create_first_service')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.is_active ? t('dashboard.service_management.active') : t('dashboard.service_management.inactive')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <HiCurrencyDollar className="w-4 h-4" />
                          {formatPrice(service.base_price)} {service.price_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiClock className="w-4 h-4" />
                          {Number(service.duration_hours) % 1 === 0 ? Number(service.duration_hours) : Number(service.duration_hours).toFixed(1)} {t('dashboard.service_management.hours')}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiStar className="w-4 h-4" />
                          {service.booking_count || 0} {t('dashboard.service_management.bookings')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="btn-outline text-sm flex items-center gap-1"
                      >
                        <HiPencil className="w-4 h-4" />
                        {t('dashboard.service_management.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteService(service)}
                        className="btn-danger text-sm flex items-center gap-1"
                      >
                        <HiTrash className="w-4 h-4" />
                        {t('dashboard.service_management.delete')}
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{t('dashboard.service_management.category')}: {getCategoryName(service)}</span>
                      <span>{t('dashboard.service_management.created')}: {new Date(service.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('dashboard.service_management.previous')}
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                {t('dashboard.service_management.page_of', { current: currentPage, total: totalPages })}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('dashboard.service_management.next')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
                  <HiTrash className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('dashboard.service_management.delete_service')}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('dashboard.service_management.delete_confirm', { name: serviceToDelete?.name })}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelDeleteService}
                    className="btn-outline"
                  >
                    {t('dashboard.service_management.cancel')}
                  </button>
                  <button
                    onClick={confirmDeleteService}
                    className="btn-danger"
                  >
                    {t('dashboard.service_management.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          categories={categories}
          user={user}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

// Service Form Component
const ServiceForm = ({ service, categories, user, onClose, onSubmit }) => {
  const { t, i18n } = useTranslation();
  
  // Helper function to safely parse JSON strings
  const parseJsonField = (value, defaultValue = []) => {
    if (!value) return defaultValue;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const [formData, setFormData] = useState({
    category_id: service?.category_id || '',
    category_other: service?.category_other || '',
    name: service?.name || '',
    description: service?.description || '',
    base_price: service?.base_price || '',
    price_type: service?.price_type ? String(service.price_type).toLowerCase() : 'hourly',
    duration_hours: service?.duration_hours || '',
    requirements: service?.requirements || '',
    scope_notes: service?.scope_notes || '',
    packages: parseJsonField(service?.packages, []),
    add_ons: parseJsonField(service?.add_ons, []),
    included_services: parseJsonField(service?.included_services, []),
    excluded_services: parseJsonField(service?.excluded_services, []),
    min_advance_booking_hours: service?.min_advance_booking_hours || 24,
    max_advance_booking_days: service?.max_advance_booking_days || 30,
    images: service?.images || [],
    is_active: service?.is_active !== undefined ? service.is_active : true
  });

  const [loading, setLoading] = useState(false);
  const [newIncludedService, setNewIncludedService] = useState('');
  const [newExcludedService, setNewExcludedService] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackageIndex, setEditingPackageIndex] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    price: '',
    description: '',
    features: []
  });
  const [newFeature, setNewFeature] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error(t('serviceManagement.imageUpload.invalidFileType'));
      return;
    }

    // Validate file sizes (max 5MB per image)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error(t('serviceManagement.imageUpload.fileTooLarge'));
      return;
    }

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setSelectedImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove image
  const removeImage = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup image preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is valid
      if (!user) {
        toast.error(t('dashboard.service_management.errors.user_not_found'));
        setLoading(false);
        return;
      }

      // If "other" is selected, remove category_id and keep category_other
      let categoryData = {};
      if (formData.category_id === 'other') {
        if (!formData.category_other || !formData.category_other.trim()) {
          toast.error(t('dashboard.service_management.errors.custom_category_required'));
          setLoading(false);
          return;
        }
        categoryData.category_other = formData.category_other.trim();
      } else {
        // Only include category_id if it's a valid non-empty value
        // Convert to string first to handle both string and number values
        const categoryIdStr = formData.category_id ? String(formData.category_id).trim() : '';
        if (categoryIdStr !== '') {
          categoryData.category_id = categoryIdStr;
        } else {
          toast.error(t('dashboard.service_management.errors.category_required'));
          setLoading(false);
          return;
        }
      }

      // Helper to parse JSON strings to arrays/objects
      const parseJsonField = (value, defaultValue = []) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) return defaultValue;
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : (typeof parsed === 'object' ? parsed : defaultValue);
          } catch (e) {
            return defaultValue;
          }
        }
        if (typeof value === 'object') return value;
        return defaultValue;
      };

      // Prepare data for JSON submission (no images)
      const prepareJsonData = () => {
        // Ensure price_type is always a valid lowercase string
        const priceType = formData.price_type 
          ? String(formData.price_type).toLowerCase().trim() 
          : 'hourly';
        
        // Validate price_type is one of the expected values
        const validPriceTypes = ['hourly', 'fixed'];
        const finalPriceType = validPriceTypes.includes(priceType) ? priceType : 'hourly';
        
        return {
          ...categoryData,
          name: String(formData.name || '').trim(),
          description: String(formData.description || '').trim(),
          base_price: parseFloat(formData.base_price) || 0,
          price_type: finalPriceType,
          duration_hours: parseFloat(formData.duration_hours) || 0,
          requirements: String(formData.requirements || '').trim(),
          scope_notes: String(formData.scope_notes || '').trim(),
          packages: Array.isArray(formData.packages) ? formData.packages : parseJsonField(formData.packages, []),
          add_ons: Array.isArray(formData.add_ons) ? formData.add_ons : parseJsonField(formData.add_ons, []),
          included_services: Array.isArray(formData.included_services) ? formData.included_services : [],
          excluded_services: Array.isArray(formData.excluded_services) ? formData.excluded_services : [],
          min_advance_booking_hours: parseInt(formData.min_advance_booking_hours) || 24,
          max_advance_booking_days: parseInt(formData.max_advance_booking_days) || 30,
          is_active: Boolean(formData.is_active)
        };
      };

      // Always use FormData to match Postman behavior
      const formDataToSend = new FormData();
      const jsonData = prepareJsonData();
      
      // Log the data being prepared
      console.log('Prepared JSON data:', jsonData);
      console.log('Form data values:', {
        category_id: formData.category_id,
        category_other: formData.category_other,
        price_type: formData.price_type,
        packages: formData.packages,
        add_ons: formData.add_ons
      });
      
      // Append all service data
      Object.keys(jsonData).forEach(key => {
        const value = jsonData[key];
        
        // Skip null and undefined
        if (value === undefined || value === null) {
          return;
        }
        
        // Skip empty strings for optional fields to avoid backend issues
        if (value === '' && (key === 'scope_notes' || key === 'requirements' || key === 'category_other')) {
          return; // Don't send empty optional text fields
        }
        
        if (Array.isArray(value)) {
          // Only send non-empty arrays
          if (value.length > 0) {
            formDataToSend.append(key, JSON.stringify(value));
          }
        } else if (key === 'packages' || key === 'add_ons') {
          // packages and add_ons should be JSON strings in FormData
          const jsonValue = typeof value === 'string' 
            ? (value.trim() || '[]')
            : JSON.stringify(value || []);
          formDataToSend.append(key, jsonValue);
        } else if (typeof value === 'boolean') {
          // Convert boolean to 1 or 0 for better compatibility
          formDataToSend.append(key, value ? '1' : '0');
        } else if (typeof value === 'number') {
          // Convert number to string
          formDataToSend.append(key, String(value));
        } else {
          // Convert all other values to strings for FormData, trim whitespace
          const stringValue = String(value).trim();
          if (stringValue !== '') {
            formDataToSend.append(key, stringValue);
          }
        }
      });

      // Append image files if any - use 'service_images' as shown in Postman
      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          formDataToSend.append('service_images', image);
        });
      }

      // Log FormData contents for debugging
      console.log('FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]));
      }
      
      console.log('Submitting service data:', jsonData);
      
      if (service) {
        await providerAPI.updateServiceWithImages(service.id, formDataToSend);
        toast.success(t('dashboard.service_management.errors.update_success'));
      } else {
        await providerAPI.createServiceWithImages(formDataToSend);
        toast.success(t('dashboard.service_management.errors.create_success'));
      }
      
      // Cleanup image previews after successful submission
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      setSelectedImages([]);
      setImagePreviews([]);
      
      onSubmit();
    } catch (error) {
      console.error('Error saving service:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage === 'Provider not found or not approved') {
          toast.error(t('dashboard.service_management.errors.pending_approval_services'));
        } else {
          toast.error(t('dashboard.service_management.errors.access_denied_services'));
        }
      } else if (error.response?.status === 401) {
        toast.error(t('dashboard.service_management.errors.auth_required'));
      } else {
        const errorMessage = error.response?.data?.message || t('dashboard.service_management.errors.save_failed');
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };


  const addIncludedService = () => {
    if (newIncludedService.trim()) {
      setFormData(prev => ({
        ...prev,
        included_services: [...prev.included_services, newIncludedService.trim()]
      }));
      setNewIncludedService('');
    }
  };

  const removeIncludedService = (index) => {
    setFormData(prev => ({
      ...prev,
      included_services: prev.included_services.filter((_, i) => i !== index)
    }));
  };

  const addExcludedService = () => {
    if (newExcludedService.trim()) {
      setFormData(prev => ({
        ...prev,
        excluded_services: [...prev.excluded_services, newExcludedService.trim()]
      }));
      setNewExcludedService('');
    }
  };

  const removeExcludedService = (index) => {
    setFormData(prev => ({
      ...prev,
      excluded_services: prev.excluded_services.filter((_, i) => i !== index)
    }));
  };

  // Package management functions
  const handleAddPackage = () => {
    setEditingPackageIndex(null);
    setPackageForm({
      name: '',
      price: '',
      description: '',
      features: []
    });
    setNewFeature('');
    setShowPackageForm(true);
  };

  const handleEditPackage = (index) => {
    const pkg = formData.packages[index];
    setEditingPackageIndex(index);
    setPackageForm({
      name: pkg.name || '',
      price: pkg.price || '',
      description: pkg.description || '',
      features: pkg.features || []
    });
    setNewFeature('');
    setShowPackageForm(true);
  };

  const handleSavePackage = () => {
    if (!packageForm.name.trim() || !packageForm.price) {
      toast.error(t('dashboard.service_management.packages.name_and_price_required'));
      return;
    }

    const newPackage = {
      name: packageForm.name.trim(),
      price: parseFloat(packageForm.price) || 0,
      description: packageForm.description.trim() || '',
      features: packageForm.features.filter(f => f.trim())
    };

    if (editingPackageIndex !== null) {
      // Update existing package
      const updatedPackages = [...formData.packages];
      updatedPackages[editingPackageIndex] = newPackage;
      setFormData(prev => ({
        ...prev,
        packages: updatedPackages
      }));
    } else {
      // Add new package
      setFormData(prev => ({
        ...prev,
        packages: [...prev.packages, newPackage]
      }));
    }

    setShowPackageForm(false);
    setEditingPackageIndex(null);
    setPackageForm({
      name: '',
      price: '',
      description: '',
      features: []
    });
    setNewFeature('');
  };

  const handleDeletePackage = (index) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setPackageForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setPackageForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {service ? t('dashboard.service_management.edit_service') : t('dashboard.service_management.create_new_service')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>
          
         

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.service_management.category_label')} *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{t('dashboard.service_management.select_category')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="other">{t('dashboard.service_management.other')}</option>
                </select>
              </div>

              {formData.category_id === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('dashboard.service_management.custom_category')} *
                  </label>
                  <input
                    type="text"
                    name="category_other"
                    value={formData.category_other}
                    onChange={handleInputChange}
                    required={formData.category_id === 'other'}
                    placeholder={t('dashboard.service_management.custom_category_placeholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.service_management.service_name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.service_management.description')} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.service_management.base_price')} *
                </label>
                <input
                  type="number"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.service_management.price_type')} *
                </label>
                <select
                  name="price_type"
                  value={formData.price_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="hourly">{t('dashboard.service_management.hourly')}</option>
                  <option value="fixed">{t('dashboard.service_management.fixed')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.service_management.duration_hours')} *
                </label>
                <input
                  type="number"
                  name="duration_hours"
                  value={formData.duration_hours}
                  onChange={handleInputChange}
                  required
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Packages Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('dashboard.service_management.packages.title')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('dashboard.service_management.packages.description')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPackage}
                  className="btn-outline flex items-center gap-2"
                >
                  <HiPlus className="w-4 h-4" />
                  {t('dashboard.service_management.packages.add_package')}
                </button>
              </div>

              {/* Packages List */}
              {formData.packages.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.packages.map((pkg, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                          <p className="text-sm font-medium text-primary-600 mt-1">
                            {formatPrice(pkg.price, i18n.language)}
                          </p>
                          {pkg.features && pkg.features.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="text-xs text-gray-500 flex items-center">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditPackage(index)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePackage(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.packages.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  {t('dashboard.service_management.packages.no_packages')}
                </p>
              )}
            </div>

            {/* Package Form Modal */}
            {showPackageForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]" onClick={() => setShowPackageForm(false)}>
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingPackageIndex !== null 
                          ? t('dashboard.service_management.packages.edit_package')
                          : t('dashboard.service_management.packages.add_package')}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowPackageForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <HiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('dashboard.service_management.packages.name')} *
                        </label>
                        <input
                          type="text"
                          value={packageForm.name}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={t('dashboard.service_management.packages.name_placeholder')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('dashboard.service_management.packages.price')} *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={packageForm.price}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={t('dashboard.service_management.packages.price_placeholder')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('dashboard.service_management.packages.description')}
                        </label>
                        <textarea
                          value={packageForm.description}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={t('dashboard.service_management.packages.description_placeholder')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('dashboard.service_management.packages.features')}
                        </label>
                        <div className="space-y-2">
                          {packageForm.features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm">{feature}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <HiX className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newFeature}
                              onChange={(e) => setNewFeature(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddFeature();
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder={t('dashboard.service_management.packages.feature_placeholder')}
                            />
                            <button
                              type="button"
                              onClick={handleAddFeature}
                              className="btn-outline"
                            >
                              {t('dashboard.service_management.packages.add_feature')}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                          type="button"
                          onClick={() => setShowPackageForm(false)}
                          className="btn-outline"
                        >
                          {t('common.cancel')}
                        </button>
                        <button
                          type="button"
                          onClick={handleSavePackage}
                          className="btn-primary"
                        >
                          {t('common.save')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Included/Excluded Services */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Included Services
                </label>
                <div className="space-y-2">
                  {formData.included_services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                      <span className="text-sm">{service}</span>
                      <button
                        type="button"
                        onClick={() => removeIncludedService(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add included service"
                      value={newIncludedService}
                      onChange={(e) => setNewIncludedService(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addIncludedService}
                      className="btn-outline"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excluded Services
                </label>
                <div className="space-y-2">
                  {formData.excluded_services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                      <span className="text-sm">{service}</span>
                      <button
                        type="button"
                        onClick={() => removeExcludedService(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add excluded service"
                      value={newExcludedService}
                      onChange={(e) => setNewExcludedService(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addExcludedService}
                      className="btn-outline"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('serviceManagement.imageUpload.title')}
              </label>
              <div className="space-y-4">
                {/* File Input */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiPhotograph className="w-10 h-10 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">{t('serviceManagement.imageUpload.clickToUpload')}</span> {t('serviceManagement.imageUpload.dragAndDrop')}
                      </p>
                      <p className="text-xs text-gray-500">{t('serviceManagement.imageUpload.fileFormat')}</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Existing Images Display (when editing) */}
                {service?.images && service.images.length > 0 && imagePreviews.length === 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {service.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image && (image.startsWith('http://') || image.startsWith('https://'))
                            ? image
                            : `${import.meta.env.VITE_API_URL}/uploads/services/${image}`}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          {t('serviceManagement.imageUpload.current')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Requirements and Booking Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.service_management.requirements')}
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={2}
                placeholder={t('dashboard.service_management.requirements_placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Advance Booking (hours)
                </label>
                <input
                  type="number"
                  name="min_advance_booking_hours"
                  value={formData.min_advance_booking_hours}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Advance Booking (days)
                </label>
                <input
                  type="number"
                  name="max_advance_booking_days"
                  value={formData.max_advance_booking_days}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div> */}

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                {t('dashboard.service_management.service_active')}
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                {t('dashboard.service_management.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? t('dashboard.service_management.saving') : (service ? t('dashboard.service_management.update_service') : t('dashboard.service_management.create_service'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
