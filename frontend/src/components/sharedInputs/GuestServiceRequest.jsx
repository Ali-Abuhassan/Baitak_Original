// // // // src/components/GuestServiceRequest.jsx
// // // import React, { useState } from 'react';
// // // import { serviceReqAPI } from '../../services/api';
// // // import CityDropdown from './CityDropdown';
// // // import { useTranslation } from "react-i18next";

// // // export default function GuestServiceRequest() {
// // //   const { t, i18n } = useTranslation();
// // //   const [name, setName] = useState('');
// // //   const [phone, setPhone] = useState('');
// // //   const [email, setEmail] = useState('');
// // //   const [cityId, setCityId] = useState('');
// // //   const [categoryId, setCategoryId] = useState('');
// // //   const [serviceDate, setServiceDate] = useState('');
// // //   const [serviceTime, setServiceTime] = useState('');
// // //   const [description, setDescription] = useState('');
// // //   const [images, setImages] = useState([]); // File objects
// // //   const [preview, setPreview] = useState([]); // preview URLs
// // //   const [loading, setLoading] = useState(false);
// // //   const [message, setMessage] = useState('');

// // //   // sample placeholder image from the conversation (local path)
// // //   const placeholder = '/mnt/data/110d0b8c-847a-446d-8fb6-ada532ad278f.png';

// // //   const handleImages = (e) => {
// // //     const files = Array.from(e.target.files).slice(0, 5);
// // //     setImages(files);
// // //     const urls = files.map(f => URL.createObjectURL(f));
// // //     setPreview(urls);
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setMessage('');

// // //     try {
// // //       const formData = new FormData();
// // //       formData.append('name', name);
// // //       formData.append('phone', phone);
// // //       if (email) formData.append('email', email);
// // //       if (cityId) formData.append('city_id', cityId);
// // //       if (categoryId) formData.append('category_id', categoryId);
// // //       if (serviceDate) formData.append('service_date', serviceDate);
// // //       if (serviceTime) formData.append('service_time', serviceTime);
// // //       if (description) formData.append('description', description);

// // //       images.forEach((file) => {
// // //         formData.append('images', file);
// // //       });

// // //       const res = await serviceReqAPI.create(formData);
// // //       if (res.data && res.data.success) {
// // //         setMessage('Request submitted successfully.');
// // //         // reset form
// // //         setName('');
// // //         setPhone('');
// // //         setEmail('');
// // //         setCityId('');
// // //         setCategoryId('');
// // //         setServiceDate('');
// // //         setServiceTime('');
// // //         setDescription('');
// // //         setImages([]);
// // //         setPreview([]);
// // //       } else {
// // //         setMessage('Unexpected response from server.');
// // //       }
// // //     } catch (err) {
// // //       console.error(err);
// // //       setMessage(err?.response?.data?.message || 'Failed to submit request.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
// // //       <h2 className="text-lg font-semibold mb-4">Submit a Service Request</h2>
// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <div>
// // //           <label className="block text-sm font-medium">Name *</label>
// // //           <input value={name} onChange={(e)=>setName(e.target.value)}
// // //             required className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"/>
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-medium">Phone *</label>
// // //           <input value={phone} onChange={(e)=>setPhone(e.target.value)}
// // //             required className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"/>
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-medium">Email</label>
// // //           <input value={email} onChange={(e)=>setEmail(e.target.value)}
// // //             type="email" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"/>
// // //         </div>

// // //         <div className="grid grid-cols-2 gap-3">
// // //           <div>
// // //             <label className="block text-sm font-medium">City</label>
// // //             <input value={cityId} onChange={(e)=>setCityId(e.target.value)}
// // //               placeholder="city id" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"/>
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium">Category</label>
// // //             <input value={categoryId} onChange={(e)=>setCategoryId(e.target.value)}
// // //               placeholder="category id" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"/>
// // //           </div>
// // //         </div>

// // //         <div className="grid grid-cols-2 gap-3">
// // //           <div>
// // //             <label className="block text-sm font-medium">Date</label>
// // //             <input value={serviceDate} onChange={(e)=>setServiceDate(e.target.value)} type="date"
// // //               className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"/>
// // //           </div>
// // //           <div>
// // //             <label className="block text-sm font-medium">Time</label>
// // //             <input value={serviceTime} onChange={(e)=>setServiceTime(e.target.value)} type="time"
// // //               className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"/>
// // //           </div>
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-medium">Description</label>
// // //           <textarea value={description} onChange={(e)=>setDescription(e.target.value)}
// // //             rows="4" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
// // //             placeholder="Describe what you need help with..."/>
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-medium">Attach Images (optional)</label>
// // //           <input onChange={handleImages} type="file" accept="image/*" multiple className="mt-1"/>
// // //           <div className="mt-2 flex gap-2">
// // //             {preview.length ? preview.map((p, i) => (
// // //               <img key={i} src={p} alt="preview" className="w-20 h-20 object-cover rounded"/>
// // //             )) : (
// // //               <img src={placeholder} alt="placeholder" className="w-20 h-20 object-cover rounded opacity-60"/>
// // //             )}
// // //           </div>
// // //         </div>

