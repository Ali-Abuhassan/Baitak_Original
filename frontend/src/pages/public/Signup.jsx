

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import toast from "react-hot-toast";
// import CityDropdown from "../../components/sharedInputs/CityDropdown";
// import AreaDropdown from "../../components/sharedInputs/AreaDropdown";
// import Input from "../../components/sharedInputs/Input";
// import { useTranslation } from "react-i18next";
// import { validateJordanianPhone } from "../../services/phoneValidation";
// import AuthSlider from "../../components/sharedComp/AuthSlider";
// import { HiEye, HiEyeOff } from "react-icons/hi";

// const sliderImages = [
//   "/Container.png",
//   "/Container.png",
//   "/Container.png",
// ];

// const Signup = () => {
//   const navigate = useNavigate();
//   const { signup, isAuthenticated, user, loading, logout } = useAuth();
//   const { t } = useTranslation();

//   const [slideIndex, setSlideIndex] = useState(0);
//   const [selectedCitySlug, setSelectedCitySlug] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [errors, setErrors] = useState({});
//   const preventSpaces = (value) => value.replace(/\s+/g, "");


//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     phone: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "customer",
//     city: "",
//     citySlug: "",
//     area: "",
//   });

//   // slider timing
//   useEffect(() => {
//     const id = setInterval(
//       () => setSlideIndex((i) => (i + 1) % sliderImages.length),
//       4000
//     );
//     return () => clearInterval(id);
//   }, []);

//   // redirect if logged in
//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       if (user?.role === "provider") navigate("/provider/dashboard");
//       else navigate("/");
//     }
//   }, [isAuthenticated, loading, user]);

//   const handleCityChange = (e) => {
//     const option = e.target.selectedOptions?.[0];
//     const slug = option?.getAttribute("data-slug");
//     const id = option?.value;

//     setFormData((p) => ({
//       ...p,
//       city: id,
//       citySlug: slug,
//       area: "",
//     }));

//     setSelectedCitySlug(slug);
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!formData.first_name) return toast.error("First name required");
// //     if (!formData.last_name) return toast.error("Last name required");
// //     // if (!validateJordanianPhone(formData.phone))
// //     //   return toast.error("Enter valid Jordanian phone");
// //     // Only validate phone if user entered it
// // if (formData.phone && !validateJordanianPhone(formData.phone)) {
// //   return toast.error("Enter valid Jordanian phone");
// // }
// //     if (formData.password !== formData.confirmPassword)
// //       return toast.error("Passwords don't match");

// //     const { confirmPassword, citySlug, ...payload } = formData;
// //     if (!payload.email.trim()) delete payload.email;
// //     if (payload.city) {
// //       payload.city_id = Number(payload.city);
// //       delete payload.city;
// //     }
// //     if (payload.area) {
// //       payload.area_id = Number(payload.area);
// //       delete payload.area;
// //     }

// //     if (isAuthenticated) logout();

// //     console.log("FINAL SIGNUP PAYLOAD:", payload);

// //     const result = await signup(payload);
// //     // if (result.success) {
// //     //   navigate("/verify-phone", {
// //     //     state: { phone: payload.phone, expires_at: result.expires_at },
// //     //   });
// //     // }
// //     if (result.success) {
// //   if (formData.role === "provider") navigate("/provider/dashboard");
// //   else navigate("/");
// // }

// //   };
// // In your Signup.jsx handleSubmit function
// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   if (!formData.first_name) return toast.error("First name required");
// //   if (!formData.last_name) return toast.error("Last name required");
  
// //   // Only validate phone if user entered it
// //   if (formData.phone && !validateJordanianPhone(formData.phone)) {
// //     return toast.error("Enter valid Jordanian phone");
// //   }
  
// //   if (formData.password !== formData.confirmPassword)
// //     return toast.error("Passwords don't match");

// //   const { confirmPassword, citySlug, ...payload } = formData;
  
// //   // Clean up empty values
// //   if (!payload.email.trim()) payload.email = null;
// //   if (!payload.phone.trim()) payload.phone = null;
  
// //   if (payload.city) {
// //     payload.city_id = Number(payload.city);
// //     delete payload.city;
// //   }
// //   if (payload.area) {
// //     payload.area_id = Number(payload.area);
// //     delete payload.area;
// //   }

// //   if (isAuthenticated) logout();

