// // // // import React, { useState, useEffect } from 'react';
// // // // import { locationAPI } from '../../services/api';
// // // // import { useTranslation } from 'react-i18next';

// // // // const CityDropdown = ({ value, onChange, className = '', required = false }) => {
// // // //   const { t } = useTranslation();
// // // //   const [cities, setCities] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);

// // // //   useEffect(() => {
// // // //     const fetchCities = async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         console.log('Fetching cities from API...');
// // // //         const response = await locationAPI.getCities();
// // // //         console.log('Cities API response:', response);
        
// // // //         if (response.data.success) {
// // // //           setCities(response.data.data.cities);
// // // //           console.log('Cities loaded successfully:', response.data.data.cities);
// // // //         } else {
// // // //           console.error('API returned success: false');
// // // //           setError('Failed to load cities');
// // // //         }
// // // //       } catch (err) {
// // // //         console.error('Error fetching cities:', err);
// // // //         console.error('Error details:', {
// // // //           message: err.message,
// // // //           status: err.response?.status,
// // // //           data: err.response?.data,
// // // //           config: err.config
// // // //         });
// // // //         setError(`Failed to load cities: ${err.message}`);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchCities();
// // // //   }, []);

// // // //   if (loading) {
// // // //     return (
// // // //       <select className={`input ${className}`} disabled>
// // // //         <option>{t('dropdowns.loadingCities')}</option>
// // // //       </select>
// // // //     );
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <div>
// // // //         <input
// // // //           type="text"
// // // //           value={value}
// // // //           onChange={onChange}
// // // //           className={`input ${className}`}
// // // //           placeholder={t('dropdowns.enterCity')}
// // // //           required={required}
// // // //         />
// // // //         <p className="text-sm text-red-500 mt-1">{t('dropdowns.manualInputCities')}</p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <select
// // // //       value={value}
// // // //       onChange={onChange}
// // // //       className={`input ${className}`}
// // // //       required={required}
// // // //     >
// // // //       <option value="">{t('dropdowns.selectCity')}</option>
// // // //       {cities.map((city) => {
// // // //         const citySlug = city.slug || city.id;
// // // //         return (
// // // //           <option key={city.id} value={citySlug} data-slug={citySlug} data-id={city.id}>
// // // //             {city.name_en} - {city.name_ar}
// // // //           </option>
// // // //         );
// // // //       })}
// // // //     </select>
// // // //   );
// // // // };

// // // // export default CityDropdown;
// // // import React, { useState, useEffect } from 'react';
// // // import { locationAPI } from '../../services/api';
// // // import { useTranslation } from 'react-i18next';
// // // import Select from './Select';
// // // import Input from './Input';

// // // const CityDropdown = ({ value, onChange, className = '', required = false, variant = 'filled', size = 'md' }) => {
// // //   const { t } = useTranslation();
// // //   const [cities, setCities] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   useEffect(() => {
// // //     const fetchCities = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const response = await locationAPI.getCities();
// // //         if (response?.data?.success) {
// // //           setCities(response.data.data.cities || []);
// // //         } else if (Array.isArray(response?.data)) {
// // //           setCities(response.data);
// // //         } else {
// // //           setError('Failed to load cities');
// // //         }
// // //       } catch (err) {
// // //         console.error('Error fetching cities:', err);
// // //         setError(err?.message || 'Failed to load cities');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchCities();
// // //   }, []);

