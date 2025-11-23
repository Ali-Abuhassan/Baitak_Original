// // // // import React, { useState, useEffect } from 'react';
// // // // import { locationAPI } from '../../services/api';
// // // // import { useTranslation } from 'react-i18next';

// // // // const AreaDropdown = ({ value, onChange, citySlug, className = '', required = false }) => {
// // // //   const { t } = useTranslation();
// // // //   const [areas, setAreas] = useState([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState(null);

// // // //   useEffect(() => {
// // // //     const fetchAreas = async () => {
// // // //       if (!citySlug) {
// // // //         setAreas([]);
// // // //         setError(null);
// // // //         // console.log("my name is ali");
// // // //         return;
        
// // // //       }

// // // //       try {
// // // //         setLoading(true);
// // // //         setError(null);
        
// // // //         // Use city slug directly
// // // //         const response = await locationAPI.getAreasByCity(citySlug);
        
// // // //         if (response.data.success) {
// // // //           setAreas(response.data.data.areas);
// // // //         } else {
// // // //           console.error('API returned success: false');
// // // //           setError('Failed to load areas');
// // // //         }
// // // //       } catch (err) {
// // // //         console.error('Error fetching areas:', err);
// // // //         console.error('Error details:', {
// // // //           message: err.message,
// // // //           status: err.response?.status,
// // // //           data: err.response?.data,
// // // //           config: err.config
// // // //         });
// // // //         setError(`Failed to load areas: ${err.message}`);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchAreas();
// // // //   }, [citySlug]);


// // // //   if (!citySlug) {
// // // //     return (
// // // //       <select className={`input ${className}`} disabled>
// // // //         <option>{t('dropdowns.selectCityFirst')}</option>
// // // //       </select>
// // // //     );
// // // //   }

// // // //   if (loading) {
// // // //     return (
// // // //       <select className={`input ${className}`} disabled>
// // // //         <option>{t('dropdowns.loadingAreas')}</option>
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
// // // //           placeholder={t('dropdowns.enterArea')}
// // // //           required={required}
// // // //         />
// // // //         <p className="text-sm text-red-500 mt-1">{t('dropdowns.manualInputAreas')}</p>
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
// // // //       <option value="">{t('dropdowns.selectArea')}</option>
// // // //       {areas.map((area) => (
// // // //         <option key={area.id} value={area.id}>
// // // //           {area.name_en} - {area.name_ar}
// // // //         </option>
// // // //       ))}
// // // //     </select>
// // // //   );
// // // // };

// // // // export default AreaDropdown;
// // // // src/components/sharedInputs/AreaDropdown.jsx
// // // // import React, { useState, useEffect } from 'react';
// // // // import { locationAPI } from '../../services/api'; // keep your path as before
// // // // import { useTranslation } from 'react-i18next';
// // // // import Select from './Select';
// // // // import Input from './Input';

// // // // const AreaDropdown = ({ value, onChange, citySlug, className = '', required = false, variant = 'outline', size = 'md' }) => {
// // // //   const { t } = useTranslation();
// // // //   const [areas, setAreas] = useState([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState(null);

// // // //   useEffect(() => {
// // // //     const fetchAreas = async () => {
// // // //       if (!citySlug) {
// // // //         setAreas([]);
// // // //         setError(null);
// // // //         return;
// // // //       }

// // // //       try {
// // // //         setLoading(true);
// // // //         setError(null);

// // // //         // Use city slug directly
// // // //         const response = await locationAPI.getAreasByCity(citySlug);

// // // //         // adapt to response shape if needed
// // // //         // common shapes: { success: true, data: { areas: [...] } } OR { data: [...] }
// // // //         const respData = response?.data;
// // // //         let fetchedAreas = [];

// // // //         if (respData?.success && respData?.data?.areas) {
// // // //           fetchedAreas = respData.data.areas;
// // // //         } else if (Array.isArray(respData)) {
// // // //           fetchedAreas = respData;
// // // //         } else if (Array.isArray(respData?.data)) {
// // // //           fetchedAreas = respData.data;
// // // //         } else {
// // // //           // fallback: maybe server responded with object containing areas key
// // // //           fetchedAreas = respData?.data?.areas || [];
// // // //         }

// // // //         setAreas(Array.isArray(fetchedAreas) ? fetchedAreas : []);
// // // //       } catch (err) {
// // // //         console.error('Error fetching areas:', err);
// // // //         setError(err?.message || 'Failed to load areas');
// // // //         setAreas([]);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchAreas();
// // // //   }, [citySlug]);