// // //         <div className="flex justify-end gap-3">
// // //           <button type="button" onClick={() => {
// // //             // reset
// // //             setName(''); setPhone(''); setEmail(''); setCityId(''); setCategoryId('');
// // //             setServiceDate(''); setServiceTime(''); setDescription(''); setImages([]); setPreview([]);
// // //             setMessage('');
// // //           }} className="px-4 py-2 border rounded">Cancel</button>
// // //           <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-500 text-white rounded">
// // //             {loading ? 'Submitting...' : 'Submit Request'}
// // //           </button>
// // //         </div>

// // //         {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
// // //       </form>
// // //     </div>
// // //   );
// // // }
// // // src/components/GuestServiceRequest.jsx
// // import React, { useEffect, useState } from 'react';
// // import { serviceReqAPI, categoryAPI } from '../../services/api';
// // import { useTranslation } from 'react-i18next';
// // import dayjs from 'dayjs';

// // export default function GuestServiceRequest() {
// //   const { t } = useTranslation();
// //   const [categories, setCategories] = useState([]);

// //   const [serviceType, setServiceType] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [budget, setBudget] = useState('');
// //   const [serviceDate, setServiceDate] = useState('');
// //   const [serviceTime, setServiceTime] = useState('');
// //   const [address, setAddress] = useState('');
// //   const [phone, setPhone] = useState('');
// //   const [images, setImages] = useState([]); // File objects
// //   const [preview, setPreview] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState('');
// //   const [successData, setSuccessData] = useState(null);

// //   // placeholder image (uploaded by you)
// //   const placeholder = '/mnt/data/c4608feb-5172-4921-8ac5-aab73f5019b2.png';

// //   useEffect(() => {
// //     // load categories (service types)
// //     const load = async () => {
// //       try {
// //         const res = await categoryAPI.getAll();
// //         if (res?.data) {
// //            setCategories(res.data.data.categories); 
// //         }
// //       } catch (err) {
// //         console.error('Failed to load categories', err);
// //       }
// //     };
// //     load();
// //   }, []);

// //   const handleImages = (e) => {
// //     const files = Array.from(e.target.files).slice(0, 5);
// //     setImages(files);
// //     const urls = files.map((f) => URL.createObjectURL(f));
// //     setPreview(urls);
// //   };

// //   const setQuickDate = (option) => {
// //     if (option === 'today') {
// //       setServiceDate(dayjs().format('YYYY-MM-DD'));
// //     } else if (option === 'tomorrow') {
// //       setServiceDate(dayjs().add(1, 'day').format('YYYY-MM-DD'));
// //     } else if (option === 'dayafter') {
// //       setServiceDate(dayjs().add(2, 'day').format('YYYY-MM-DD'));
// //     } else {
// //       setServiceDate(''); // user picks manually
// //     }
// //   };

// //   const validate = () => {
// //     if (!serviceType) return 'Please select service type.';
// //     if (!description || description.trim().length < 5) return 'Please enter a short description.';
// //     if (!serviceDate) return 'Please pick a date.';
// //     if (!serviceTime) return 'Please pick a time.';
// //     if (!address) return 'Please enter a location/address.';
// //     if (!phone) return 'Please enter a phone number.';
// //     return null;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage('');
// //     setSuccessData(null);

// //     const err = validate();
// //     if (err) {
// //       setMessage(err);
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       // Build FormData
// //       const formData = new FormData();
// //       // map frontend field names to backend model fields
// //       formData.append('name', 'Guest'); // no name field in screenshot; if you want a name input, add it. For now use "Guest"
// //       // we could prompt for name - but screenshot doesn't show explicit Name field. adapt if needed.
// //       formData.append('phone', phone);
// //       if (address) formData.append('city_id', ''); // city_id optional if you want; we use manual address, so leave city_id blank
// //       formData.append('email', ''); // optional
// //       formData.append('category_id', serviceType);
// //       formData.append('description', description);
// //       if (budget) formData.append('budget', budget);
// //       if (serviceDate) formData.append('service_date', serviceDate);
// //       if (serviceTime) formData.append('service_time', serviceTime);

// //       images.forEach((file) => {
// //         // backend expects 'images' field
// //         formData.append('images', file);
// //       });