// //   console.log("FINAL SIGNUP PAYLOAD:", payload);

// //   const result = await signup(payload);
// //   if (result.success) {
// //     if (formData.role === "provider") navigate("/provider/dashboard");
// //     else navigate("/");
// //   }
// // };
// // In your Signup.jsx handleSubmit function
// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   if (!formData.first_name) return toast.error("First name required");
// //   if (!formData.last_name) return toast.error("Last name required");
  
// //   // Only validate phone if user entered it
// //   if (formData.phone && !validateJordanianPhone(formData.phone)) {
// //     return toast.error("Enter valid Jordanian phone");
// //   }
  
// //   if (formData.password !== formData.confirmPassword)
// //     return toast.error("Passwords don't match");

// //   const { confirmPassword, citySlug, ...payload } = formData;
  
// //   // Clean up empty values - set to empty string instead of null
// //   if (!payload.email.trim()) payload.email = "";
// //   if (!payload.phone.trim()) payload.phone = "";
  
// //   if (payload.city) {
// //     payload.city_id = Number(payload.city);
// //     delete payload.city;
// //   }
// //   if (payload.area) {
// //     payload.area_id = Number(payload.area);
// //     delete payload.area;
// //   }

// //   if (isAuthenticated) logout();

// //   console.log("FINAL SIGNUP PAYLOAD:", payload);

// //   const result = await signup(payload);
// //   if (result.success) {
// //     if (formData.role === "provider") navigate("/provider/dashboard");
// //     else navigate("/");
// //   }
// // };
// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   if (!formData.first_name.trim()) return toast.error("First name required");
// //   if (!formData.last_name.trim()) return toast.error("Last name required");
  
// //   // Only validate phone if user entered it
// //   if (formData.phone && !validateJordanianPhone(formData.phone)) {
// //     return toast.error("Enter valid Jordanian phone");
// //   }
  
// //   if (formData.password !== formData.confirmPassword)
// //     return toast.error("Passwords don't match");

// //   const { confirmPassword, citySlug, ...payload } = formData;
  
// //   // Clean up empty values - set to null instead of empty string
// //   if (!payload.email.trim()) payload.email = null;
// //   if (!payload.phone.trim()) payload.phone = null;
  
// //   if (payload.city) {
// //     payload.city_id = Number(payload.city);
// //     delete payload.city;
// //   }
// //   if (payload.area) {
// //     payload.area_id = Number(payload.area);
// //     delete payload.area;
// //   }

// //   if (isAuthenticated) logout();

// //   console.log("FINAL SIGNUP PAYLOAD:", payload);

// //   const result = await signup(payload);
// //   if (result.success) {
// //     if (formData.role === "provider") navigate("/provider/dashboard");
// //     else navigate("/");
// //   }
// // };
// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   if (!formData.first_name.trim()) return toast.error("First name required");
// //   if (!formData.last_name.trim()) return toast.error("Last name required");
  
// //   // Only validate phone if user entered it
// //   if (formData.phone && !validateJordanianPhone(formData.phone)) {
// //     return toast.error("Enter valid Jordanian phone");
// //   }
  
// //   if (formData.password !== formData.confirmPassword)
// //     return toast.error("Passwords don't match");

// //   const { confirmPassword, citySlug, ...payload } = formData;
  
// //   // Clean up empty values - set to null instead of empty string
// //   if (!payload.email.trim()) payload.email = null;
// //   if (!payload.phone.trim()) payload.phone = null;
  
// //   if (payload.city) {
// //     payload.city_id = Number(payload.city);
// //     delete payload.city;
// //   }
// //   if (payload.area) {
// //     payload.area_id = Number(payload.area);
// //     delete payload.area;
// //   }

// //   if (isAuthenticated) logout();

// //   console.log("FINAL SIGNUP PAYLOAD:", payload);

// //   const result = await signup(payload);
// //   if (result.success) {
// //     if (formData.role === "provider") {
// //       // Check if provider needs to complete profile
// //       if (result.data.requires_profile_completion) {
// //         navigate("/provider/complete-profile");
// //       } else {
// //         navigate("/provider/dashboard");
// //       }
// //     } else {
// //       navigate("/");
// //     }
// //   }
// // };

// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //    if (!formData.first_name.trim())
// //     return toast.error(t('auth.signup.validation.firstNameRequired'));
// //     //  return toast.error("First name required");
  
