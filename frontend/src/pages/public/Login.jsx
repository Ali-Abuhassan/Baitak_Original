
// // // src/pages/auth/LoginRedesigned.jsx
// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { useAuth } from "../../contexts/AuthContext";
// // import { HiPhone, HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
// // import CustomOTPInput from "../../components/sharedInputs/CustomOTPInput";
// // import VerificationModal from "../../components/VerificationModal";
// // import toast from "react-hot-toast";
// // import { useTranslation } from "react-i18next";

// // /**
// //  * Redesigned Login page (matches provided mockup).
// //  * Background image is loaded from local path (will be converted to a URL by your tooling).
// //  * Image path used below:
// //  * /mnt/data/724a4b8d-bfd1-4f39-8864-72105b32cbcd.png
// //  */
// // const LoginRedesigned = () => {
// //   const navigate = useNavigate();
// //   const { login, sendOTP, verifyOTP, isAuthenticated, user, loading } = useAuth();
// //   const { t } = useTranslation();

// //   // UI state
// //   const [accountType, setAccountType] = useState("user"); // 'user' | 'provider'
// //   const [loginMethod, setLoginMethod] = useState("email"); // 'email' | 'phone'
// //   const [step, setStep] = useState("phone"); // for OTP flow: 'phone' | 'otp'
// //   const [showPassword, setShowPassword] = useState(false);

// //   // form state
// //   const [formData, setFormData] = useState({
// //     phone: "",
// //     email: "",
// //     password: "",
// //     otp: "",
// //   });

// //   const [showVerificationModal, setShowVerificationModal] = useState(false);
// //   const [verificationPhone, setVerificationPhone] = useState("");

// //   // Redirect if already authenticated
// //   useEffect(() => {
// //     if (!loading && isAuthenticated) {
// //       if (user?.role === "provider") navigate("/provider/dashboard", { replace: true });
// //       else navigate("/", { replace: true });
// //     }
// //   }, [isAuthenticated, user, loading, navigate]);

// //   // prefills
// //   useEffect(() => {
// //     const guestPhone = localStorage.getItem("guest_phone");
// //     if (guestPhone && !formData.phone) {
// //       setFormData((p) => ({ ...p, phone: guestPhone }));
// //     }
// //   }, []);

// //   /* ---------- Handlers (kept similar to your existing logic) ---------- */

// //   const handleSendOTP = async (e) => {
// //     e?.preventDefault?.();
// //     const phone = formData.phone;
// //     if (!phone) {
// //       toast.error(t("auth.login.enter_phone") || "Please enter phone number");
// //       return;
// //     }
// //     const intlPhoneRegex = /^\+?\d{7,15}$/;
// //     if (!intlPhoneRegex.test(phone)) {
// //       toast.error(t("auth.login.phone_10_digits_only") || "Please enter a valid phone number");
// //       return;
// //     }

// //     const result = await sendOTP(phone, "login");
// //     if (result.success) {
// //       setStep("otp");
// //     } else if (result.needsVerification && result.phoneOrEmail) {
// //       setVerificationPhone(result.phoneOrEmail);
// //       setShowVerificationModal(true);
// //     }
// //   };

// //   const handleVerifyOTP = async (e) => {
// //     e?.preventDefault?.();
// //     if (!formData.otp || formData.otp.length !== 6) {
// //       toast.error(t("auth.login.invalid_otp") || "Invalid OTP");
// //       return;
// //     }
// //     const result = await verifyOTP(formData.phone, formData.otp, "login");
// //     if (result.success) {
// //       if (result.user.role === "provider") navigate("/provider/dashboard", { replace: true });
// //       else navigate("/", { replace: true });
// //     } else if (result.needsVerification && result.phoneOrEmail) {
// //       setVerificationPhone(result.phoneOrEmail);
// //       setShowVerificationModal(true);
// //     }
// //   };