// //       const res = await serviceReqAPI.create(formData);
// //       if (res?.data?.success) {
// //         setSuccessData(res.data.data || null);
// //         setMessage('تم إرسال الطلب بنجاح. سيقوم أحد المزودين بالاتصال بك عبر رقم الهاتف المسجل.'); // Arabic success msg
// //         // reset form but keep last preview hidden
// //         setServiceType('');
// //         setDescription('');
// //         setBudget('');
// //         setServiceDate('');
// //         setServiceTime('');
// //         setAddress('');
// //         setPhone('');
// //         setImages([]);
// //         setPreview([]);
// //       } else {
// //         setMessage(res?.data?.message || 'Unexpected server response');
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setMessage(err?.response?.data?.message || 'فشل في إرسال الطلب');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
// //       <h2 className="text-2xl font-semibold mb-3">Submit a Service Request</h2>
// //       <p className="text-sm text-gray-500 mb-6">Fill out the form below to submit your service request.</p>

// //       <form onSubmit={handleSubmit} className="space-y-5">
// //         {/* Service Type */}
// //         <div>
// //           <label className="text-sm font-medium block mb-2">Service Type <span className="text-red-500">*</span></label>
// //           <select
// //             className="w-full p-3 rounded-md border border-gray-200"
// //             value={serviceType}
// //             onChange={(e) => setServiceType(e.target.value)}
// //             required
// //           >
// //             {console.log("categories: ",categories)}
// //             <option value="">Select service type</option>
// //             {categories && categories.map((c) => (
// //               <option key={c.id} value={c.id}>
// //                 {c.name_en || c.name || c.slug}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* Description */}
// //         <div>
// //           <label className="text-sm font-medium block mb-2">Description/Notes <span className="text-red-500">*</span></label>
// //           <div className="relative">
// //             <textarea
// //               rows={4}
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               placeholder="Describe what you need help with..."
// //               className="w-full p-4 rounded-md border border-gray-200 resize-none"
// //               required
// //             />
// //             {/* Microphone-like green circle on the right */}
// //             <div className="absolute right-3 bottom-3 bg-emerald-500 w-9 h-9 rounded-full flex items-center justify-center">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v11m0 0c-1.657 0-3-1.343-3-3V6c0-1.657 1.343-3 3-3s3 1.343 3 3v3c0 1.657-1.343 3-3 3zM19 11v2a7 7 0 01-14 0v-2" />
// //               </svg>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Budget */}
// //         <div>
// //           <label className="text-sm font-medium block mb-2">Your Budget (Optional)</label>
// //           <div className="flex items-center gap-3">
// //             <div className="flex-1">
// //               <input
// //                 type="number"
// //                 min="0"
// //                 value={budget}
// //                 onChange={(e) => setBudget(e.target.value)}
// //                 placeholder="JOD e.g., 50"
// //                 className="w-full p-3 rounded-md border border-gray-200"
// //               />
// //               <p className="text-xs text-gray-400 mt-1">Set the maximum amount you're willing to pay for this service</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Date buttons */}
// //         <div>
// //           <label className="text-sm font-medium block mb-2">Date <span className="text-red-500">*</span></label>
// //           <div className="flex gap-3 items-center flex-wrap">
// //             <button type="button" onClick={() => setQuickDate('today')} className="px-3 py-2 border rounded">Today</button>
// //             <button type="button" onClick={() => setQuickDate('tomorrow')} className="px-3 py-2 border rounded">Tomorrow</button>
// //             <button type="button" onClick={() => setQuickDate('dayafter')} className="px-3 py-2 border rounded">Day After</button>
// //             <div>
// //               <input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} className="p-2 rounded border border-gray-200"/>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Time */}
// //         <div>
// //           <label className="text-sm font-medium block mb-2">Time <span className="text-red-500">*</span></label>
// //           <input type="time" value={serviceTime} onChange={(e) => setServiceTime(e.target.value)} className="w-full p-3 rounded-md border border-gray-200" required />
// //         </div>

// //         {/* Location/Address */}
// //         <div>
// //           <label className="text-sm font-medium block mb-2">Location/Address <span className="text-red-500">*</span></label>
// //           <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address or location" className="w-full p-3 rounded-md border border-gray-200" required />
// //         </div>

// //         {/* Contact Info */}
// //         <div>
// //           <label className="text-sm font-medium block mb-2">Contact Info (Optional)</label>
// //           <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number (e.g., +962 7X XXX XXXX)" className="w-full p-3 rounded-md border border-gray-200" required />
// //         </div>

// //         {/* Attach Image */}
// //         <div>
// //           <label className="text-sm font-medium block mb-2">Attach Image (Optional)</label>
// //           <div className="flex items-center gap-3">
// //             <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 border rounded">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
// //               </svg>
// //               <span>Upload Image</span>
// //               <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
// //             </label>