// //   if (!formData.last_name.trim()) 
// //     return toast.error(t('auth.signup.validation.lastNameRequired'));
// //     // return toast.error("Last name required");

  
// //   if (formData.phone && !validateJordanianPhone(formData.phone)) {
// //     return toast.error(t('auth.errors.jordanianPhone'));
// //     //toast.error("Enter valid Jordanian phone");
// //   }
  
// //   if (formData.password !== formData.confirmPassword)
// //     return toast.error(t('auth.signup.validation.passwordsDoNotMatch'));
// //   // toast.error("Passwords don't match");

// //   const { confirmPassword, citySlug, ...payload } = formData;
  
// //   if (!payload.email.trim()) payload.email = null;
// //   if (!payload.phone.trim()) payload.phone = null;
  
// //   if (payload.city) {
// //     payload.city_id = Number(payload.city);
// //     delete payload.city;
// //   }
// //   if (payload.area) {
// //     payload.area_id = Number(payload.area);
// //     delete payload.area;
// //   }

// //   if (isAuthenticated) logout();

// //   console.log("FINAL SIGNUP PAYLOAD:", payload);

// //   try {
// //     const result = await signup(payload);
    
// //     console.log("SIGNUP RESULT:", result); // Debug the actual response
    
// //     if (result.success) {
// //       // For now, use simple navigation until we confirm the response structure
// //       if (formData.role === "provider") {
// //         // Always redirect to complete-profile for providers initially
// //         navigate("/provider/complete-profile");
// //       } else {
// //         navigate("/");
// //       }
// //     }
// //   } catch (error) {
// //     console.error("Signup error:", error);
// //   }
// // };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const nameRegex = /^[A-Za-z\u0600-\u06FF]+$/; // English + Arabic only
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   /* ===========================
//       1. FIRST NAME VALIDATION
//      =========================== */
//   if (!formData.first_name.trim())
//     return toast.error(t('auth.signup.validation.firstNameRequired'));

//   if (formData.first_name.length < 2)
//     return toast.error(t('auth.signup.validation.firstNameMin'));

//   if (!nameRegex.test(formData.first_name))
//     return toast.error(t('auth.signup.validation.firstNameLettersOnly'));


//   /* ===========================
//       2. LAST NAME VALIDATION
//      =========================== */
//   if (!formData.last_name.trim())
//     return toast.error(t('auth.signup.validation.lastNameRequired'));

//   if (formData.last_name.length < 2)
//     return toast.error(t('auth.signup.validation.lastNameMin'));

//   if (!nameRegex.test(formData.last_name))
//     return toast.error(t('auth.signup.validation.lastNameLettersOnly'));


//   /* ===========================
//       3. EMAIL & PHONE VALIDATION
//      =========================== */
//   const email = formData.email.trim();
//   const phone = formData.phone.trim();

//   if (!email && !phone)
//     return toast.error(t('auth.signup.validation.needEmailOrPhone'));

//   // If email empty → phone required
//   if (!email && phone.length === 0)
//     return toast.error(t('auth.signup.validation.phoneRequiredIfNoEmail'));

//   // If phone empty → email required
//   if (!phone && email.length === 0)
//     return toast.error(t('auth.signup.validation.emailRequiredIfNoPhone'));

//   // Email validation
//   if (email && !emailRegex.test(email))
//     return toast.error(t('auth.signup.validation.emailInvalid'));

//   // Phone validation
//   if (phone) {
//     if (!/^[0-9]{10}$/.test(phone))
//       return toast.error(t('auth.signup.validation.phoneLength'));

//     if (!/^07[7-9]/.test(phone))
//       return toast.error(t('auth.signup.validation.phonePrefix'));

//     if (!validateJordanianPhone(phone))
//       return toast.error(t('auth.signup.validation.phoneInvalid'));
//   }


//   /* ===========================
//       4. PASSWORD VALIDATION
//      =========================== */
//   if (!formData.password)
//     return toast.error(t('auth.signup.validation.passwordRequired'));

//   if (formData.password.length < 6)
//     return toast.error(t('auth.signup.validation.passwordMin'));

//   if (/\s/.test(formData.password))
//     return toast.error(t('auth.signup.validation.passwordNoSpaces'));