// //   const handlePasswordLogin = async (e) => {
// //     e.preventDefault();
// //     const inputValue = formData.email || formData.phone;
// //     if (!inputValue) {
// //       toast.error(t("auth.login.enter_email_or_phone") || "Please enter email or phone");
// //       return;
// //     }

// //     let credentials = { password: formData.password };
// //     if (inputValue.includes("@")) credentials.email = inputValue;
// //     else credentials.phone = inputValue;

// //     const result = await login(credentials);
// //     if (result.success) {
// //       if (result.user.role === "provider") navigate("/provider/dashboard", { replace: true });
// //       else navigate("/", { replace: true });
// //     } else if (result.needsVerification && result.phoneOrEmail) {
// //       setVerificationPhone(result.phoneOrEmail);
// //       setShowVerificationModal(true);
// //     }
// //   };

// //   const handleModalOTPSent = async (phone) => {
// //     return await sendOTP(phone, "verify_phone");
// //   };

// //   const handleModalOTPVerified = async (phone, otp) => {
// //     const result = await verifyOTP(phone, otp, "verify_phone");
// //     if (result.success) {
// //       if (result.user?.role === "provider") navigate("/provider/dashboard", { replace: true });
// //       else navigate("/", { replace: true });
// //     }
// //     return result;
// //   };

// //   /* ---------------- Loading state ---------------- */
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen flex">
// //       {/* Left Hero */}
// //       <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-gray-900">
// //         <img
// //           src="/mnt/data/724a4b8d-bfd1-4f39-8864-72105b32cbcd.png"
// //           alt="hero"
// //           className="absolute inset-0 w-full h-full object-cover filter brightness-50"
// //         />
// //         <div className="relative z-10 w-10/12 max-w-lg text-center text-white">
// //           <img src="/baitk-logo.png" alt="Baitak" className="mx-auto mb-6 h-12 w-auto" />
// //           <h1 className="text-4xl font-extrabold mb-2">Welcome Back</h1>
// //           <p className="text-sm opacity-90">
// //             Log in to access your account and manage your home services
// //           </p>

// //           {/* small dots like in mockup */}
// //           <div className="mt-8 flex items-center justify-center gap-2">
// //             <span className="h-2 w-6 rounded-full bg-green-400" />
// //             <span className="h-2 w-2 rounded-full bg-white/60" />
// //             <span className="h-2 w-2 rounded-full bg-white/60" />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Right Form */}
// //       <div className="flex-1 flex items-center justify-center bg-white py-12 px-6">
// //         <div className="w-full max-w-md">
// //           <div className="flex items-start justify-between mb-6">
// //             <div>
// //               <h2 className="text-2xl font-semibold">Log In</h2>
// //               <p className="text-sm text-gray-500">Access your BAITAK account</p>
// //             </div>

// //             <div className="text-sm">
// //               <a
// //                 href="#"
// //                 className="text-gray-400 hover:text-gray-600"
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   // Admin login link behavior - you can adapt to route
// //                   navigate("/admin/login");
// //                 }}
// //               >
// //                 Admin Log in
// //               </a>
// //             </div>
// //           </div>