// //             <div className="flex gap-2">
// //               {preview.length ? preview.map((p, i) => (
// //                 <img key={i} src={p} alt="preview" className="w-20 h-20 object-cover rounded"/>
// //               )) : (
// //                 <img src={placeholder} alt="placeholder" className="w-20 h-20 object-cover rounded opacity-60"/>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Buttons */}
// //         <div className="flex justify-between items-center mt-3">
// //           <button type="button" onClick={() => {
// //             // reset
// //             setServiceType('');
// //             setDescription('');
// //             setBudget('');
// //             setServiceDate('');
// //             setServiceTime('');
// //             setAddress('');
// //             setPhone('');
// //             setImages([]);
// //             setPreview([]);
// //             setMessage('');
// //             setSuccessData(null);
// //           }} className="px-4 py-2 border rounded">Cancel</button>

// //           <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-500 text-white rounded">
// //             {loading ? 'Submitting...' : 'Submit Request'}
// //           </button>
// //         </div>

// //         {/* Message */}
// //         {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}

// //         {/* Success block: show created request id & basic info */}
// //         {successData && (
// //           <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded">
// //             <p className="text-sm">Request submitted successfully. Request ID: <strong>{successData.id}</strong></p>
// //             <p className="text-sm text-gray-600">A provider will contact the phone number you provided.</p>
// //           </div>
// //         )}
// //       </form>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import { serviceReqAPI, categoryAPI } from "../../services/api";
// import dayjs from "dayjs";

// export default function GuestServiceRequest() {
//   const [categories, setCategories] = useState([]);

//   const [serviceType, setServiceType] = useState("");
//   const [description, setDescription] = useState("");
//   const [budget, setBudget] = useState("");
//   const [serviceDate, setServiceDate] = useState("");
//   const [serviceTime, setServiceTime] = useState("");
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");

//   const [images, setImages] = useState([]);
//   const [preview, setPreview] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const placeholder = "/mnt/data/afa84635-a399-429a-94f0-41c76647d27d.png";

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await categoryAPI.getAll();
//         if (res?.data) setCategories(res.data.data.categories);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     load();
//   }, []);

//   const handleImages = (e) => {
//     const files = Array.from(e.target.files).slice(0, 5);
//     setImages(files);
//     setPreview(files.map((f) => URL.createObjectURL(f)));
//   };

//   const setQuickDate = (type) => {
//     if (type === "today") setServiceDate(dayjs().format("YYYY-MM-DD"));
//     if (type === "tomorrow")
//       setServiceDate(dayjs().add(1, "day").format("YYYY-MM-DD"));
//     if (type === "after")
//       setServiceDate(dayjs().add(2, "day").format("YYYY-MM-DD"));
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
//       {/* HEADER */}
//       <h1 className="text-[22px] font-semibold text-gray-900 mb-1">
//         Submit a Service Request
//       </h1>
//       <p className="text-sm text-gray-500 mb-6">
//         Fill out the form below to submit your service request.
//       </p>

//       <form className="space-y-6">
//         {/* SERVICE TYPE */}
//         <div>
//           <label className="text-sm font-medium text-gray-800 block mb-1.5">
//             Service Type <span className="text-red-500">*</span>
//           </label>

//           <select
//             value={serviceType}
//             onChange={(e) => setServiceType(e.target.value)}
//             className="w-full p-3 rounded-lg border border-gray-200 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
//           >
//             <option value="">Select service type</option>
//             {categories?.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name_en || c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* DESCRIPTION */}
//         <div>
//           <label className="text-sm font-medium text-gray-800 block mb-1.5">
//             Description/Notes <span className="text-red-500">*</span>
//           </label>

//           <div className="relative">
//             <textarea
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Describe what you need help with..."
//               className="w-full p-4 rounded-lg border border-gray-200 text-gray-700 resize-none focus:border-emerald-400 focus:ring-emerald-400 outline-none"
//             />
//             {/* Green mic circle */}
//             <div className="absolute right-3 bottom-3 bg-emerald-500 w-9 h-9 rounded-full flex items-center justify-center shadow-sm">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 1v11m0 0c-1.657 0-3-1.343-3-3V6c0-1.657 1.343-3 3-3s3 1.343 3 3v3c0 1.657-1.343 3-3 3zM19 11v2a7 7 0 01-14 0v-2"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* BUDGET */}
//         <div>
//           <label className="text-sm font-medium text-gray-800 block mb-1.5">
//             Your Budget (Optional)
//           </label>

//           <input
//             type="number"
//             min="0"
//             value={budget}
//             onChange={(e) => setBudget(e.target.value)}
//             placeholder="JOD  e.g., 50"
//             className="w-full p-3 rounded-lg border border-gray-200 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
//           />

//           <p className="text-xs text-gray-400 mt-1">
//             Set the maximum amount you're willing to pay for this service
//           </p>
//         </div>