//   if (!/\d/.test(formData.password))
//     return toast.error(t('auth.signup.validation.passwordNumber'));

//   if (!/[A-Z]/.test(formData.password))
//     return toast.error(t('auth.signup.validation.passwordUppercase'));


//   /* ===========================
//       5. CONFIRM PASSWORD
//      =========================== */
//   if (!formData.confirmPassword)
//     return toast.error(t('auth.signup.validation.confirmPasswordRequired'));

//   if (formData.password !== formData.confirmPassword)
//     return toast.error(t('auth.signup.validation.passwordsDoNotMatch'));


//   /* ===========================
//       6. CITY & AREA
//      =========================== */
//   if (!formData.city)
//     return toast.error(t('auth.signup.validation.cityRequired'));

//   if (!formData.area)
//     return toast.error(t('auth.signup.validation.areaRequired'));


//   /* ===========================
//       7. PREPARE FINAL PAYLOAD
//      =========================== */
//   const { confirmPassword, citySlug, ...payload } = formData;

//   payload.email = payload.email.trim() || null;
//   payload.phone = payload.phone.trim() || null;

//   if (payload.city) {
//     payload.city_id = Number(payload.city);
//     delete payload.city;
//   }
//   if (payload.area) {
//     payload.area_id = Number(payload.area);
//     delete payload.area;
//   }

//   if (isAuthenticated) logout();

//   console.log("FINAL SIGNUP PAYLOAD:", payload);


//   /* ===========================
//       8. SEND REQUEST
//      =========================== */
//   try {
//     const result = await signup(payload);

//     if (result.success) {
//       if (formData.role === "provider") {
//         navigate("/provider/complete-profile");
//       } else {
//         navigate("/");
//       }
//     }
//   } catch (error) {
//     toast.error(t('auth.signup.validation.unknown'));
//   }
// };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen flex">
//       {/* LEFT PANEL */}
//     <AuthSlider
//   images={[
//     "/Container.png",
//     "/Container2.png",
//     "/Container3.png",
//   ]}
//   title="Welcome to BAITAK"
//   description="Jordan's premier home services marketplace connecting you with verified professionals"
// />

//       {/* RIGHT PANEL */}
//       <div className="flex-1 flex items-center justify-center bg-[#f9fafb] p-8">
//         <div className="w-full max-w-lg">
//           {/* header */}
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold">{t('auth.signup.title')}</h2>
//             <p className="text-gray-600 mt-2">
//               {t('auth.signup.join_stmt')}
//             </p>
//           </div>

//           {/* form */}
//           <form
//             onSubmit={handleSubmit}
//             className="bg-[#f9fafb] shadow-lg rounded-lg p-8 space-y-6"
//           >
//             {/* toggle */}
//             <div className="flex gap-2">
//               {["customer", "provider"].map((role) => (
//                 <button
//                   key={role}
//                   type="button"
//                   onClick={() =>
//                     setFormData((p) => ({ ...p, role: role }))
//                   }
//                   className={`px-6 py-2 rounded-md border text-sm font-medium ${
//                     formData.role === role
//                       ? "bg-green-500 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {role === "customer" ? t('auth.signup.customer') : t('auth.signup.provider')}
//                 </button>
//               ))}
//             </div>

//             {/* names */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="font-medium text-sm mb-1 block">
//                  {t('auth.signup.first_name')}
//                 </label>
//                 <Input
//                   placeholder={t('auth.signup.john')}
//                   value={formData.first_name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, first_name: e.target.value })
//                   }
// //                   onChange={(e) =>
// //   setFormData({ ...formData, first_name: preventSpaces(e.target.value) })
// // }

//                 />
//               </div>

//               <div>
//                 <label className="font-medium text-sm mb-1 block">
//                   {t('auth.signup.last_name')}
//                 </label>
//                 <Input
//                   placeholder={t('auth.signup.doe')}
//                   value={formData.last_name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, last_name: e.target.value })
//                   }
// //                   onChange={(e) =>
// //   setFormData({ ...formData, first_name: preventSpaces(e.target.value) })
// // }

//                 />
//               </div>
//             </div>

//             {/* email */}
//             <div>
//               <label className="font-medium text-sm block mb-1">{t('auth.signup.email')}</label>
//               <Input
//                 type="email"
//                 placeholder={t('auth.signup.email-placeholder')}
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
// //                 onChange={(e) =>
// //   setFormData({ ...formData, first_name: preventSpaces(e.target.value) })
// // }

