import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Providers from './pages/Providers';
import ProviderProfile from './pages/ProviderProfile';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import BookingDetails from './pages/BookingDetails';
import Search from './pages/Search';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyPhone from './pages/VerifyPhone';
import UserDashboard from './pages/dashboard/UserDashboard';
import ProviderDashboard from './pages/dashboard/ProviderDashboard';
import ServiceManagement from './pages/dashboard/ServiceManagement';
import TodaysBookings from './pages/dashboard/TodaysBookings';
import Reviews from './pages/dashboard/Reviews';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminProviders from './pages/dashboard/AdminProviders';
import AdminCustomers from './pages/dashboard/AdminCustomers';
import AdminProviderDocuments from './pages/dashboard/AdminProviderDocuments';
import AdminCategories from './pages/dashboard/AdminCategories';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ProviderRegister from './pages/ProviderRegister';
import ProviderRegistrationSuccess from './pages/ProviderRegistrationSuccess';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import './i18n';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/providers/:id" element={<ProviderProfile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/booking/:serviceId" element={<Booking />} />
              <Route path="/booking/success/:bookingId" element={<BookingSuccess />} />
              <Route path="/booking/details/:id" element={<BookingDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-phone" element={<VerifyPhone />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/provider/register" element={<ProviderRegister />} />
              <Route path="/provider/registration-success" element={<ProviderRegistrationSuccess />} />
              
              {/* Protected Routes - User */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
              
              {/* Protected Routes - Provider */}
              <Route
                path="/provider/dashboard"
                element={
                  <PrivateRoute allowedRoles={['provider']}>
                    <ProviderDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/services"
                element={
                  <PrivateRoute allowedRoles={['provider']}>
                    <ServiceManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/bookings/today"
                element={
                  <PrivateRoute allowedRoles={['provider']}>
                    <TodaysBookings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/reviews"
                element={
                  <PrivateRoute allowedRoles={['provider']}>
                    <Reviews />
                  </PrivateRoute>
                }
              />
              
              {/* Protected Routes - Admin */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/providers"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminProviders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/providers/:id/documents"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminProviderDocuments />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminCustomers />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminCategories />
                  </PrivateRoute>
                }
              />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