//         {/* DATE */}
//         {/* <div>
//           <label className="text-sm font-medium text-gray-800 block mb-1.5">
//             Date <span className="text-red-500">*</span>
//           </label>

//           <div className="flex gap-3 flex-wrap">
//             <button
//               type="button"
//               onClick={() => setQuickDate("today")}
//               className="px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50"
//             >
//               Today
//             </button>

//             <button
//               type="button"
//               onClick={() => setQuickDate("tomorrow")}
//               className="px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50"
//             >
//               Tomorrow
//             </button>

//             <button
//               type="button"
//               onClick={() => setQuickDate("after")}
//               className="px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50"
//             >
//               Day After
//             </button>

//             <input
//               type="date"
//               value={serviceDate}
//               onChange={(e) => setServiceDate(e.target.value)}
//               className="p-2 border rounded-lg border-gray-200 text-sm"
//             />
//           </div>
//         </div> */}
//         <div>
//   <label className="text-sm font-medium text-gray-800 block mb-1.5">
//     Date <span className="text-red-500">*</span>
//   </label>

//   <div className="flex gap-3 flex-wrap items-center">
//     {/* Today */}
//     <button
//       type="button"
//       onClick={() => setQuickDate("today")}
//       className="px-5 py-2 border border-gray-300 rounded-xl text-sm bg-white hover:bg-gray-50"
//     >
//       Today
//     </button>

//     {/* Tomorrow */}
//     <button
//       type="button"
//       onClick={() => setQuickDate("tomorrow")}
//       className="px-5 py-2 border border-gray-300 rounded-xl text-sm bg-white hover:bg-gray-50"
//     >
//       Tomorrow
//     </button>

//     {/* Day After */}
//     <button
//       type="button"
//       onClick={() => setQuickDate("dayafter")}
//       className="px-5 py-2 border border-gray-300 rounded-xl text-sm bg-white hover:bg-gray-50"
//     >
//       Day After
//     </button>

//     {/* Other Date button */}
//     <label className="px-5 py-2 border border-gray-300 rounded-xl text-sm bg-white hover:bg-gray-50 cursor-pointer">
//       Other Date
//       <input
//         type="date"
//         value={serviceDate}
//         onChange={(e) => setServiceDate(e.target.value)}
//         className="hidden"
//       />
//     </label>
//   </div>
// </div>


//         {/* TIME */}
//         <div>
//           <label className="text-sm font-medium text-gray-800 block mb-1.5">
//             Time <span className="text-red-500">*</span>
//           </label>

//           <input
//             type="text"
//             value={serviceTime}
//             onChange={(e) => setServiceTime(e.target.value)}
//             className="w-full p-3 rounded-lg border border-gray-200 focus:border-emerald-400"
//           />
//         </div>

//         {/* ADDRESS */}
//         <div>
//           <label className="text-sm font-medium text-gray-800 block mb-1.5">
//             Location/Address <span className="text-red-500">*</span>
//           </label>

//           <input
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             placeholder="Enter your address or location"
//             className="w-full p-3 rounded-lg border border-gray-200"
//           />
//         </div>

//         {/* PHONE */}
//         <div>
//           <label className="text-sm font-medium text-gray-800 block mb-1.5">
//             Contact Info (Optional)
//           </label>

//           <input
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             placeholder="Phone number (e.g., +962 7X XXX XXXX)"
//             className="w-full p-3 rounded-lg border border-gray-200"
//           />
//         </div>

//         {/* IMAGE UPLOAD */}
//         <div>
//           <label className="text-sm font-medium text-gray-800 block mb-1.5">
//             Attach Image (Optional)
//           </label>

//           <div className="flex items-center gap-4">
//             <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M7 16l-4-4m0 0l4-4m-4 4h18"
//                 />
//               </svg>
//               Upload Image
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImages}
//                 className="hidden"
//               />
//             </label>

//             <div className="flex gap-2">
//               {preview.length
//                 ? preview.map((p, i) => (
//                     <img
//                       key={i}
//                       src={p}
//                       className="w-20 h-20 rounded-lg object-cover border border-gray-200"
//                     />
//                   ))
//                 : (
//                   <img
//                     src={placeholder}
//                     className="w-20 h-20 rounded-lg object-cover border border-gray-200 opacity-60"
//                   />
//                 )}
//             </div>
//           </div>
//         </div>

//         {/* BUTTONS */}
//         <div className="flex justify-between items-center pt-4">
//           <button
//             type="button"
//             className="px-5 py-2.5 border rounded-lg text-sm hover:bg-gray-50"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg text-sm shadow hover:bg-emerald-600"
//           >
//             Submit Request
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
// src/components/GuestServiceReq.jsx
import React, { useEffect, useState ,useRef } from "react";
import {serviceReqAPI} from "../../services/api";
import {categoryAPI} from "../../services/api"; // adapt to your import
import dayjs from "dayjs";
import { HiOutlineUpload,HiMicrophone  } from "react-icons/hi";
import { useTranslation } from "react-i18next";