//               />
//             </div>

//             {/* divider */}
//             <div className="flex items-center my-2">
//               <div className="flex-1 h-px bg-gray-300" />
//               <span className="mx-4 text-gray-400 text-sm">Or</span>
//               <div className="flex-1 h-px bg-gray-300" />
//             </div>

//             {/* phone */}
//             <div>
//               <label className="font-medium text-sm block mb-1">
//                 {t('auth.signup.phone')}
//               </label>
//               <Input
//                 maxLength={10}
//                placeholder={t('auth.signup.phone_placeholder')}
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     phone: e.target.value.replace(/\D/g, "").slice(0, 10),
//                   })
//                 }
// //                 onChange={(e) =>
// //   setFormData({ ...formData, first_name: preventSpaces(e.target.value) })
// // }

//               />
//             </div>

//             {/* password */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="font-medium text-sm block mb-1">
//                   {t('auth.signup.password')}
//                 </label>
//                 <div className="relative">
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     placeholder={t('auth.signup.pass-placeholder')}
//                     value={formData.password}
//                     onChange={(e) =>
//                       setFormData({ ...formData, password: e.target.value })
//                     }
// //                     onChange={(e) =>
// //   setFormData({ ...formData, first_name: preventSpaces(e.target.value) })
// // }

//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((p) => !p)}
//                     className="absolute right-3 top-2 text-gray-500"
//                   >
//                     {/* {showPassword ? (
//                       <HiEyeOff className="h-5 w-5" />
//                     ) : (
//                       <HiEye className="h-5 w-5" />
//                     )} */}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="font-medium text-sm block mb-1">
//                  {t('auth.signup.confirm_password')}
//                 </label>
//                 <div className="relative">
//                   <Input
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder={t('auth.signup.re-password')}
//                     value={formData.confirmPassword}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         confirmPassword: e.target.value,
//                       })
//                     }
// //                     onChange={(e) =>
// //   setFormData({ ...formData, first_name: preventSpaces(e.target.value) })
// // }

//                   />
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowConfirmPassword((p) => !p)
//                     }
//                     className="absolute right-3 top-2 text-gray-500"
//                   >
//                     {/* {showConfirmPassword ? (
//                       <HiEyeOff className="h-5 w-5" />
//                     ) : (
//                       <HiEye className="h-5 w-5" />
//                     )} */}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* city + area */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="font-medium text-sm block mb-1">
//                   {t('common.city')}
//                 </label>
//                 <CityDropdown
//                   value={formData.city}
//                   onChange={handleCityChange}
//                   placeholder={t('auth.signup.select-city')}
//                 />
//               </div>

//               <div>
//                 <label className="font-medium text-sm block mb-1">
//                 {t('common.area')}
//                 </label>
//                 <AreaDropdown
//                   citySlug={formData.citySlug}
//                   value={formData.area}
//                   onChange={(e) =>
//                     setFormData({ ...formData, area: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             {/* submit */}
//             <button
//               type="submit"
//               className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600"
//             >
//               {t('auth.signup.create_account')}
//             </button>

//             <p className="text-center text-sm text-gray-500">
//               {t('auth.signup.have_account')}{' '}
//               <Link className="text-green-600" to="/login">
//                 {t('auth.signup.login_link')}
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CityDropdown from "../../components/sharedInputs/CityDropdown";
import AreaDropdown from "../../components/sharedInputs/AreaDropdown";
import Input from "../../components/sharedInputs/Input";
import { useTranslation } from "react-i18next";
import { validateJordanianPhone } from "../../services/phoneValidation";
import AuthSlider from "../../components/sharedComp/AuthSlider";
import { HiEye, HiEyeOff } from "react-icons/hi";

