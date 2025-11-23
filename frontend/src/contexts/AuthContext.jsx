import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set api default header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      console.log('Fetching user profile...');
      const response = await api.get('/auth/profile');
      console.log('User profile response:', response.data);
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 401) {
        // Only logout if we have a token but the request failed
        // This prevents logout during initial app load when there's no token
        if (token) {
          logout();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    let response = null;
    try {
      // Don't format phone number for login - send as is
      const formattedCredentials = { ...credentials };
      
      console.log('Original credentials:', credentials);
      console.log('Formatted credentials:', formattedCredentials);
      console.log('API URL:', api.defaults.baseURL);
      // response = await api.post('/auth/login', formattedCredentials);
      response = await api.post('/auth/login', {
  ...formattedCredentials,
  role: credentials.role,
});
      console.log('Login response:', response?.data);
      
      // Safely extract token and user with null checks
      if (!response || !response.data || !response.data.data) {
        throw new Error('Invalid response structure from server');
      }
      
      const { token, user } = response.data.data;
      
      if (!token || !user) {
        throw new Error('Missing token or user data in response');
      }
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Clear guest phone from localStorage after successful login
      localStorage.removeItem('guest_phone');
      
      console.log('Login successful, user set:', user);
      // toast.success(t('auth.messages.loginSuccess'));
      return { success: true, user };
    } 
    // catch (error) {
    //   console.error('Login error:', error);
    //   // Safely access error response
    //   const errorResponse = error?.response;
    //   if (errorResponse) {
    //     console.error('Error response:', errorResponse.data);
    //   }
    //   const message = errorResponse?.data?.message || error?.message || t('auth.messages.loginFailed');
    //   const errorMessage = message.toLowerCase();
      
    //   // Check if user is not verified
    //   const isUnverified = 
    //     errorMessage.includes('not verified') ||
    //     errorMessage.includes('unverified') ||
    //     errorMessage.includes('phone not verified') ||
    //     errorMessage.includes('email not verified') ||
    //     errorMessage.includes('verification required') ||
    //     errorMessage.includes('needs verification') ||
    //     errorResponse?.status === 403 ||
    //     errorResponse?.data?.code === 'UNVERIFIED';
      
    //   // Extract phone or email from credentials
    //   const phoneOrEmail = credentials?.phone || credentials?.email || '';
      
    //   if (isUnverified) {
    //     // Don't show error toast for unverified users - modal will handle it
    //     return { 
    //       success: false, 
    //       message, 
    //       needsVerification: true,
    //       phoneOrEmail: phoneOrEmail
    //     };
    //   }
      
    //   toast.error(message);
    //   return { success: false, message };
    // }
    catch (error) {
  console.error("Login error:", error);

  const errorResponse = error?.response;

  if (errorResponse) {
    console.error("Error response:", errorResponse.data);
  }

  const message =
    errorResponse?.data?.message ||
    error?.message ||
    t("auth.messages.loginFailed");

  // toast.error(message);
  // return { success: false, message };
}
  };

  // const signup = async (userData) => {
  //   try {
  //     console.log('Signup data:', userData);
      
  //     // Use different endpoints based on role
  //     const endpoint = userData.role === 'provider' 
  //       ? '/providers/register' 
  //       : '/auth/signup';
      
  //     console.log('Using endpoint:', endpoint);
      
  //     const response = await api.post(endpoint, userData);
  //     console.log('Signup response:', response.data);
      
  //     // For customer signup, API returns: { success: true, message: "account_created_verify_otp", data: { expires_at, phone, message } }
  //     // For provider signup, it might return different structure
  //     if (userData.role === 'provider') {
  //       const { user, verification_required } = response.data.data || {};
  //       toast.success(t('auth.messages.signupSuccess'));
  //       return { success: true, user, verification_required };
  //     } else {
  //       // Customer signup response structure
  //       const { expires_at, phone, message } = response.data.data || {};
  //       toast.success(response.data.message || t('auth.messages.signupSuccess'));
  //       return { success: true, expires_at, phone, message: response.data.message };
  //     }
  //   } catch (error) {
  //     console.error('Signup error:', error);
  //     console.error('Error response:', error.response?.data);
  //     console.error('Error status:', error.response?.status);
  //     console.error('Request data sent:', userData);
      
  //     const message = error.response?.data?.message || t('auth.messages.signupFailed');
  //     const validationErrors = error.response?.data?.errors;
      
  //     if (validationErrors && validationErrors.length > 0) {
  //       console.error('Validation errors:', validationErrors);
  //       toast.error(`${t('auth.messages.validationError')}: ${validationErrors[0].message}`);
  //     } else {
  //       toast.error(message);
  //     }
      
  //     return { success: false, message };
  //   }
  // };
// const signup = async (userData) => {
//   try {
//     const endpoint = userData.role === 'provider'
//       ? '/providers/register'
//       : '/auth/signup';
// console.log("Sending signup request payload:", userData);

//     const response = await api.post(endpoint, userData);

//     toast.success("Account created successfully");

//     // Return immediate token + user
//     return {
//       success: true,
//       token: response.data.data.token,
//       user: response.data.data.user,
//     };

//   } catch (error) {
//     console.log("BACKEND VALIDATION ERRORS:", error.response?.data);

//     const message = error.response?.data?.message || "Signup failed";
//     toast.error(message);
//     return { success: false };
//   }
// };
// const signup = async (userData) => {
//   try {
//     // For providers, use the provider endpoint but with basic user data only
//     const endpoint = userData.role === 'provider' 
//       ? '/providers/register' 
//       : '/auth/signup';
    
//     console.log("Sending signup request payload:", userData);

//     const response = await api.post(endpoint, userData);

//     toast.success("Account created successfully");

//     // Return immediate token + user
//     return {
//       success: true,
//       token: response.data.data.token,
//       user: response.data.data.user,
//     };

//   } catch (error) {
//     console.log("BACKEND VALIDATION ERRORS:", error.response?.data);

//     const message = error.response?.data?.message || "Signup failed";
//     toast.error(message);
//     return { success: false };
//   }
// };
  
const signup = async (userData) => {
  try {
    const endpoint = userData.role === 'provider'
      ? '/providers/register'
      : '/auth/signup';
    
    console.log("Sending signup request payload:", userData);

    const response = await api.post(endpoint, userData);
    
    console.log("Backend response:", response.data); // Debug the response

    toast.success("Account created successfully");

    // Return the actual response structure from backend
    return {
      success: true,
      ...response.data // Spread the entire backend response
    };

  } catch (error) {
    console.log("BACKEND VALIDATION ERRORS:", error.response?.data);

    const message = error.response?.data?.message || "Signup failed";
    toast.error(message);
    return { success: false };
  }
};

const sendOTP = async (phoneOrEmail, purpose) => {
    try {
      const data = {};
      if (phoneOrEmail.includes('@')) {
        data.email = phoneOrEmail;
      } else {
        // Ensure phone number is in international format
        let formattedPhone = phoneOrEmail;
        if (!phoneOrEmail.startsWith('+')) {
          // If it's a Jordanian number without country code, add it
          if (phoneOrEmail.startsWith('07')) {
            formattedPhone = '+962' + phoneOrEmail.substring(1);
          } else if (phoneOrEmail.startsWith('7')) {
            formattedPhone = '+962' + phoneOrEmail;
          } else {
            formattedPhone = phoneOrEmail;
          }
        }
        data.phone = formattedPhone;
      }
      data.purpose = purpose;
      
      console.log('Sending OTP with data:', data);
      const resp=await authAPI.sendOTP(data);
      console.log("with reusable : ",resp.data);//its work
      const response = await api.post('/auth/send-otp', data);
      console.log('OTP response:', response.data);
      toast.success(t('auth.messages.otpSent'));
      return { success: true };
    } catch (error) {
      console.error('OTP Error:', error.response?.data);
      console.error('Full error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      const message = error.response?.data?.message || error.response?.data?.error || t('auth.messages.otpSendFailed');
      const errorMessage = message.toLowerCase();
      
      // Check if user is not verified (for login purpose)
      const isUnverified = 
        purpose === 'login' && (
          errorMessage.includes('not verified') ||
          errorMessage.includes('unverified') ||
          errorMessage.includes('phone not verified') ||
          errorMessage.includes('email not verified') ||
          errorMessage.includes('verification required') ||
          errorMessage.includes('needs verification') ||
          error.response?.status === 403 ||
          error.response?.data?.code === 'UNVERIFIED'
        );
      
      if (isUnverified) {
        // Don't show error toast for unverified users - modal will handle it
        return { 
          success: false, 
          message, 
          needsVerification: true,
          phoneOrEmail: phoneOrEmail
        };
      }
      
      toast.error(message);
      return { success: false, message };
    }
  };

  const verifyOTP = async (phoneOrEmail, otp, purpose, additionalData = {}) => {
    try {
      const data = { otp, purpose };
      if (phoneOrEmail.includes('@')) {
        data.email = phoneOrEmail;
      } else {
        // For verify_phone purpose (signup verification), send phone as-is (without +962)
        // For login purpose, format to international format
        let formattedPhone = phoneOrEmail;
        if (purpose === 'verify_phone') {
          // Remove +962 prefix if present, keep local format (07XXXXXXXX)
          formattedPhone = phoneOrEmail.replace(/^\+962/, '').replace(/^962/, '');
        } else if (!phoneOrEmail.startsWith('+')) {
          // For login, ensure phone number is in international format
          if (phoneOrEmail.startsWith('07')) {
            formattedPhone = '+962' + phoneOrEmail.substring(1);
          } else if (phoneOrEmail.startsWith('7')) {
            formattedPhone = '+962' + phoneOrEmail;
          } else {
            formattedPhone = phoneOrEmail;
          }
        }
        data.phone = formattedPhone;
      }
      
      // Only include additional data for signup purpose
      if (purpose === 'signup' && additionalData) {
        Object.assign(data, additionalData);
      }
      
      console.log('Verifying OTP with data:', data);
      const response = await api.post('/auth/verify-otp', data);
      console.log('OTP verification response:', response.data);
      
      const { token, user, is_new_user } = response.data.data;
      
      // Save token and user for both login and verify_phone purposes (signup verification)
      if (token && (purpose === 'login' || purpose === 'verify_phone')) {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Clear guest phone from localStorage after successful login
        localStorage.removeItem('guest_phone');
      }
      
      toast.success(t('auth.messages.otpVerified'));
      return { success: true, user, is_new_user, token };
    } catch (error) {
      console.error('OTP verification error:', error.response?.data);
      console.error('Validation errors:', error.response?.data?.errors);
      console.error('Full error:', error);
      const message = error.response?.data?.message || error.response?.data?.error || t('auth.messages.invalidOTP');
      const errorMessage = message.toLowerCase();
      
      // Check if user is not verified (for login purpose)
      const isUnverified = 
        purpose === 'login' && (
          errorMessage.includes('not verified') ||
          errorMessage.includes('unverified') ||
          errorMessage.includes('phone not verified') ||
          errorMessage.includes('email not verified') ||
          errorMessage.includes('verification required') ||
          errorMessage.includes('needs verification') ||
          error.response?.status === 403 ||
          error.response?.data?.code === 'UNVERIFIED'
        );
      
      if (isUnverified) {
        // Don't show error toast for unverified users - modal will handle it
        return { 
          success: false, 
          message, 
          needsVerification: true,
          phoneOrEmail: phoneOrEmail
        };
      }
      
      const validationErrors = error.response?.data?.errors;
      if (validationErrors && validationErrors.length > 0) {
        console.error('Specific validation errors:', validationErrors);
        toast.error(`${t('auth.messages.validationError')}: ${validationErrors[0].message}`);
      } else {
        toast.error(message);
      }
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    toast.success(t('auth.messages.logoutSuccess'));
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      setUser(response.data.data.user);
      toast.success(t('auth.messages.profileUpdated'));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || t('auth.messages.profileUpdateFailed');
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    sendOTP,
    verifyOTP,
    updateProfile,
    isAuthenticated: !!user,
    isProvider: user?.role === 'provider',
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