export default function GuestServiceRequest() {
    const { t, i18n } = useTranslation();

  const [categories, setCategories] = useState([]);
const [errors, setErrors] = useState({});

  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [dateType, setDateType] = useState("today");
  const [serviceTime, setServiceTime] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const otherDateRef = useRef(null);
 const isArabic = i18n.language === "ar";
  const placeholder = "/mnt/data/afa84635-a399-429a-94f0-41c76647d27d.png";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await categoryAPI.getAll();
        if (res?.data) setCategories(res.data.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const setQuickDate = (type) => {
    setDateType(type);
    setServiceDate("");
    if (type === "today") setServiceDate(dayjs().format("YYYY-MM-DD"));
    if (type === "tomorrow") setServiceDate(dayjs().add(1, "day").format("YYYY-MM-DD"));
    if (type === "day_after") setServiceDate(dayjs().add(2, "day").format("YYYY-MM-DD"));
  };

  // ❌ Reject special characters (only allow letters, numbers, spaces)
const noSpecialChars = (value) => {
  return /^[A-Za-z0-9\u0600-\u06FF ]+$/.test(value);
};

// ✔ Jordanian phone: 077/078/079 + 7 more digits = 10 digits
const isValidJordanPhone = (value) => {
  return /^(077|078|079)\d{7}$/.test(value);
};

// ✔ Email: only letters, numbers, @ and . 
// Cannot start with special char, and must contain one @
const isValidEmail = (value) => {
  return /^[A-Za-z0-9][A-Za-z0-9._]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);
};


  const onSubmit = async (e) => {
    // e.preventDefault();
    // setMessage("");
    // if (!serviceType) { setMessage("Please choose a service type."); return; }
    // if (!description) { setMessage("Please add a description."); return; }
    // if (!name) { setMessage("Please enter your name."); return; }
    // if (!phone) { setMessage("Please add phone number."); return; }
 e.preventDefault();
  setMessage("");
  let newErrors = {};

  // NAME
  if (!name) newErrors.name = t("home.serviceReq.errors.required");
  else if (!noSpecialChars(name)) newErrors.name = t("home.serviceReq.errors.noSpecial");

  // SERVICE TYPE
  if (!serviceType) newErrors.serviceType = t("home.serviceReq.errors.required");

  // DESCRIPTION
  if (!description) newErrors.description = t("home.serviceReq.errors.required");
  else if (!noSpecialChars(description)) newErrors.description = t("home.serviceReq.errors.noSpecial");

  // BUDGET (optional but must be numbers)
  if (budget && !/^[0-9]+$/.test(budget))
    newErrors.budget = t("home.serviceReq.errors.numberOnly");

  // ADDRESS (optional)
  if (address && !noSpecialChars(address))
    newErrors.address = t("home.serviceReq.errors.noSpecial");

  // PHONE OR EMAIL (contact)
  if (!phone) {
    newErrors.phone = t("home.serviceReq.errors.required");
  } else {
    const trimmed = phone.trim();

    if (/^[0-9]+$/.test(trimmed)) {
      // phone mode
      if (!isValidJordanPhone(trimmed)) {
        newErrors.phone = t("home.serviceReq.errors.phoneInvalid");
      }
    } else {
      // email mode
      if (!isValidEmail(trimmed)) {
        newErrors.phone = t("home.serviceReq.errors.emailInvalid");
      }
    }
  }

  // If has errors: stop
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
    setErrors({});
    try {
      setLoading(true);
      const body = new FormData();
      body.append("name", name);
      body.append("phone", phone);
      if (serviceType) body.append("category_id", serviceType);
      if (description) body.append("description", description);
      if (budget) body.append("budget", budget);
      body.append("service_date_type", dateType);
      if (dateType === "other" && serviceDate) body.append("service_date_value", serviceDate);
      if (serviceTime) body.append("service_time", serviceTime);
      if (address) body.append("address", address);

    //  DEBUG: Check what's in images
      console.log('Images to upload:', images);
      images.forEach((img, index) => {
        console.log(`Image ${index}:`, img);
        body.append("files", img);
      });
      images.forEach((img) => body.append("files", img));

      console.log("comp output: ",body)
      const res = await serviceReqAPI.create(body);
      if (res?.data?.success) {
        setMessage(t("home.serviceReq.messages.success"));
        // reset form
        setServiceType("");
        setDescription("");
        setBudget("");
        setDateType("today");
        setServiceDate("");
        setServiceTime("");
        setAddress("");
        setPhone("");
        setName("");
        setImages([]);
        setPreview([]);
      } else {
        setMessage(res?.data?.message || "Unexpected response.");
      }
    } catch (err) {
      console.error(err);
      setMessage(t("home.serviceReq.messages.failed"));
    } finally {
      setLoading(false);
    }
  };
// const onSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     if (!serviceType) { setMessage("Please choose a service type."); return; }
//     if (!description) { setMessage("Please add a description."); return; }
//     if (!name) { setMessage("Please enter your name."); return; }
//     if (!phone) { setMessage("Please add phone number."); return; }

//     try {
//       setLoading(true);
//       const body = new FormData();
//       body.append("name", name);
//       body.append("phone", phone);
//       if (serviceType) body.append("category_id", serviceType);
//       if (description) body.append("description", description);
//       if (budget) body.append("budget", budget);
//       body.append("service_date_type", dateType);
//       if (dateType === "other" && serviceDate) body.append("service_date_value", serviceDate);
//       if (serviceTime) body.append("service_time", serviceTime);
//       if (address) body.append("address", address);

//       // DEBUG: Check what's in images
//       console.log('Images to upload:', images);
//       images.forEach((img, index) => {
//         console.log(`Image ${index}:`, img);
//         body.append("files", img);
//       });

//       // DEBUG: Log FormData contents
//       console.log('FormData entries:');
//       for (let [key, value] of body.entries()) {
//         console.log(key, value);
//       }

//       const res = await serviceReqAPI.create(body);
//       if (res?.data?.success) {
//         setMessage("Request submitted successfully.");
//         // reset form
//         setServiceType("");
//         setDescription("");
//         setBudget("");
//         setDateType("today");
//         setServiceDate("");
//         setServiceTime("");
//         setAddress("");
//         setPhone("");
//         setName("");
//         setImages([]);
//         setPreview([]);
//       } else {
//         setMessage(res?.data?.message || "Unexpected response.");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage(err?.response?.data?.message || 'Submission failed.');
//     } finally {
//       setLoading(false);
//     }
//   };
  return (
    <div className="w-full text-left">
      <h1 className="text-[22px] font-semibold text-gray-900 mb-1">
        {t("home.serviceReq.title")}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {t("home.serviceReq.subtitle")}
      </p>

      <form className="space-y-6" onSubmit={onSubmit}>
        {/* NAME */}
        <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
                    {t("home.serviceReq.name")}
 <span className="text-red-500">*</span>
          </label>
          <input
          focus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("home.serviceReq.namePlaceholder")}

            className="w-full p-3 rounded-lg border border-gray-200"
          />
        </div>
{errors.name && (
  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
)}
        {/* SERVICE TYPE */}
        <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
                    {t("home.serviceReq.serviceType")}
 <span className="text-red-500">*</span>
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
          >
            <option value="">        {t("home.serviceReq.serviceTypeSelect")}
</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en || c.name}
              </option>
            ))}
          </select>
        </div>
        {errors.serviceType && (
  <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>
)}


        {/* DESCRIPTION */}
        {/* <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
                    {t("home.serviceReq.description")}
 <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("home.serviceReq.descriptionPlaceholder")}

              className="w-full p-4 rounded-lg border border-gray-200 text-gray-700 resize-none focus:border-emerald-400 focus:ring-emerald-400 outline-none"
            />
            <div className="absolute right-3 bottom-3 bg-emerald-500 w-9 h-9 rounded-full flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v11m0 0c-1.657 0-3-1.343-3-3V6c0-1.657 1.343-3 3-3s3 1.343 3 3v3c0 1.657-1.343 3-3 3zM19 11v2a7 7 0 01-14 0v-2"/>
              </svg>
            </div>
          </div>
        </div> */}
