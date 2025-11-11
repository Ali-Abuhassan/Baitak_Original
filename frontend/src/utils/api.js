import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add Content-Language header based on current language
    const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
    config.headers['Content-Language'] = currentLanguage;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      // and if the request is not for authentication or booking endpoints
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      const isBookingEndpoint = error.config?.url?.includes('/bookings/');
      const isLoginPage = window.location.pathname === '/login';
      
      if (!isAuthEndpoint && !isBookingEndpoint && !isLoginPage) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  sendOTP: (data) => api.post('/auth/send-otp', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  refreshToken: () => api.post('/auth/refresh-token'),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  search: (params) => api.get('/categories/search', { params }),
};

export const serviceAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  getMyServices: (params) => api.get('/services/my/services', { params }),
};

export const providerAPI = {
  getAll: (params) => api.get('/providers', { params }),
  getById: (id) => api.get(`/providers/${id}`),
  getByCategory: (categoryId, params) => api.get(`/providers/category/${categoryId}`, { params }),
  register: (data) => api.post('/providers/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateProfile: (data) => api.put('/providers/profile', data),
  getDashboardStats: () => api.get('/providers/dashboard/stats'),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getMyServices: (params) => api.get('/services/my/services', { params }),
  createService: (data) => api.post('/services', data),
  createServiceWithImages: (formData) => {
    // Don't set Content-Type header - let axios set it automatically with boundary
    return api.post('/services', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set boundary automatically
      },
    });
  },
  updateService: (id, data) => api.put(`/services/${id}`, data),
  updateServiceWithImages: (id, formData) => {
    // Don't set Content-Type header - let axios set it automatically with boundary
    return api.put(`/services/${id}`, formData, {
      headers: {
        'Content-Type': undefined, // Let browser set boundary automatically
      },
    });
  },
  deleteService: (id) => api.delete(`/services/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
  cancel: (id, data) => api.post(`/bookings/${id}/cancel`, data),
  sendOTP: (data) => api.post('/bookings/send-otp', data),
};

export const ratingAPI = {
  create: (data) => api.post('/ratings', data),
  getByBooking: (bookingId) => api.get(`/ratings/booking/${bookingId}`),
  getMyReviews: (params) => api.get('/ratings/my-reviews', { params }),
  getProviderReviews: (providerId, params) => api.get(`/ratings/provider/${providerId}`, { params }),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfileImage: (formData) => 
    api.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getBookings: (params) => api.get('/users/bookings', { params }),
  getStatistics: () => api.get('/users/statistics'),
};

export const locationAPI = {
  getCities: () => api.get('/locations/cities'),
  getAreasByCity: (citySlug) => api.get(`/locations/areas/${citySlug}`),
  getAllAreas: () => api.get('/locations/areas'),
  search: (params) => api.get('/locations/search', { params }),
};

export const searchAPI = {
  search: (params) => api.get('/search', { params }),
  getSuggestions: (params) => api.get('/search/suggest', { params }),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getPendingProviders: () => api.get('/admin/providers/pending'),
  getAllProviders: (params) => api.get('/admin/providers', { params }),
  getAllCustomers: (params) => api.get('/admin/customers', { params }),
  updateProviderStatus: (id, data) => api.patch(`/admin/providers/${id}/status`, data),
  createCategory: (data) => api.post('/admin/categories', data),
  getProviderDocuments: (id) => api.get(`/admin/providers/${id}/documents`),
  updateProviderVerification: (id, data) => api.patch(`/admin/providers/${id}/verification`, data),
};

export default api;