// // //   if (loading) {
// // //     return (
// // //       <Select className={className} disabled variant={variant} size={size}>
// // //         <option>{t('dropdowns.loadingCities') || 'Loading cities...'}</option>
// // //       </Select>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div>
// // //         <Input type="text" value={value} onChange={onChange} className={className} placeholder={t('dropdowns.enterCity') || 'Enter city'} required={required} />
// // //         <p className="text-sm text-red-500 mt-1">{t('dropdowns.manualInputCities') || 'Could not load cities, enter manually.'}</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <Select value={value} onChange={onChange} className={className} required={required} variant={variant} size={size}>
// // //       <option value="">{t('dropdowns.selectCity') || 'Select city'}</option>
// // //       {cities.map((city) => {
// // //         const citySlug = city.slug || city.id;
// // //         const label = city.name_en ? `${city.name_en} - ${city.name_ar}` : city.name || city.title;
// // //         return (
// // //           <option key={city.id} value={city.id} data-slug={citySlug} data-id={city.id}>
// // //             {label}
// // //           </option>
// // //         );
// // //       })}
// // //     </Select>
// // //   );
// // // };

// // // export default CityDropdown;
import React, { useState, useEffect } from "react";
import { locationAPI } from "../../services/api";
import { useTranslation } from "react-i18next";

// MUST support forwardRef for React Hook Form
const CityDropdown = React.forwardRef(
   ({ name, value, onChange, onBlur, className = "",placeholder, required = false, ...rest }, ref) => {
    const propsOnChange = rest.onChange;
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
      const fetchCities = async () => {
        const response = await locationAPI.getCities();
        setCities(response?.data?.data?.cities || []);
        setLoading(false);
      };
      fetchCities();
    }, []);

    return (
    <select
        ref={ref}
        name={name}
        value={value}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        className={`block w-full bg-gray-100 rounded-md py-3 px-4 ${className}`}
        onChange={(e) => {
          onChange && onChange(e);      // RHF internal handler
          propsOnChange && propsOnChange(e); // your custom logic
        }}  >
        <option value="">
          {loading ? "Loading..." : "Select city"}
        </option>

        {cities.map((city) => (
          <option key={city.id} value={city.id} data-slug={city.slug}>
            {city.name_en} - {city.name_ar}
          </option>
        ))}
      </select>
    );
  }
);


CityDropdown.displayName = "CityDropdown";
export default CityDropdown;

// import React, { useState, useEffect } from "react";
// import { locationAPI } from "../../services/api";

// const CityDropdown = React.forwardRef(
//   (
//     {
//       name,
//       value,
//       onChange,
//       onBlur,
//       className = "",
//       placeholder = "City",
//       required = false,
//       isArabic = false,
//       ...rest
//     },
//     ref
//   ) => {
//     const propsOnChange = rest.onChange;
//     const [cities, setCities] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//       const fetchCities = async () => {
//         const response = await locationAPI.getCities();
//         setCities(response?.data?.data?.cities || []);
//         setLoading(false);
//       };
//       fetchCities();
//     }, []);

//     return (
//       <div
//         className={`relative w-full ${
//           isArabic ? "text-right" : "text-left"
//         }`}
//       >
//         <select
//           ref={ref}
//           name={name}
//           value={value}
//           onBlur={onBlur}
//           required={required}
//           placeholder={placeholder}
//       className={`
//   w-full bg-white border border-gray-200 rounded-lg 
//   py-3 px-4 appearance-none cursor-pointer h-[48px]
//   focus:outline-none focus:ring-2 focus:ring-primary-300
//   ${className}
// `}
//           onChange={(e) => {
//             onChange && onChange(e);
//             propsOnChange && propsOnChange(e);
//           }}
//         >
//           <option value="">
//             {loading ? "Loading..." : "Select city"}
//           </option>

//           {cities.map((city) => (
//             <option key={city.id} value={city.name_en}>
//               {city.name_en}
//             </option>
//           ))}
//         </select>

//         {/* Chevron icon */}
//         <span
//           className={`
//             absolute top-1/2 transform -translate-y-1/2 
//             pointer-events-none text-gray-500
//             ${isArabic ? "left-3" : "right-3"}
//           `}
//         >
//           ▼
//         </span>
//       </div>
//     );
//   }
// );

// CityDropdown.displayName = "CityDropdown";
// export default CityDropdown;