// //           <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-6">
// //             {/* Login As */}
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="flex items-center gap-2">
// //                 <span className="text-sm text-gray-600 mr-2">Login As</span>
// //                 <div className="flex rounded-full bg-gray-100 p-1">
// //                   <button
// //                     className={`px-3 py-1 rounded-full text-sm font-medium transition ${
// //                       accountType === "user"
// //                         ? "bg-green-500 text-white shadow-sm"
// //                         : "text-gray-600 hover:bg-white"
// //                     }`}
// //                     onClick={() => setAccountType("user")}
// //                   >
// //                     User
// //                   </button>
// //                   <button
// //                     className={`px-3 py-1 rounded-full text-sm font-medium transition ${
// //                       accountType === "provider"
// //                         ? "bg-green-500 text-white shadow-sm"
// //                         : "text-gray-600 hover:bg-white"
// //                     }`}
// //                     onClick={() => setAccountType("provider")}
// //                   >
// //                     Provider
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Login Method */}
// //             <div className="mb-5">
// //               <div className="text-sm text-gray-600 mb-2">Login Method</div>
// //               <div className="flex gap-2 rounded-md bg-gray-100 p-1">
// //                 <button
// //                   onClick={() => {
// //                     setLoginMethod("email");
// //                     setStep("phone");
// //                   }}
// //                   className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
// //                     loginMethod === "email"
// //                       ? "bg-green-500 text-white shadow-sm"
// //                       : "text-gray-500 hover:text-gray-700"
// //                   }`}
// //                 >
// //                   Email & Password
// //                 </button>
// //                 <button
// //                   onClick={() => {
// //                     setLoginMethod("phone");
// //                     setStep("phone");
// //                   }}
// //                   className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
// //                     loginMethod === "phone"
// //                       ? "bg-green-500 text-white shadow-sm"
// //                       : "text-gray-500 hover:text-gray-700"
// //                   }`}
// //                 >
// //                   Phone & OTP
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Form area */}
// //             {loginMethod === "email" ? (
// //               <form onSubmit={handlePasswordLogin} className="space-y-4">
// //                 <div>
// //                   <label className="text-sm text-gray-600">Email</label>
// //                   <div className="mt-1 relative">
// //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                       <HiMail className="h-5 w-5 text-gray-400" />
// //                     </div>
// //                     <input
// //                       type="email"
// //                       required
// //                       value={formData.email}
// //                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                       className="w-full border border-gray-200 rounded-md px-3 py-2 pl-10 text-sm placeholder-gray-400"
// //                       placeholder="john.doe@example.com"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="text-sm text-gray-600">Password</label>
// //                   <div className="mt-1 relative">
// //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                       <HiLockClosed className="h-5 w-5 text-gray-400" />
// //                     </div>
// //                     <input
// //                       type={showPassword ? "text" : "password"}
// //                       required
// //                       value={formData.password}
// //                       onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //                       className="w-full border border-gray-200 rounded-md px-3 py-2 pl-10 pr-10 text-sm placeholder-gray-400"
// //                       placeholder="Enter your password"
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => setShowPassword((s) => !s)}
// //                       className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
// //                       aria-label="toggle password visibility"
// //                     >
// //                       {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="flex items-center justify-between">
// //                   <div className="text-sm">
// //                     <Link to="/forgot-password" className="text-green-600 hover:underline">
// //                       Forgot Password?
// //                     </Link>
// //                   </div>
// //                 </div>

// //                 <button type="submit" className="w-full py-2 rounded-md bg-green-500 text-white font-medium">
// //                   Log In
// //                 </button>

// //                 <p className="text-center text-sm text-gray-500">
// //                   Don't have an account?{" "}
// //                   <Link to="/signup" className="text-green-600 hover:underline">
// //                     Sign Up
// //                   </Link>
// //                 </p>
// //               </form>
// //             ) : (
// //               // Phone & OTP flow
// //               <div>
// //                 {step === "phone" ? (
// //                   <form onSubmit={handleSendOTP} className="space-y-4">
// //                     <div>
// //                       <label className="text-sm text-gray-600">Phone Number</label>
// //                       <div className="mt-1 relative">
// //                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                           <HiPhone className="h-5 w-5 text-gray-400" />
// //                         </div>
// //                         <input
// //                           type="tel"
// //                           required
// //                           value={formData.phone}
// //                           onChange={(e) => {
// //                             // allow digits and optional leading +
// //                             const v = e.target.value.replace(/[^\d+]/g, "");
// //                             setFormData({ ...formData, phone: v });
// //                           }}
// //                           className="w-full border border-gray-200 rounded-md px-3 py-2 pl-10 text-sm placeholder-gray-400"
// //                           placeholder="079XXXXXXX"
// //                         />
// //                       </div>
// //                     </div>