const sliderImages = ["/Container.png", "/Container.png", "/Container.png"];

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, user, loading, logout } = useAuth();
  const { t } = useTranslation();

  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedCitySlug, setSelectedCitySlug] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // field-level errors
  const [errors, setErrors] = useState({});

  // remove spaces helper (Option B)
  const preventSpaces = (value) => value.replace(/\s+/g, "");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    city: "",
    citySlug: "",
    area: "",
  });

  // slider timing
  useEffect(() => {
    const id = setInterval(
      () => setSlideIndex((i) => (i + 1) % sliderImages.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  // redirect if logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === "provider") navigate("/provider/dashboard");
      else navigate("/");
    }
  }, [isAuthenticated, loading, user]);

  const handleCityChange = (e) => {
    const option = e.target.selectedOptions?.[0];
    const slug = option?.getAttribute("data-slug");
    const id = option?.value;

    setFormData((p) => ({
      ...p,
      city: id,
      citySlug: slug,
      area: "",
    }));

    setSelectedCitySlug(slug);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  // helper to set a single field and clear its error
  const setField = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // client-side validators
  const nameRegex = /^[A-Za-z\u0600-\u06FF]+$/; // english + arabic letters only
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const runClientValidation = () => {
    const newErrors = {};

    // First name
    if (!formData.first_name.trim()) {
      newErrors.first_name = t("auth.signup.validation.firstNameRequired");
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = t("auth.signup.validation.firstNameMin");
    } else if (!nameRegex.test(formData.first_name.trim())) {
      newErrors.first_name = t("auth.signup.validation.firstNameLettersOnly");
    }

    // Last name
    if (!formData.last_name.trim()) {
      newErrors.last_name = t("auth.signup.validation.lastNameRequired");
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = t("auth.signup.validation.lastNameMin");
    } else if (!nameRegex.test(formData.last_name.trim())) {
      newErrors.last_name = t("auth.signup.validation.lastNameLettersOnly");
    }

    // Email & Phone rules (at least one)
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!email && !phone) {
      // missing both
      newErrors.email = t("auth.signup.validation.needEmailOrPhone");
      newErrors.phone = t("auth.signup.validation.needEmailOrPhone");
    } else {
      if (!email) {
        // if email empty and phone empty already handled; if email empty but phone present -> ok
      } else {
        // validate email format
        if (!emailRegex.test(email)) {
          newErrors.email = t("auth.signup.validation.emailInvalid");
        }
      }

      if (!phone) {
        // phone empty but email provided -> ok
      } else {
        // phone must be digits only 10, start with 077/078/079 (your rule), and validateJordanianPhone
        const digitsOnly = phone.replace(/\D/g, "");
        if (!/^[0-9]{10}$/.test(digitsOnly)) {
          newErrors.phone = t("auth.signup.validation.phoneLength");
        } else if (!/^07[7-9]/.test(digitsOnly)) {
          newErrors.phone = t("auth.signup.validation.phonePrefix");
        } else if (!validateJordanianPhone(digitsOnly)) {
          newErrors.phone = t("auth.signup.validation.phoneInvalid");
        }
      }
    }

    // Password
    if (!formData.password) {
      newErrors.password = t("auth.signup.validation.passwordRequired");
    } else {
      if (formData.password.length < 6) {
        newErrors.password = t("auth.signup.validation.passwordMin");
      } else if (/\s/.test(formData.password)) {
        newErrors.password = t("auth.signup.validation.passwordNoSpaces");
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = t("auth.signup.validation.passwordNumber");
      } else if (!/[A-Z]/.test(formData.password)) {
        // optional uppercase requirement - you asked to include it
        newErrors.password = t("auth.signup.validation.passwordUppercase");
      }
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t(
        "auth.signup.validation.confirmPasswordRequired"
      );
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t(
        "auth.signup.validation.passwordsDoNotMatch"
      );
    }

    // City / Area
    if (!formData.city) {
      newErrors.city = t("auth.signup.validation.cityRequired");
    }
    if (!formData.area) {
      newErrors.area = t("auth.signup.validation.areaRequired");
    }

    setErrors(newErrors);
    return newErrors;
  };

  // map backend errors to fields
  const mapBackendErrorsToFields = (backendError, submittedPayload) => {
    // backendError: the full error object from server (e.g. error.response.data)
    // submittedPayload: the payload we sent (email/phone etc.)

    const mapped = {};

    if (!backendError) return mapped;

    // Case: backend returns structured errors object
    // e.g. { errors: { email: "exists", phone: "exists" } }
    if (backendError.errors && typeof backendError.errors === "object") {
      Object.entries(backendError.errors).forEach(([k, v]) => {
        mapped[k] = v;
      });
      return mapped;
    }

    // Case: backend returns { message: 'المستخدم بهذا {field} موجود بالفعل' }
    // or a plain message: we try to replace {field} with label(s) and guess the field
    const message = backendError.message || backendError.error || "";

    if (!message) return mapped;

    // If message contains "{field}" placeholder, replace it with the localized field label(s)
    if (message.includes("{field}")) {
      const emailLabel = t("auth.signup.email");
      const phoneLabel = t("auth.signup.phone");

      // If only email was submitted, map to email
      if (submittedPayload.email && !submittedPayload.phone) {
        mapped.email = message.replace("{field}", emailLabel);
        return mapped;
      }

      // If only phone submitted, map to phone
      if (submittedPayload.phone && !submittedPayload.email) {
        mapped.phone = message.replace("{field}", phoneLabel);
        return mapped;
      }

      // If both were submitted, map to both (backend didn't tell which)
      mapped.email = message.replace("{field}", emailLabel);
      mapped.phone = message.replace("{field}", phoneLabel);
      return mapped;
    }

    // If message contains known keywords, use them to decide
    const msgLower = message.toLowerCase();
    if (msgLower.includes("email") || msgLower.includes("بريد") || msgLower.includes("email")) {
      mapped.email = message;
      return mapped;
    }
    if (msgLower.includes("phone") || msgLower.includes("هاتف") || msgLower.includes("رقم")) {
      mapped.phone = message;
      return mapped;
    }

    // fallback: attach to a general form-level error on top-level key "_form"
    mapped._form = message;
    return mapped;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run client-side validations
    const clientErrors = runClientValidation();
    if (Object.keys(clientErrors).length > 0) {
      // don't submit if there are client validation errors
      return;
    }

    // Prepare payload to send
    const { confirmPassword, citySlug, ...payload } = formData;
    const sendPayload = { ...payload };

    // Normalize email/phone
    sendPayload.email = sendPayload.email?.trim() || null;
    // Keep phone digits only
    sendPayload.phone = sendPayload.phone
      ? sendPayload.phone.replace(/\D/g, "")
      : null;

    if (sendPayload.city) {
      sendPayload.city_id = Number(sendPayload.city);
      delete sendPayload.city;
    }
    if (sendPayload.area) {
      sendPayload.area_id = Number(sendPayload.area);
      delete sendPayload.area;
    }

    if (isAuthenticated) logout();

    try {
      const result = await signup(sendPayload);

      // Expect signup to return an object like:
      // { success: true, ... } OR { success: false, error: <backend data> }.
      // (See recommended AuthContext change below.)

      if (result && result.success) {
        // success flow
        if (formData.role === "provider") {
          navigate("/provider/complete-profile");
        } else {
          navigate("/");
        }
        return;
      }

      // If signup returned a structured error object, map it
      const backendPayloadError = result && (result.error || result.data || result);
      const mapped = mapBackendErrorsToFields(backendPayloadError, sendPayload);

      if (Object.keys(mapped).length > 0) {
        setErrors((prev) => ({ ...prev, ...mapped }));
        return;
      }

      // fallback: generic error if no mapping
      setErrors((prev) => ({
        ...prev,
        _form:
          backendPayloadError?.message ||
          t("auth.signup.validation.unknown") ||
          "Something went wrong",
      }));
    } catch (err) {
      // If signup throws (network error, unexpected), show a generic form error
      const backendData = err?.response?.data || err;
      const mapped = mapBackendErrorsToFields(backendData, {
        email: formData.email,
        phone: formData.phone,
      });

      if (Object.keys(mapped).length > 0) {
        setErrors((prev) => ({ ...prev, ...mapped }));
      } else {
        setErrors((prev) => ({
          ...prev,
          _form:
            backendData?.message ||
            t("auth.signup.validation.unknown") ||
            "Something went wrong",
        }));
      }
    }
  };

  // helper to render field error
  const FieldError = ({ field }) => {
    if (!errors[field]) return null;
    return <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <AuthSlider
        images={["/Container.png", "/Container2.png", "/Container3.png"]}
        title="Welcome to BAITAK"
        description="Jordan's premier home services marketplace connecting you with verified professionals"
      />

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center bg-[#f9fafb] p-8">
        <div className="w-full max-w-lg">
          {/* header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold">{t("auth.signup.title")}</h2>
            <p className="text-gray-600 mt-2">{t("auth.signup.join_stmt")}</p>
            {/* form-level error (general) */}
            {errors._form && (
              <div className="mt-3 text-red-600 bg-red-50 p-2 rounded">
                {errors._form}
              </div>
            )}
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="bg-[#f9fafb] shadow-lg rounded-lg p-8 space-y-6">
            {/* toggle */}
            <div className="flex gap-2">
              {["customer", "provider"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: role }))}
                  className={`px-6 py-2 rounded-md border text-sm font-medium ${
                    formData.role === role ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {role === "customer" ? t("auth.signup.customer") : t("auth.signup.provider")}
                </button>
              ))}
            </div>

            {/* names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-sm mb-1 block">{t("auth.signup.first_name")}</label>
                <Input
                  placeholder={t("auth.signup.john")}
                  value={formData.first_name}
                  onChange={(e) => setField("first_name", preventSpaces(e.target.value))}
                  className={errors.first_name ? "border-red-500" : ""}
                />
                <FieldError field="first_name" />
              </div>

              <div>
                <label className="font-medium text-sm mb-1 block">{t("auth.signup.last_name")}</label>
                <Input
                  placeholder={t("auth.signup.doe")}
                  value={formData.last_name}
                  onChange={(e) => setField("last_name", preventSpaces(e.target.value))}
                  className={errors.last_name ? "border-red-500" : ""}
                />
                <FieldError field="last_name" />
              </div>
            </div>

            {/* email */}
            <div>
              <label className="font-medium text-sm block mb-1">{t("auth.signup.email")}</label>
              <Input
                type="email"
                placeholder={t("auth.signup.email-placeholder")}
                value={formData.email}
                onChange={(e) => setField("email", preventSpaces(e.target.value))}
                className={errors.email ? "border-red-500" : ""}
              />
              <FieldError field="email" />
            </div>

            {/* divider */}
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="mx-4 text-gray-400 text-sm">{t("auth.signup.or") || "Or"}</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* phone */}
            <div>
              <label className="font-medium text-sm block mb-1">{t("auth.signup.phone")}</label>
              <Input
                maxLength={10}
                placeholder={t("auth.signup.phone_placeholder")}
                value={formData.phone}
                onChange={(e) =>
                  // keep digits only, remove spaces
                  setField("phone", preventSpaces(e.target.value.replace(/\D/g, "").slice(0, 10)))
                }
                className={errors.phone ? "border-red-500" : ""}
              />
              <FieldError field="phone" />
            </div>

            {/* password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-sm block mb-1">{t("auth.signup.password")}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.signup.pass-placeholder")}
                    value={formData.password}
                    onChange={(e) => setField("password", preventSpaces(e.target.value))}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-2 text-gray-500">
                    {/* {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />} */}
                  </button>
                </div>
                <FieldError field="password" />
              </div>

              <div>
                <label className="font-medium text-sm block mb-1">{t("auth.signup.confirm_password")}</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("auth.signup.re-password")}
                    value={formData.confirmPassword}
                    onChange={(e) => setField("confirmPassword", preventSpaces(e.target.value))}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="absolute right-3 top-2 text-gray-500">
                    {/* {showConfirmPassword ? <HiEyeOff className="h-2 w-2" /> : <HiEye className="h-5 w-5" />} */}
                  </button>
                </div>
                <FieldError field="confirmPassword" />
              </div>
            </div>

            {/* city + area */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-sm block mb-1">{t("common.city")}</label>
                <CityDropdown
                  value={formData.city}
                  onChange={handleCityChange}
                  placeholder={t("auth.signup.select-city")}
                  className={errors.city ? "border-red-500" : ""}
                />
                <FieldError field="city" />
              </div>

              <div>
                <label className="font-medium text-sm block mb-1">{t("common.area")}</label>
                <AreaDropdown
                  citySlug={formData.citySlug}
                  value={formData.area}
                  onChange={(e) => {
                    setField("area", e.target.value);
                  }}
                  className={errors.area ? "border-red-500" : ""}
                />
                <FieldError field="area" />
              </div>
            </div>

            {/* submit */}
            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600">
              {t("auth.signup.create_account")}
            </button>

            <p className="text-center text-sm text-gray-500">
              {t("auth.signup.have_account")}{" "}
              <Link className="text-green-600" to="/login">
                {t("auth.signup.login_link")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