<div>
  <label className="text-sm font-medium text-gray-800 block mb-1.5">
    {t("home.serviceReq.description")}
    <span className="text-red-500">*</span>
  </label>

  <div className="relative">
    <textarea
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder={t("home.serviceReq.descriptionPlaceholder")}
      className="w-full p-4 rounded-lg border border-gray-200 text-gray-700 resize-none focus:border-emerald-400 focus:ring-emerald-400 outline-none"
    />

    {/* Microphone button - top right */}
   <button
          type="button"
          className={`absolute top-3 ${
            isArabic ? "left-3" : "right-3"
          } bg-emerald-500 w-9 h-9 rounded-full flex items-center justify-center shadow-sm hover:bg-emerald-600 transition`}
        >
          <HiMicrophone className="text-white w-5 h-5" />
        </button>
  </div>
</div>
{errors.description && (
  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
)}

        {/* BUDGET */}
        <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
                    {t("home.serviceReq.budget")}

          </label>

          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={t("home.serviceReq.budgetPlaceholder")}

            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
          />

          <p className="text-xs text-gray-400 mt-1">
                    {t("home.serviceReq.budgetHint")}

          </p>
        </div>
{errors.budget && (
  <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
)}

        {/* DATE */}
        <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
                                {t("home.serviceReq.date")}
 <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-3 flex-wrap items-center">
            <button type="button" onClick={() => setQuickDate('today')} className={`px-5 py-2 border rounded-xl text-sm ${dateType === 'today' ? 'bg-emerald-100' : 'bg-white'}`}>{t("home.serviceReq.today")}