// //                     <div className="flex items-center gap-3">
// //                       <button type="submit" className="flex-1 py-2 rounded-md bg-green-500 text-white font-medium">
// //                         Send OTP
// //                       </button>
// //                     </div>

// //                     <p className="text-center text-sm text-gray-500">
// //                       Or{" "}
// //                       <button
// //                         type="button"
// //                         onClick={() => setLoginMethod("email")}
// //                         className="text-green-600 hover:underline"
// //                       >
// //                         use email & password
// //                       </button>
// //                     </p>
// //                   </form>
// //                 ) : (
// //                   // OTP verify
// //                   <form onSubmit={handleVerifyOTP} className="space-y-4">
// //                     <div>
// //                       <label className="text-sm text-gray-600">Verify OTP</label>
// //                       <p className="text-xs text-gray-500 mb-2">We sent an OTP to {formData.phone}</p>
// //                       <CustomOTPInput
// //                         value={formData.otp}
// //                         onChange={(otp) => setFormData({ ...formData, otp })}
// //                         numInputs={6}
// //                         separator={<span className="mx-1" />}
// //                         inputStyle="w-11 h-11 text-center border rounded-md focus:outline-none"
// //                         containerStyle="flex justify-center gap-2"
// //                         shouldAutoFocus
// //                       />
// //                     </div>

// //                     <div className="flex gap-2">
// //                       <button type="button" onClick={() => setStep("phone")} className="flex-1 py-2 rounded-md border">
// //                         Back
// //                       </button>
// //                       <button type="submit" className="flex-1 py-2 rounded-md bg-green-500 text-white">
// //                         Verify & Log In
// //                       </button>
// //                     </div>

// //                     <div className="text-center">
// //                       <button
// //                         type="button"
// //                         onClick={() => handleSendOTP()}
// //                         className="text-sm text-green-600 hover:underline"
// //                       >
// //                         Resend OTP
// //                       </button>
// //                     </div>
// //                   </form>
// //                 )}
// //               </div>
// //             )}
// //           </div>

// //           {/* small spacer and mobile hero alternative (if you want to show the image on mobile) */}
// //           <div className="mt-6 md:hidden flex items-center gap-3">
// //             <img src="/baitk-logo.png" alt="Baitak" className="h-8 w-auto" />
// //             <div className="text-sm text-gray-600">Welcome Back — Login to manage your services</div>
// //           </div>
// //         </div>
// //       </div>

// //       <VerificationModal
// //         isOpen={showVerificationModal}
// //         onClose={() => setShowVerificationModal(false)}
// //         phone={verificationPhone}
// //         onOTPSent={handleModalOTPSent}
// //         onOTPVerified={handleModalOTPVerified}
// //       />
// //     </div>
// //   );
// // };