// // // //   // 1) No city selected
// // // //   if (!citySlug) {
// // // //     return (
// // // //       <Select
// // // //         value={value}
// // // //         onChange={onChange}
// // // //         disabled
// // // //         variant={variant}
// // // //         size={size}
// // // //         className={className}
// // // //       >
// // // //         <option value="">{t('dropdowns.selectCityFirst')}</option>
// // // //       </Select>
// // // //     );
// // // //   }

// // // //   // 2) Loading
// // // //   if (loading) {
// // // //     return (
// // // //       <Select
// // // //         value={value}
// // // //         onChange={onChange}
// // // //         disabled
// // // //         loading
// // // //         variant={variant}
// // // //         size={size}
// // // //         className={className}
// // // //       >
// // // //         <option value="">{t('dropdowns.loadingAreas')}</option>
// // // //       </Select>
// // // //     );
// // // //   }

// // // //   // 3) Error -> fallback to manual input (same behavior as original)
// // // //   if (error) {
// // // //     return (
// // // //       <div>
// // // //         <Input
// // // //           type="text"
// // // //           value={value}
// // // //           onChange={onChange}
// // // //           placeholder={t('dropdowns.enterArea')}
// // // //           required={required}
// // // //           variant={variant}
// // // //           size={size}
// // // //           className={className}
// // // //         />
// // // //         <p className="text-sm text-red-500 mt-1">{t('dropdowns.manualInputAreas')}</p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   // 4) Normal select with areas
// // // //   return (
// // // //     <Select
// // // //       value={value}
// // // //       onChange={onChange}
// // // //       variant={variant}
// // // //       size={size}
// // // //       className={className}
// // // //       required={required}
// // // //     >
// // // //       <option value="">{t('dropdowns.selectArea')}</option>
// // // //       {areas.map((area) => {
// // // //         // area shape can vary: either { id, name, name_en, name_ar, slug } or { id, name }
// // // //         const label =
// // // //           (area.name_en && area.name_ar)
// // // //             ? `${area.name_en} - ${area.name_ar}`
// // // //             : area.name || (area.name_en || area.name_ar) || JSON.stringify(area);

// // // //         return (
// // // //           <option key={area.id ?? area.slug ?? label} value={area.id ?? area.slug ?? label}>
// // // //             {label}
// // // //           </option>
// // // //         );
// // // //       })}
// // // //     </Select>
// // // //   );
// // // // };

// // // // export default AreaDropdown;
// // // ////////////////////////////////////
import React, { useState, useEffect } from 'react';
import { locationAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Select from './Select';
import Input from './Input';

const AreaDropdown = ({ value, onChange, citySlug, className = '', required = false, variant = 'filled', size = 'md' }) => {
  const { t } = useTranslation();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!citySlug) {
        setAreas([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        const response = await locationAPI.getAreasByCity(citySlug);
        const respData = response?.data;
        let fetchedAreas = [];

        if (respData?.success && respData?.data?.areas) {
          fetchedAreas = respData.data.areas;
        } else if (Array.isArray(respData)) {
          fetchedAreas = respData;
        } else if (Array.isArray(respData?.data)) {
          fetchedAreas = respData.data;
        } else {
          fetchedAreas = respData?.data?.areas || [];
        }

        setAreas(Array.isArray(fetchedAreas) ? fetchedAreas : []);
      } catch (err) {
        console.error('Error fetching areas:', err);
        setError(err?.message || 'Failed to load areas');
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [citySlug]);

  if (!citySlug) {
    return (
      <Select value={value} onChange={onChange} disabled variant={variant} size={size} className={className}>
        <option value="">{t('dropdowns.selectCityFirst') || 'Select city first'}</option>
      </Select>
    );
  }

  if (loading) {
    return (
      <Select value={value} onChange={onChange} disabled variant={variant} size={size} className={className}>
        <option value="">{t('dropdowns.loadingAreas') || 'Loading areas...'}</option>
      </Select>
    );
  }

  if (error) {
    return (
      <div>
        <Input type="text" value={value} onChange={onChange} placeholder={t('dropdowns.enterArea') || 'Enter area'} required={required} variant={variant} size={size} className={className} />
        <p className="text-sm text-red-500 mt-1">{t('dropdowns.manualInputAreas') || 'Could not load areas, enter manually.'}</p>
      </div>
    );
  }

  return (
    <Select value={value} onChange={onChange} variant={variant} size={size} className={className} required={required}>
      <option value="">{t('dropdowns.selectArea') || 'Select area'}</option>
      {areas.map((area) => {
        const label = area.name_en && area.name_ar ? `${area.name_en} - ${area.name_ar}` : area.name || (area.name_en || area.name_ar) || JSON.stringify(area);
        return (
          <option key={area.id ?? area.slug ?? label} value={area.id ?? area.slug ?? label}>
            {label}
          </option>
        );
      })}
    </Select>
  );
};

export default AreaDropdown;