</button>
            <button type="button" onClick={() => setQuickDate('tomorrow')} className={`px-5 py-2 border rounded-xl text-sm ${dateType === 'tomorrow' ? 'bg-emerald-100' : 'bg-white'}`}>{t("home.serviceReq.tomorrow")}
</button>
            <button type="button" onClick={() => setQuickDate('day_after')} className={`px-5 py-2 border rounded-xl text-sm ${dateType === 'day_after' ? 'bg-emerald-100' : 'bg-white'}`}>{t("home.serviceReq.dayAfter")}
</button>

            {/* <label className={`px-5 py-2 border rounded-xl text-sm cursor-pointer ${dateType === 'other' ? 'bg-emerald-100' : 'bg-white'}`}>
              Other Date
              <input
                type="date"
                className="hidden"
                onChange={(e) => {
                  setDateType('other');
                  setServiceDate(e.target.value);
                }}
              />
            </label>

            {dateType === 'other' && (
              <div className="ml-2">
                <input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} className="p-2 border rounded-lg" />
              </div>
            )} */}
<label
  className={`px-5 py-2 border rounded-xl text-sm cursor-pointer ${
    dateType === 'other' ? 'bg-emerald-100' : 'bg-white'
  }`}
  onClick={() => {
    setDateType("other");
    setTimeout(() => {
      otherDateRef.current?.showPicker();
    }, 0);
  }}
>
                    {t("home.serviceReq.otherDate")}

</label>

<input
  ref={otherDateRef}
  type="date"
  className="opacity-0 absolute pointer-events-none" // <- Hidden but clickable
  onChange={(e) => setServiceDate(e.target.value)}
/>

{dateType === "other" && (
  <p className="text-sm ml-2 text-gray-700">
    {t("home.serviceReq.selectedDate")} {serviceDate || t("home.serviceReq.no-date")}
  </p>
)}

          </div>
        </div>

        {/* TIME */}
        <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
                                {t("home.serviceReq.time")}
 <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={serviceTime}
            onChange={(e) => setServiceTime(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-emerald-400"
            placeholder=''
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
        {t("home.serviceReq.address")}
 <span className="text-red-500">*</span>
          </label>

          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("home.serviceReq.addressPlaceholder")}
            className="w-full p-3 rounded-lg border border-gray-200"
          />
        </div>
        {errors.address && (
  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
)}


        {/* PHONE */}
        <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
           {t("home.serviceReq.contact")}
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("home.serviceReq.contactPlaceholder")}
            className="w-full p-3 rounded-lg border border-gray-200"
          />
        </div>
        {errors.phone && (
  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
)}


        {/* IMAGE UPLOAD */}
        {/* <div>
          <label className="text-sm font-medium text-gray-800 block mb-1.5">
            Attach Image (Optional)
          </label>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50">
              Upload Image
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                name="files" // THIS IS IMPORTANT
                className="hidden"
              />
            </label>

            <div className="flex gap-2">
              {preview.length
                ? preview.map((p, i) => (
                    <img key={i} src={p} alt={`preview-${i}`} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                  ))
                : (
                  <img src={placeholder} alt="placeholder" className="w-20 h-20 rounded-lg object-cover border border-gray-200 opacity-60" />
                )}
            </div>
          </div>
        </div> */}
        <label className="
   inline-flex items-center gap-2 cursor-pointer
  px-4 h-10 w-fit
  border border-gray-300 
  rounded-xl 
  bg-white 
  text-gray-600 
  text-sm 
  hover:bg-gray-50
">
  <HiOutlineUpload className="w-5 h-5 text-gray-500" />

{t("home.serviceReq.uploadImage")}

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleImages}
    name="files"
    className="hidden"
  />
</label>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 items-center pt-4">
          <button type="button" className="px-5 py-2.5 border rounded-lg text-sm hover:bg-gray-50" onClick={() => {
            setServiceType('');
            setDescription('');
            setBudget('');
            setDateType('today');
            setServiceDate('');
            setServiceTime('');
            setAddress('');
            setPhone('');
            setName('');
            setImages([]);
            setPreview([]);
            setMessage('');
          }}>{t("home.serviceReq.buttons.cancel")}</button>

          <button type="submit" className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg text-sm shadow hover:bg-emerald-600" disabled={loading}>
            {loading ? t("home.serviceReq.buttons.submitting") : t("home.serviceReq.buttons.submit")}
          </button>
        </div>

        {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