// // export default LoginRedesigned;
// /////////////////////////////////////////Worked
// import React, { useState,useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import toast from "react-hot-toast";
// import AuthSlider from "../../components/sharedComp/AuthSlider";
// import { useTranslation } from "react-i18next";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const { t } = useTranslation();
// // const sliderImages = [
// //   'public/Container.png',
// //   'frontend/public/Container.png',
// //   'frontend/public/Container.png',
// // ];
// //   // slider state
// //   const [slideIndex, setSlideIndex] = useState(0);
// //   useEffect(() => {
// //     const id = setInterval(() => {
// //       setSlideIndex((s) => (s + 1) % sliderImages.length);
// //     }, 4000); // 4s
// //     return () => clearInterval(id);
// //   }, []);
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const normalizeIdentifier = (value) => {
//     const trimmed = value.trim();
//     const isPhone = /^[0-9+\- ]+$/.test(trimmed);
//     return isPhone ? { phone: trimmed } : { email: trimmed };
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!identifier.trim()) {
//       return toast.error(t('auth.login.enter_email_or_phone') || t('auth.login.enter_phone'));
//     }
//     if (!password) return toast.error(t('auth.login.enter_phone'));

//     const payload = {
//       ...normalizeIdentifier(identifier),
//       password,
//     };

//     try {
//       setLoading(true);
//       const response = await login(payload);
//       if (response?.success) {
//         toast.success(t('auth.messages.login.loginSuccess'));
//         navigate("/");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* LEFT SIDE */}
//     {/* <AuthSlider/> */}
 

// <AuthSlider
//   images={[
//     "/Container.png",
//     "/Container2.png",
//     "/Container3.png",
//   ]}
//   title={t('auth.login.Welcome-back')}
//   description={t("auth.login.login-disc")}
// />



//       {/* RIGHT SIDE */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-semibold text-gray-900 mb-2">
//            {t('auth.login.title')}
//           </h2>

//           <p className="text-gray-600 mb-8">
//             {t('auth.login.head')}{' '}
//           </p>

//           <form onSubmit={handleLogin} className="space-y-6">
//             {/* EMAIL / PHONE */}
//             <div>
//               <label className="block text-gray-800 font-medium mb-1">
//                 {t('auth.login.email_or_phone_placeholder') || t('auth.login.email')}
//               </label>
//               <input
//                 type="text"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 placeholder={t('auth.login.email_or_phone_placeholder') || t('auth.login.email')}
//                 className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 focus:ring-green-500 focus:border-green-500 outline-none"
//               />
//             </div>

//             {/* PASSWORD */}
//             <div>
//               <label className="block text-gray-800 font-medium mb-1">
//                {t('auth.login.password')}
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder={t('auth.login.password')}
//                 className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 focus:ring-green-500 focus:border-green-500 outline-none"
//               />
//             </div>

//             {/* FORGOT PASSWORD */}
//             <div className="flex justify-end">
//               <Link
//                 to="/forgot-password"
//                 className="text-green-600 font-medium hover:underline"
//               >
//                 {t('auth.login.forgot_password')}
//               </Link>
//             </div>

//             {/* LOGIN BUTTON */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
//             >
//               {t('auth.login.login_button')}
//             </button>
//           </form>

//           {/* SIGN UP */}
//           <p className="text-center text-gray-600 mt-6">
//              {t('auth.login.Dont-have-account')}{" "}
//             <Link to="/signup" className="text-green-600 font-semibold hover:underline">
//                {t('auth.signup.Signup')}
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState,useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { HiEye, HiEyeOff } from "react-icons/hi";

import AuthSlider from "../../components/sharedComp/AuthSlider";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
const [termsError, setTermsError] = useState("");


useEffect(() => {
  if (identifier || password) {
    setServerError("");
  }
}, [identifier, password]);
  // Prevent spaces
  const preventSpaces = (value) => value.replace(/\s+/g, "");

  // Email validation
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Phone validation (Jordan)
  const isValidPhone = (phone) =>
    /^(077|078|079)\d{7}$/.test(phone);

  // Determine whether input is email or phone
  const normalizeIdentifier = (value) => {
    const trimmed = preventSpaces(value);
    return /^\d+$/.test(trimmed) ? { phone: trimmed } : { email: trimmed };
  };

  // ============================
  //        VALIDATION
  // ============================
  // const validateLogin = () => {
  //   let newErrors = {};

  //   const cleanIdentifier = preventSpaces(identifier);

  //   if (!cleanIdentifier) {
  //     newErrors.identifier = t("auth.login.enter_email_or_phone");
  //   } else {
  //     if (/^\d+$/.test(cleanIdentifier)) {
  //       // PHONE
  //       if (!isValidPhone(cleanIdentifier)) {
  //         newErrors.identifier = t("auth.login.email_or_phone_invalid");
  //       }
  //     } else {
  //       // EMAIL
  //       if (!isValidEmail(cleanIdentifier)) {
  //         newErrors.identifier = t("auth.login.email_or_phone_invalid");
  //       }
  //     }
  //   }

  //   // PASSWORD
  //   if (!password.trim()) {
  //     newErrors.password = t("auth.login.password_required", {
  //       defaultValue: "Please enter your password",
  //     });
  //   } else if (password.length < 6) {
  //     newErrors.password = t("auth.login.password_min", {
  //       defaultValue: "Password must be at least 6 characters",
  //     });
  //   }

  //   setErrors(newErrors);

  //   return Object.keys(newErrors).length === 0;
  // };
//   const validateLogin = () => {
//   let newErrors = {};

//   const allowedCharsRegex = /^[a-zA-Z0-9@#$]+$/; // allowed chars
//   const cleanIdentifier = preventSpaces(identifier);

//   // ===================================
//   // IDENTIFIER VALIDATION
//   // ===================================

//   if (!cleanIdentifier) {
//     newErrors.identifier = t("auth.login.enter_email_or_phone");
//   } else {

//     // INVALID SPECIAL CHARACTERS
//     if (!allowedCharsRegex.test(cleanIdentifier)) {
//       newErrors.identifier =
//         i18n.language === "ar"
//           ? "لا يمكن استخدام رموز خاصة باستثناء (@، #، $)"
//           : "Only @, #, and $ special characters are allowed.";
//     }

//     // PHONE
//     else if (/^\d+$/.test(cleanIdentifier)) {
//       if (!isValidPhone(cleanIdentifier)) {
//         newErrors.identifier = t("auth.login.email_or_phone_invalid");
//       }
//     }

//     // EMAIL
//     else {
//       if (!isValidEmail(cleanIdentifier)) {
//         newErrors.identifier = t("auth.login.email_or_phone_invalid");
//       }
//     }
//   }

//   // ===================================
//   // PASSWORD VALIDATION
//   // ===================================

//   if (!password.trim()) {
//     newErrors.password = t("auth.login.password_required", {
//       defaultValue: "Please enter your password",
//     });
//   } else if (password.length < 6) {
//     newErrors.password = t("auth.login.password_min", {
//       defaultValue: "Password must be at least 6 characters",
//     });
//   } else if (!allowedCharsRegex.test(password)) {
//     newErrors.password =
//       i18n.language === "ar"
//         ? "لا يمكن استخدام رموز خاصة باستثناء (@، #، $)"
//         : "Only @, #, and $ special characters are allowed.";
//   }

//   setErrors(newErrors);

//   return Object.keys(newErrors).length === 0;
// };
// const validateLogin = () => {
//   let newErrors = {};

//   const cleanIdentifier = preventSpaces(identifier);

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // standard email regex
//   const phoneRegex = /^[0-9]+$/; // digits only

//   // ===================================
//   // IDENTIFIER VALIDATION
//   // ===================================

//   if (!cleanIdentifier) {
//     newErrors.identifier = t("auth.login.enter_email_or_phone");
//   } else {

//     // If input contains "@", treat as EMAIL
//     if (cleanIdentifier.includes("@")) {
//       if (!emailRegex.test(cleanIdentifier)) {
//         newErrors.identifier = t("auth.login.email_or_phone_invalid");
//       }
//     }

//     // Otherwise treat as phone
//     else {
//       if (!phoneRegex.test(cleanIdentifier)) {
//         newErrors.identifier =
//           i18n.language === "ar"
//             ? "يجب أن يحتوي رقم الهاتف على أرقام فقط"
//             : "Phone number must contain digits only.";
//       } else if (!isValidPhone(cleanIdentifier)) {
//         newErrors.identifier = t("auth.login.email_or_phone_invalid");
//       }
//     }
//   }

//   // ===================================
//   // PASSWORD VALIDATION
//   // ===================================

//   const allowedPasswordChars = /^[a-zA-Z0-9@#$]+$/;

//   if (!password.trim()) {
//     newErrors.password = t("auth.login.password_required");
//   } else if (password.length < 6) {
//     newErrors.password = t("auth.login.password_min");
//   } else if (!allowedPasswordChars.test(password)) {
//     newErrors.password =
//       i18n.language === "ar"
//         ? "لا يمكن استخدام رموز خاصة باستثناء (@، #، $)"
//         : "Only @, #, and $ special characters are allowed.";
//   }

//   setErrors(newErrors);
//   return Object.keys(newErrors).length === 0;
// };
const emailRef = useRef(null);

useEffect(() => {
  emailRef.current?.focus();
}, []);


const validateLogin = () => {
  let newErrors = {};

  const cleanIdentifier = preventSpaces(identifier);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validPhoneRegex = /^(077|078|079)[0-9]{7}$/; // exactly 10 digits, starts 077/078/079

  // ===================================
  // IDENTIFIER (EMAIL OR PHONE)
  // ===================================
  if (!cleanIdentifier) {
    newErrors.identifier = t("auth.login.enter_email_or_phone");
  } else {

    // If contains "@", treat as EMAIL
    if (cleanIdentifier.includes("@")) {
      if (!emailRegex.test(cleanIdentifier)) {
        newErrors.identifier = t("auth.login.invalid_email");
      }
    }

    // Otherwise treat as PHONE
    else {
      if (!/^[0-9]+$/.test(cleanIdentifier)) {
        newErrors.identifier =
          i18n.language === "ar"
            ? "يجب أن يحتوي رقم الهاتف على أرقام فقط"
            : "Phone number must contain digits only.";
      } else if (!validPhoneRegex.test(cleanIdentifier)) {
        newErrors.identifier =
          i18n.language === "ar"
            ? "يجب أن يبدأ رقم الهاتف بـ 077 أو 078 أو 079 وأن يتكون من 10 أرقام"
            : "Phone must start with 077, 078, or 079 and be 10 digits long.";
      }
    }
  }

  // ===================================
  // PASSWORD VALIDATION
  // ===================================
  const allowedPasswordChars = /^[a-zA-Z0-9@#$]+$/;

  if (!password.trim()) {
    newErrors.password = t("auth.login.password_required");
  } 
  else if (password.length < 6) {
    newErrors.password = t("auth.login.password_min");
  } 
  else if (!allowedPasswordChars.test(password)) {
    newErrors.password =
      i18n.language === "ar"
        ? "لا يمكن استخدام رموز خاصة باستثناء (@، #، $)"
        : "Only @, #, and $ special characters are allowed.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // ============================
  //        HANDLE LOGIN
  // ============================
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
     setTermsError("");

  // Check Terms & Conditions
  if (!agreeTerms) {
    setTermsError(t("auth.login.terms_required"));
    return;
  }

    if (!validateLogin()) return;

    const payload = {
      ...normalizeIdentifier(identifier),
      password,
    };

    // try {
    //   setLoading(true);
    //   const res = await login(payload);

    //   if (res?.success) {
    //     navigate("/");
    //   }
    // } 
    // catch (error) {
    //   const message = error?.response?.data?.message || "";

    //   // Backend: wrong credentials
    //   if (message.includes("Incorrect")) {
    //     setErrors({
    //       identifier: i18n.language === "ar"
    //         ? "بيانات الدخول غير صحيحة."
    //         : "Incorrect login details. Please try again.",
    //     });
    //   }

    //   // Backend: disabled account
    //   if (message.includes("disabled")) {
    //     setErrors({
    //       identifier: i18n.language === "ar"
    //         ? "حسابك معطّل. يرجى التواصل مع الدعم."
    //         : "Your account is disabled. Contact support.",
    //     });
    //   }
    // } finally {
    //   setLoading(false);
    // }
  try {
  setLoading(true);
  const response = await login(payload);

  if (response?.success) {
    navigate("/");
  } else {
    // Show server error
    setServerError(
      response?.message ||
        t("auth.login.incorrect_credentials")
    );
  }
} catch (error) {
  setServerError(
    error?.response?.data?.message ||
      t("auth.login.incorrect_credentials")
  );
} finally {
  setLoading(false);
}

  
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <AuthSlider
        images={["/Container.png", "/Container2.png", "/Container3.png"]}
        title={t("auth.login.Welcome-back")}
        description={t("auth.login.login-disc")}
      />

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            {t("auth.login.title")}
          </h2>

          <p className="text-gray-600 mb-8">{t("auth.login.head")}</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* IDENTIFIER */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                {t("auth.login.login_with_phone")}
              </label>
              <input
                type="text"
                ref={emailRef}
                value={identifier}
                onChange={(e) =>
                  setIdentifier(preventSpaces(e.target.value))
                }
                placeholder={t("auth.login.email_or_phone_placeholder")}
                className={`w-full bg-gray-100 border rounded-lg px-4 py-3 outline-none
                  ${errors.identifier ? "border-red-500" : "border-gray-200"}
                `}
              />
              {errors.identifier && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            {/* <div>
              <label className="block text-gray-800 font-medium mb-1">
                {t("auth.login.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(preventSpaces(e.target.value))
                }
                placeholder={t("auth.login.password_placeholder")}
                className={`w-full bg-gray-100 border rounded-lg px-4 py-3 outline-none
                  ${errors.password ? "border-red-500" : "border-gray-200"}
                `}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div> */}
<div className="relative">
  <label className="block text-gray-800 font-medium mb-1">
    {t('auth.login.password')}
  </label>

  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder={t("auth.login.password")}
    className={`w-full bg-gray-100 border ${
      errors.password ? "border-red-500" : "border-gray-200"
    } rounded-lg px-4 py-3 pr-12 focus:ring-green-500 focus:border-green-500 outline-none`}
  />

  {/* Eye Icon */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-[44px] text-gray-500 hover:text-gray-700"
  >
    {!showPassword ? (
      <HiEyeOff size={20} />
    ) : (
      <HiEye size={20} />
    )}
  </button>

  {/* Validation error */}
  {errors.password && (
    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
  )}
</div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-green-600 font-medium hover:underline"
              >
                {t("auth.login.forgot_password")}
              </Link>
            </div>
{serverError && (
  <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4 text-sm">
    {serverError}
  </div>
)}
            {/* LOGIN BUTTON */}
            {/* <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {t("auth.login.login_button")}
            </button> */}
            <button
  type="submit"
  disabled={loading || !agreeTerms}
  className={`w-full text-white py-3 rounded-lg font-semibold transition
    ${agreeTerms ? "bg-[#34a853] hover:bg-green-700" : "bg-green-300 cursor-not-allowed"}
  `}
>
  {t("auth.login.login_button")}
</button>

<div className="flex justify-center mt-4">
  <div className="flex items-center gap-1">
    <input
      type="checkbox"
      checked={agreeTerms}
      onChange={(e) => {
        setAgreeTerms(e.target.checked);
        setTermsError("");
      }}
      // className="w-5 h-5 ms-2 border-2 border-gray-300 rounded cursor-pointer text-green-600 focus:ring-green-500"
       className="
      appearance-none 
      h-5 w-5 
      border-2 border-green-500 
      rounded-md 
      checked:bg-green-500 
      checked:border-green-500 
      transition-all
      cursor-pointer
    "
    />

    <label className="ml-3 text-gray-700 select-none">
      {t("auth.login.i_agree")}{" "}
      <span className="text-green-600 font-semibold cursor-pointer hover:underline">
        {t("auth.login.terms_and_conditions")}
      </span>
    </label>
  </div>
</div>


{/* Error message under checkbox */}
{termsError && (
  <p className="text-red-500 text-sm mt-1">{termsError}</p>
)}

          </form>

          {/* SIGN UP */}
          <p className="text-center text-gray-600 mt-6">
            {t("auth.login.Dont-have-account")}{" "}
            <Link to="/signup" className="text-green-600 font-semibold hover:underline">
              {t("auth.signup.Signup")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
