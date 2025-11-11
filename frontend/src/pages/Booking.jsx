import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { serviceAPI, bookingAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';
import { validateJordanianPhone, toInternationalFormat } from '../utils/phoneValidation';
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiCurrencyDollar,
  HiUser,
  HiPhone,
  HiMail,
  HiPlusCircle,
  HiMinusCircle,
  HiChevronDown
} from 'react-icons/hi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import CustomOTPInput from '../components/CustomOTPInput';
import GuestOTPInput from '../components/GuestOTPInput';
import HybridLocationSelector from '../components/HybridLocationSelector';

const Booking = () => {
  const { t, i18n } = useTranslation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, sendOTP, verifyOTP } = useAuth();
  
  // Convert numbers to Arabic numerals when language is Arabic
  const toArabicNumerals = (num) => {
    if (i18n.language === 'ar') {
      return num.toString().replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
    }
    return num;
  };

  // Helper function to safely parse JSON strings to arrays
  const parseJsonArrayField = (value, defaultValue = []) => {
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
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Details, 2: Confirm, 3: OTP
  const [submitting, setSubmitting] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isGuestBooking, setIsGuestBooking] = useState(!isAuthenticated);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [packagesExpanded, setPackagesExpanded] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    // Service details
    service_id: serviceId,
    provider_id: '',
    booking_date: new Date(),
    booking_time: '',
    duration_hours: 1,
    
    // Package and add-ons
    package_selected: '',
    add_ons_selected: [],
    
    // Customer details
    customer_name: user ? `${user.first_name} ${user.last_name}` : '',
    customer_phone: user?.phone || '',
    customer_email: user?.email || '',
    service_address: user?.address || '',
    service_city: user?.city || '',
    service_area: user?.area || '',
    customer_notes: '',
    
    // OTP
    otp: '',
  });
  
  const [pricing, setPricing] = useState({
    base_price: 0,
    add_ons_price: 0,
    discount_amount: 0,
    total_price: 0,
  });

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  useEffect(() => {
    calculatePricing();
  }, [bookingData.package_selected, bookingData.add_ons_selected, bookingData.duration_hours]);

  // OTP cooldown timer
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => {
        setOtpCooldown(otpCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getById(serviceId);
      
      // Handle different response structures
      const serviceData = response.data?.data?.service || 
                         response.data?.service || 
                         response.data || null;
      
      // Parse packages and add_ons (they might be JSON strings) and update serviceData
      if (serviceData) {
        serviceData.packages = parseJsonArrayField(serviceData.packages, []);
        serviceData.add_ons = parseJsonArrayField(serviceData.add_ons, []);
        serviceData.included_services = parseJsonArrayField(serviceData.included_services, []);
        serviceData.excluded_services = parseJsonArrayField(serviceData.excluded_services, []);
      }
      
      setService(serviceData);
      
      // Get values from URL params (from ServiceDetail page)
      const urlPackage = searchParams.get('package');
      const urlAddons = searchParams.get('addons');
      const urlDuration = searchParams.get('duration');
      
      // Use parsed packages and add_ons
      const packages = serviceData?.packages || [];
      const addOns = serviceData?.add_ons || [];
      
      // Validate URL package exists in service packages
      let validPackage = '';
      if (urlPackage && packages.length > 0) {
        const packageExists = packages.some(pkg => pkg.name === urlPackage);
        if (packageExists) {
          validPackage = urlPackage;
        }
      }
      
      // Validate URL add-ons exist in service add-ons
      let validAddons = [];
      if (urlAddons && addOns.length > 0) {
        const addonNames = urlAddons.split(',').filter(Boolean);
        validAddons = addonNames.filter(addonName => 
          addOns.some(addon => addon.name === addonName)
        );
      }
      
      // Set values - prioritize URL params, then defaults
      setBookingData(prev => ({
        ...prev,
        provider_id: serviceData?.provider_id,
        duration_hours: urlDuration ? parseFloat(urlDuration) : (serviceData?.duration_hours || 1),
        package_selected: validPackage || (packages?.[0]?.name || ''),
        add_ons_selected: validAddons,
      }));
      
      // Keep packages section collapsed by default (even if package is selected from URL)
    } catch (error) {
      console.error('Error fetching service:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to load service details');
      
      // Set null service on error and redirect
      setService(null);
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = () => {
    if (!service) return;
    
    let basePrice = parseFloat(service.base_price);
    
    // Apply package pricing if selected
    const packages = parseJsonArrayField(service.packages, []);
    const addOns = parseJsonArrayField(service.add_ons, []);
    
    if (bookingData.package_selected && packages.length > 0) {
      const selectedPackage = packages.find(p => p.name === bookingData.package_selected);
      if (selectedPackage) {
        basePrice = parseFloat(selectedPackage.price);
      }
    }
    
    // Calculate add-ons price
    let addOnsPrice = 0;
    if (bookingData.add_ons_selected.length > 0 && addOns.length > 0) {
      bookingData.add_ons_selected.forEach(addonName => {
        const addon = addOns.find(a => a.name === addonName);
        if (addon) {
          addOnsPrice += parseFloat(addon.price);
        }
      });
    }
    
    // Calculate based on duration for hourly services
    let subtotal = basePrice;
    if (service.price_type === 'hourly') {
      subtotal = basePrice * bookingData.duration_hours;
    }
    subtotal += addOnsPrice;
    
    // Calculate total (no tax)
    const totalPrice = subtotal;
    
    setPricing({
      base_price: basePrice,
      add_ons_price: addOnsPrice,
      discount_amount: 0,
      total_price: totalPrice,
    });
  };

  const toggleAddOn = (addonName) => {
    setBookingData(prev => {
      const addOns = [...prev.add_ons_selected];
      const index = addOns.indexOf(addonName);
      if (index > -1) {
        addOns.splice(index, 1);
      } else {
        addOns.push(addonName);
      }
      return { ...prev, add_ons_selected: addOns };
    });
  };

  const isFormValid = () => {
    try {
      // Debug: log all booking data
      console.log('🔍 Form Validation Check:', {
        booking_date: bookingData.booking_date,
        booking_time: bookingData.booking_time,
        customer_name: bookingData.customer_name,
        customer_phone: bookingData.customer_phone,
        service_address: bookingData.service_address,
        service_city: bookingData.service_city,
        service_area: bookingData.service_area,
        locationData: locationData
      });
      
      // Check if all required fields are filled
      if (!bookingData.booking_date || !bookingData.booking_time) {
        console.log('❌ Missing: date or time');
        return false;
      }
      
      // Additional: prevent past time selection for today
      const today = new Date();
      const selectedDate = new Date(bookingData.booking_date);
      selectedDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      if (selectedDate.getTime() === today.getTime()) {
        const [hour, minute] = bookingData.booking_time.split(':').map(Number);
        const bookingDateWithTime = new Date(bookingData.booking_date);
        bookingDateWithTime.setHours(hour,minute,0,0);
        if (bookingDateWithTime < new Date()) {
          console.log('❌ Invalid: past time selected');
          return false;
        }
      }
      
      // Validate customer name
      const customerName = String(bookingData.customer_name || '').trim();
      if (!customerName) {
        console.log('❌ Missing: customer_name');
        return false;
      }
      
      // Validate customer phone (only check if it exists, format validation happens on submit)
      const customerPhone = String(bookingData.customer_phone || '').trim();
      if (!customerPhone) {
        console.log('❌ Missing: customer_phone');
        return false;
      }
      
      // Validate service address
      const serviceAddress = String(bookingData.service_address || '').trim();
      if (!serviceAddress) {
        console.log('❌ Missing: service_address');
        return false;
      }
      
      // Validate city - check both bookingData and locationData
      let cityValue = '';
      
      // First try bookingData.service_city
      const serviceCity = bookingData.service_city;
      if (typeof serviceCity === 'string' && serviceCity.trim()) {
        cityValue = serviceCity.trim();
      } else if (serviceCity && typeof serviceCity === 'object') {
        cityValue = (serviceCity.name || serviceCity.slug || '').toString().trim();
      }
      
      // If not found in bookingData, check locationData
      if (!cityValue && locationData) {
        if (typeof locationData.city === 'string' && locationData.city.trim()) {
          cityValue = locationData.city.trim();
        } else if (locationData.city && typeof locationData.city === 'object') {
          cityValue = (locationData.city.name || locationData.city.slug || '').toString().trim();
        }
      }
      
      if (!cityValue) {
        console.log('❌ Missing: service_city', { 
          bookingDataCity: serviceCity, 
          locationDataCity: locationData?.city,
          cityValue 
        });
        return false;
      }
      
      // Validate area - check both bookingData and locationData
      let areaValue = '';
      
      // First try bookingData.service_area
      const serviceArea = bookingData.service_area;
      if (typeof serviceArea === 'string' && serviceArea.trim()) {
        areaValue = serviceArea.trim();
      } else if (serviceArea && typeof serviceArea === 'object') {
        areaValue = (serviceArea.name || serviceArea.slug || '').toString().trim();
      }
      
      // If not found in bookingData, check locationData
      if (!areaValue && locationData) {
        if (typeof locationData.area === 'string' && locationData.area.trim()) {
          areaValue = locationData.area.trim();
        } else if (locationData.area && typeof locationData.area === 'object') {
          areaValue = (locationData.area.name || locationData.area.slug || '').toString().trim();
        }
      }
      
      if (!areaValue) {
        console.log('❌ Missing: service_area', { 
          bookingDataArea: serviceArea,
          locationDataArea: locationData?.area,
          areaValue 
        });
        return false;
      }
      
      console.log('✅ Form is valid!');
      return true;
    } catch (error) {
      console.error('Form validation error:', error);
      return false;
    }
  };

  const handleNextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!isFormValid()) {
        if (!bookingData.booking_date || !bookingData.booking_time) {
          toast.error(t('booking.errors.selectDateTime'));
          return;
        }
        // Additional: prevent past time selection for today
        const today = new Date();
        const selectedDate = new Date(bookingData.booking_date);
        selectedDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        if (selectedDate.getTime() === today.getTime()) {
          const [hour, minute] = bookingData.booking_time.split(':').map(Number);
          const bookingDateWithTime = new Date(bookingData.booking_date);
          bookingDateWithTime.setHours(hour,minute,0,0);
          if (bookingDateWithTime < new Date()) {
            toast.error(t('booking.errors.pastTime'));
            return;
          }
        }
        if (!bookingData.customer_name || !bookingData.customer_phone) {
          toast.error(t('booking.errors.contactDetails'));
          return;
        }
        if (bookingData.customer_phone && !validateJordanianPhone(bookingData.customer_phone)) {
          toast.error(t('booking.errors.validPhone'));
          return;
        }
        if (!bookingData.service_address || !bookingData.service_city || !bookingData.service_area) {
          toast.error(t('booking.errors.serviceAddress'));
          return;
        }
      }
    }
    
    setStep(step + 1);
  };

  const handleSendOTP = async () => {
    if (otpCooldown > 0) {
      toast.error(t('booking.errors.otpCooldown', { seconds: otpCooldown }));
      return;
    }

    // Validate phone number
    if (!bookingData.customer_phone || bookingData.customer_phone.trim() === '') {
      toast.error(t('booking.errors.validPhone'));
      return;
    }

    // Validate Jordanian phone number format
    if (!validateJordanianPhone(bookingData.customer_phone)) {
      toast.error(t('booking.errors.validPhone'));
      return;
    }

    // Convert to international format for API
    const formattedPhone = toInternationalFormat(bookingData.customer_phone);

    try {
      setSubmitting(true);
      setOtpError(null);
      
      // Use booking API for guest bookings instead of auth API
      const response = await bookingAPI.sendOTP({
        customer_phone: formattedPhone
      });
      
      if (response.data.success) {
        setOtpSent(true);
        setStep(3);
        setOtpCooldown(60); // 60 second cooldown
        toast.success(t('booking.success.otpSent'));
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError(error.response?.data?.message || t('booking.errors.otpFailed'));
      
      if (error.response?.status === 429) {
        setOtpCooldown(120); // 2 minute cooldown for rate limit
        toast.error(t('booking.errors.tooManyRequests'));
      } else if (error.response?.status === 400) {
        toast.error(t('booking.errors.invalidPhone;Format'));
      } else {
        toast.error(error.response?.data?.message || t('booking.errors.otpFailed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitBooking = async () => {
    try {
      setSubmitting(true);
      // Prevent past bookings, too (backend safety)
      const today = new Date();
      const selectedDate = new Date(bookingData.booking_date);
      const [hour, minute] = bookingData.booking_time.split(':').map(Number);
      selectedDate.setHours(hour,minute,0,0);
      if (selectedDate < new Date()) {
        toast.error(t('booking.errors.pastTime'));
        setSubmitting(false);
        return;
      }
      
      // Format the booking data and clean it - match Postman format
      const formattedData = {
        service_id: bookingData.service_id,
        provider_id: bookingData.provider_id || service?.provider_id,
        booking_date: bookingData.booking_date.toISOString().split('T')[0],
        booking_time: bookingData.booking_time,
        duration_hours: bookingData.duration_hours,
        customer_name: bookingData.customer_name,
        customer_phone: toInternationalFormat(bookingData.customer_phone),
      };
      
      // Only add optional fields if they have values
      if (bookingData.customer_email) {
        formattedData.customer_email = bookingData.customer_email;
      }
      if (bookingData.service_address) {
        formattedData.service_address = bookingData.service_address;
      }
      if (bookingData.service_city) {
        formattedData.service_city = bookingData.service_city;
      }
      if (bookingData.service_area) {
        formattedData.service_area = bookingData.service_area;
      }
      if (bookingData.service_latitude) {
        formattedData.latitude = bookingData.service_latitude;
      }
      if (bookingData.service_longitude) {
        formattedData.longitude = bookingData.service_longitude;
      }
      if (bookingData.customer_notes) {
        formattedData.customer_notes = bookingData.customer_notes;
      }
      // Temporarily comment out package/add_ons to avoid backend validation error
      // The backend has a bug where it tries to use .find() on service.packages which is a JSON string
      // TODO: Re-enable when backend is fixed to parse JSON strings before using array methods
      // if (bookingData.package_selected) {
      //   formattedData.package_selected = bookingData.package_selected;
      // }
      // if (bookingData.add_ons_selected && bookingData.add_ons_selected.length > 0) {
      //   formattedData.add_ons_selected = bookingData.add_ons_selected;
      // }
      
      
      // Validate required fields
      const requiredFields = ['service_id', 'booking_date', 'booking_time', 'customer_name', 'customer_phone'];
      const missingFields = requiredFields.filter(field => !formattedData[field]);
      
      if (missingFields.length > 0) {
        toast.error(t('booking.errors.missingFields', { fields: missingFields.join(', ') }));
        return;
      }
      
      // For authenticated users, no additional verification needed
      
      // Log the data being sent for debugging
      console.log('📤 Sending booking data:', formattedData);
      
      // Create booking
      const response = await bookingAPI.create(formattedData);
      
      if (response.data.success) {
        toast.success(t('booking.success.bookingCreated'));
        navigate(`/booking/success/${response.data.data.booking.id}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      // Handle specific backend error related to packages parsing
      if (error.response?.data?.error?.includes('packages.find is not a function')) {
        console.error('⚠️ Backend Error: The backend is trying to use .find() on service.packages which is a JSON string.');
        console.error('⚠️ This is a backend bug that needs to be fixed: The backend should parse JSON strings before using array methods.');
        toast.error('Backend error: Service data format issue. Please contact support.');
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || t('booking.errors.bookingFailed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Guest booking functions
  const handleGuestSendOTP = async () => {
    if (!bookingData.customer_phone) {
      toast.error(t('home.guest_booking.phone_required'));
      return;
    }

    // Validate Jordanian phone number format
    if (!validateJordanianPhone(bookingData.customer_phone)) {
      toast.error(t('booking.errors.validPhone'));
      return;
    }

    // Convert to international format for API
    const formattedPhone = toInternationalFormat(bookingData.customer_phone);

    try {
      setSubmitting(true);
      setOtpError(null);
      
      const response = await bookingAPI.sendOTP({
        customer_phone: formattedPhone
      });
      
      if (response.data.success) {
        setOtpSent(true);
        setStep(3); // Move to OTP step
        toast.success(t('home.guest_booking.otp_sent'));
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError(error.response?.data?.message || t('home.guest_booking.otp_invalid'));
      toast.error(error.response?.data?.message || t('home.guest_booking.otp_invalid'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestOTPSubmit = async (otp) => {
    try {
      setSubmitting(true);
      setOtpError(null);
      // Prevent past booking for guest submission
      const today = new Date();
      const selectedDate = new Date(bookingData.booking_date);
      const [hour, minute] = bookingData.booking_time.split(':').map(Number);
      selectedDate.setHours(hour,minute,0,0);
      if (selectedDate < new Date()) {
        toast.error(t('booking.errors.pastTime'));
        setSubmitting(false);
        return;
      }
      
      // Create booking with OTP - match Postman format
      const formattedData = {
        service_id: bookingData.service_id,
        provider_id: bookingData.provider_id || service?.provider_id,
        booking_date: bookingData.booking_date.toISOString().split('T')[0],
        booking_time: bookingData.booking_time,
        duration_hours: bookingData.duration_hours,
        customer_name: bookingData.customer_name,
        customer_phone: toInternationalFormat(bookingData.customer_phone),
        otp: otp, // OTP for guest booking
      };
      
      // Only add optional fields if they have values
      if (bookingData.customer_email) {
        formattedData.customer_email = bookingData.customer_email;
      }
      if (bookingData.service_address) {
        formattedData.service_address = bookingData.service_address;
      }
      if (bookingData.service_city) {
        formattedData.service_city = bookingData.service_city;
      }
      if (bookingData.service_area) {
        formattedData.service_area = bookingData.service_area;
      }
      if (bookingData.service_latitude) {
        formattedData.latitude = bookingData.service_latitude;
      }
      if (bookingData.service_longitude) {
        formattedData.longitude = bookingData.service_longitude;
      }
      if (bookingData.customer_notes) {
        formattedData.customer_notes = bookingData.customer_notes;
      }
      // Temporarily comment out package/add_ons to avoid backend validation error
      // The backend has a bug where it tries to use .find() on service.packages which is a JSON string
      // TODO: Re-enable when backend is fixed to parse JSON strings before using array methods
      // if (bookingData.package_selected) {
      //   formattedData.package_selected = bookingData.package_selected;
      // }
      // if (bookingData.add_ons_selected && bookingData.add_ons_selected.length > 0) {
      //   formattedData.add_ons_selected = bookingData.add_ons_selected;
      // }
      
      console.log('Creating guest booking with data:', formattedData);
      const response = await bookingAPI.create(formattedData);
      
      if (response.data.success) {
        toast.success(t('home.guest_booking.booking_success'));
        // Store the phone number for potential login
        localStorage.setItem('guest_phone', toInternationalFormat(bookingData.customer_phone));
        navigate(`/booking/success/${response.data.data.booking.id}`);
      }
    } catch (error) {
      console.error('Error creating guest booking:', error);
      console.error('Error response:', error.response?.data);
      setOtpError(error.response?.data?.message || t('home.guest_booking.otp_invalid'));
      toast.error(error.response?.data?.message || t('home.guest_booking.otp_invalid'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestResendOTP = async () => {
    await handleGuestSendOTP();
  };

  // Location change handler
  const handleLocationChange = (location) => {
    setLocationData(location);
    
    if (location) {
      // Extract city and area - handle both string and object formats
      let cityValue = '';
      let areaValue = '';
      
      if (typeof location.city === 'string') {
        cityValue = location.city.trim();
      } else if (location.city && typeof location.city === 'object') {
        cityValue = (location.city.name || location.city.slug || '').toString().trim();
      }
      
      if (typeof location.area === 'string') {
        areaValue = location.area.trim();
      } else if (location.area && typeof location.area === 'object') {
        areaValue = (location.area.name || location.area.slug || '').toString().trim();
      }
      
      // If area is still empty but we have fullAddress, try to extract it
      if (!areaValue && location.fullAddress && cityValue) {
        // Try to extract area from fullAddress (format: "Area, City, ..." or "City, Area, ...")
        const parts = location.fullAddress.split(',').map(p => p.trim());
        // Look for a part that's not the city and not empty
        for (const part of parts) {
          if (part && part !== cityValue && part.length > 0) {
            areaValue = part;
            break;
          }
        }
      }
      
      // Update booking data with location information
      setBookingData(prev => ({
        ...prev,
        service_city: cityValue || '',
        service_area: areaValue || '',
        // If GPS location, also store coordinates for reference
        ...(location.latitude && location.longitude && {
          service_latitude: location.latitude,
          service_longitude: location.longitude
        })
      }));
    } else {
      // Clear location data
      setBookingData(prev => ({
        ...prev,
        service_city: '',
        service_area: '',
        service_latitude: null,
        service_longitude: null
      }));
    }
  };

  // Inside Booking component
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const isToday = (() => {
    const today = new Date();
    const selected = new Date(bookingData.booking_date);
    today.setHours(0,0,0,0);
    selected.setHours(0,0,0,0);
    return today.getTime() === selected.getTime();
  })();
  const currentTime = new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('booking.serviceNotFound')}</h2>
          <button onClick={() => navigate('/services')} className="btn-primary">
            {t('booking.browseServices')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= stepNumber
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {toArabicNumerals(stepNumber)}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-24 h-1 ${
                      step > stepNumber ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-4">
            <span className="text-sm">{t('booking.steps.details')}</span>
            <span className="text-sm">{t('booking.steps.confirmation')}</span>
            <span className="text-sm">{t('booking.steps.verification')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6">
                {/* Service Info */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4">{t('booking.serviceDetails')}</h2>
                  <div className="flex items-start gap-4">
                    {service.images?.[0] && (
                      <img
                        src={service.images[0].startsWith('http://') || service.images[0].startsWith('https://') 
                          ? service.images[0] 
                          : `${import.meta.env.VITE_API_URL}/uploads/services/${service.images[0]}`}
                        alt={service.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{t('booking.provider')}: {service.provider?.business_name}</span>
                        <span>{t('booking.duration')}: {service.duration_hours} {t('booking.hours')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Selection */}
                {(() => {
                  const packages = parseJsonArrayField(service.packages, []);
                  return packages.length > 0 && (
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{t('booking.selectPackage')}</h3>
                      <button
                        type="button"
                        onClick={() => setPackagesExpanded(!packagesExpanded)}
                        className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                      >
                        {packagesExpanded ? (
                          <>
                            <HiMinusCircle className="w-5 h-5" />
                            <span>{t('common.showLess')}</span>
                          </>
                        ) : (
                          <>
                            <HiPlusCircle className="w-5 h-5" />
                            <span>{t('common.showMore')}</span>
                          </>
                        )}
                      </button>
                    </div>
                    {packagesExpanded && (
                      <div className="space-y-3">
                        {packages.map((pkg) => (
                          <label
                            key={pkg.name}
                            className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                              bookingData.package_selected === pkg.name
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="package"
                              value={pkg.name}
                              checked={bookingData.package_selected === pkg.name}
                              onChange={(e) => setBookingData({ ...bookingData, package_selected: e.target.value })}
                              className="sr-only"
                            />
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{pkg.name}</p>
                                <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                                {pkg.features && (
                                  <ul className="mt-2 space-y-1">
                                    {pkg.features.map((feature, idx) => (
                                      <li key={idx} className="text-sm text-gray-500 flex items-center">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <p className="font-semibold text-primary-600">{formatPrice(pkg.price, i18n.language)}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {!packagesExpanded && bookingData.package_selected && (
                      <div className="text-sm text-gray-600">
                        {t('booking.package')}: <span className="font-medium text-primary-600">
                          {packages.find(p => p.name === bookingData.package_selected)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                  );
                })()}

                {/* Add-ons */}
                {(() => {
                  const addOns = parseJsonArrayField(service.add_ons, []);
                  return addOns.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-semibold mb-4">{t('booking.additionalServices')}</h3>
                    <div className="space-y-3">
                      {addOns.map((addon) => (
                        <label
                          key={addon.name}
                          className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                            bookingData.add_ons_selected.includes(addon.name)
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={bookingData.add_ons_selected.includes(addon.name)}
                                onChange={() => toggleAddOn(addon.name)}
                                className="mr-3"
                              />
                              <div>
                                <p className="font-medium">{addon.name}</p>
                                <p className="text-sm text-gray-600">{addon.description}</p>
                              </div>
                            </div>
                            <p className="font-semibold text-primary-600">+{formatPrice(addon.price, i18n.language)}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  );
                })()}

                {/* Date & Time */}
                <div className="card p-6">
                  <h3 className="font-semibold mb-4">{t('booking.schedule')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        {t('booking.date')} <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        selected={bookingData.booking_date}
                        onChange={(date) => setBookingData({ ...bookingData, booking_date: date })}
                        minDate={new Date()}
                        className="input w-full"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                    <div>
                      <label className="label">
                        {t('booking.time')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={bookingData.booking_time}
                          onChange={(e) => setBookingData({ ...bookingData, booking_time: e.target.value })}
                          className="input appearance-none cursor-pointer pr-10 bg-white"
                        >
                          <option value="" disabled>{t('booking.time')}</option>
                          {timeSlots.map(time => {
                            // If today, disable times before now
                            let disabled = false;
                            if (isToday) {
                              const [hour, minute] = time.split(':').map(Number);
                              const slotDate = new Date();
                              slotDate.setHours(hour, minute, 0, 0);
                              if (slotDate < currentTime) {
                                disabled = true;
                              }
                            }
                            return (
                              <option key={time} value={time} disabled={disabled}>{time}</option>
                            );
                          })}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <HiChevronDown className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {service.price_type === 'hourly' && (
                    <div className="mt-4">
                      <label className="label">{t('booking.durationHours')}</label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingData(prev => ({ 
                            ...prev, 
                            duration_hours: Math.max(1, prev.duration_hours - 0.5) 
                          }))}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <HiMinusCircle className="w-6 h-6 text-gray-600" />
                        </button>
                        <span className="text-xl font-semibold w-16 text-center">
                          {toArabicNumerals(bookingData.duration_hours)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBookingData(prev => ({ 
                            ...prev, 
                            duration_hours: prev.duration_hours + 0.5 
                          }))}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <HiPlusCircle className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="card p-6">
                  <h3 className="font-semibold mb-4">{t('booking.contactInformation')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        {t('booking.fullName')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={bookingData.customer_name}
                        onChange={(e) => setBookingData({ ...bookingData, customer_name: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">
                        {t('booking.phoneNumber')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={bookingData.customer_phone}
                        onChange={(e) => setBookingData({ ...bookingData, customer_phone: e.target.value })}
                        className="input"
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">{t('booking.emailOptional')}</label>
                      <input
                        type="email"
                        value={bookingData.customer_email}
                        onChange={(e) => setBookingData({ ...bookingData, customer_email: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Address */}
                <div className="card p-6">
                  <h3 className="font-semibold mb-4">{t('booking.serviceAddress')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        {t('booking.address')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={bookingData.service_address}
                        onChange={(e) => setBookingData({ ...bookingData, service_address: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">
                        {t('booking.serviceLocation')} <span className="text-red-500">*</span>
                      </label>
                      <HybridLocationSelector
                        onLocationChange={handleLocationChange}
                        value={locationData}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">{t('booking.additionalNotes')}</label>
                      <textarea
                        value={bookingData.customer_notes}
                        onChange={(e) => setBookingData({ ...bookingData, customer_notes: e.target.value })}
                        className="input min-h-[100px]"
                        placeholder={t('booking.notesPlaceholder')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">{t('booking.confirmation')}</h2>
                
                <div className="space-y-4">
                  <div className="pb-4 border-b">
                    <h3 className="font-medium text-gray-700 mb-2">{t('booking.serviceDetails')}</h3>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-gray-600">{t('booking.provider')}: {service.provider?.business_name}</p>
                    {bookingData.package_selected && (
                      <p className="text-sm text-gray-600">{t('booking.package')}: {bookingData.package_selected}</p>
                    )}
                  </div>
                  
                  <div className="pb-4 border-b">
                    <h3 className="font-medium text-gray-700 mb-2">{t('booking.schedule')}</h3>
                    <p className="text-sm">
                      {bookingData.booking_date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm">{t('booking.time')}: {bookingData.booking_time}</p>
                    <p className="text-sm">{t('booking.duration')}: {toArabicNumerals(bookingData.duration_hours)} {t('booking.hours')}</p>
                  </div>
                  
                  <div className="pb-4 border-b">
                    <h3 className="font-medium text-gray-700 mb-2">{t('booking.contactInformation')}</h3>
                    <p className="text-sm">{bookingData.customer_name}</p>
                    <p className="text-sm">{bookingData.customer_phone}</p>
                    {bookingData.customer_email && (
                      <p className="text-sm">{bookingData.customer_email}</p>
                    )}
                  </div>
                  
                  <div className="pb-4 border-b">
                    <h3 className="font-medium text-gray-700 mb-2">{t('booking.serviceAddress')}</h3>
                    <p className="text-sm">{bookingData.service_address}</p>
                    <p className="text-sm">{bookingData.service_city}, {bookingData.service_area}</p>
                    {locationData && locationData.mode === 'auto' && locationData.latitude && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t('location.coordinates')}: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                  
                  {bookingData.add_ons_selected.length > 0 && (
                    <div className="pb-4 border-b">
                      <h3 className="font-medium text-gray-700 mb-2">{t('booking.additionalServices')}</h3>
                      <ul className="space-y-1">
                        {bookingData.add_ons_selected.map(addon => (
                          <li key={addon} className="text-sm text-gray-600">• {addon}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    {t('common.back')}
                  </button>
                  {isGuestBooking ? (
                    <button
                      onClick={handleGuestSendOTP}
                      disabled={submitting}
                      className="btn-primary flex-1"
                    >
                      {submitting ? t('common.loading') : t('home.guest_booking.title')}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitBooking}
                      disabled={submitting}
                      className="btn-primary flex-1"
                    >
                      {submitting ? t('booking.processing') : t('booking.confirmBooking')}
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card p-6">
                {isGuestBooking ? (
                  <GuestOTPInput
                    onOTPSubmit={handleGuestOTPSubmit}
                    onResendOTP={handleGuestResendOTP}
                    phone={bookingData.customer_phone}
                    loading={submitting}
                    error={otpError}
                  />
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-6">{t('booking.verifyPhone')}</h2>
                    
                    <p className="text-gray-600 mb-6">
                      {t('booking.otpSent', { phone: bookingData.customer_phone })}
                    </p>
                    
                    <div className="mb-6">
                      <label className="label">{t('booking.enterOtp')}</label>
                      <CustomOTPInput
                        value={bookingData.otp}
                        onChange={(otp) => setBookingData({ ...bookingData, otp })}
                        numInputs={6}
                        separator={<span className="mx-2">-</span>}
                        inputStyle="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                        containerStyle="flex justify-center"
                        shouldAutoFocus
                      />
                    </div>
                  </>
                )}
                
                {!isGuestBooking && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="btn-secondary"
                    >
                      {t('common.back')}
                    </button>
                    <button
                      onClick={handleSubmitBooking}
                      disabled={submitting || bookingData.otp.length !== 6}
                      className="btn-primary flex-1"
                    >
                      {submitting ? t('booking.creatingBooking') : t('booking.confirmBooking')}
                    </button>
                  </div>
                )}
                
                {!isGuestBooking && (
                  <button
                    onClick={handleSendOTP}
                    disabled={otpCooldown > 0}
                    className={`w-full mt-4 text-sm ${otpCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-700'}`}
                  >
                    {otpCooldown > 0 ? t('booking.resendOtpIn', { seconds: otpCooldown }) : t('booking.resendOtp')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-semibold text-lg mb-4">{t('booking.priceSummary')}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('booking.basePrice')}</span>
                  <span className="font-medium">{formatPrice(pricing.base_price, i18n.language)}</span>
                </div>
                
                {service?.price_type === 'hourly' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('booking.duration')}</span>
                    <span className="font-medium">× {toArabicNumerals(bookingData.duration_hours)} {t('booking.hours')}</span>
                  </div>
                )}
                
                {pricing.add_ons_price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('booking.addOns')}</span>
                    <span className="font-medium">{formatPrice(pricing.add_ons_price, i18n.language)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">{t('booking.total')}</span>
                    <span className="font-bold text-xl text-primary-600">
                      {formatPrice(pricing.total_price, i18n.language)}
                    </span>
                  </div>
                </div>
              </div>
              
              {step === 1 && (
                <button
                  onClick={handleNextStep}
                  disabled={!isFormValid()}
                  className={`w-full mt-6 inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isFormValid() 
                      ? 'btn-primary' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                  }`}
                >
                  {t('common.continue')}
                </button>
              )}
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>{t('booking.cancellationPolicy')}:</strong> {t('booking.cancellationPolicyText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;