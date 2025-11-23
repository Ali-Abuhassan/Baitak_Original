// // import React, { useState } from "react";
// // import { HiSearch, HiLocationMarker } from "react-icons/hi";
// // import SearchSuggestions from "./SearchSuggestions";
// // import toast from "react-hot-toast";
// // import { useTranslation } from "react-i18next";

// // const SearchBar = ({ searchQuery, setSearchQuery, location, setLocation, navigate, isArabic }) => {
// //   const { t } = useTranslation();
// //   const [showSuggestions, setShowSuggestions] = useState(false);
// //   const [suggestions, setSuggestions] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const fetchSuggestions = async (query) => {
// //     if (query.length < 2) return;
// //     try {
// //       setLoading(true);
// //       const response = await fetch(`/api/search/suggestions?q=${query}`);
// //       const data = await response.json();
// //       setSuggestions(data?.data || []);
// //       setShowSuggestions(true);
// //     } catch {
// //       setSuggestions([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSearch = (e) => {
// //     e.preventDefault();
// //     if (!searchQuery.trim()) return toast.error(t("home.errors.search_required"));
// //     navigate(`/services?search=${searchQuery}&location=${location}`);
// //   };

// //   return (
// //     <form onSubmit={handleSearch} className="max-w-4xl mx-auto" dir={isArabic ? "rtl" : "ltr"}>
// //       <div
// //         className={`bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row ${
// //           isArabic ? "md:flex-row-reverse" : ""
// //         } gap-2 relative`}
// //       >
// //         <div className="flex-1 flex items-center px-4 relative">
// //           <HiSearch className="text-gray-400 mr-2" />
// //           <input
// //             type="text"
// //             placeholder={t("home.search_placeholder")}
// //             value={searchQuery}
// //             onChange={(e) => {
// //               setSearchQuery(e.target.value);
// //               fetchSuggestions(e.target.value);
// //             }}
// //             onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
// //             onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
// //             className="w-full py-3 focus:outline-none"
// //             style={{ textAlign: isArabic ? "right" : "left" }}
// //           />
// //           {showSuggestions && (
// //             <SearchSuggestions
// //               suggestions={suggestions}
// //               loading={loading}
// //               searchQuery={searchQuery}
// //               onSelect={(text) => {
// //                 setSearchQuery(text);
// //                 setShowSuggestions(false);
// //                 navigate(`/services?search=${text}&location=${location}`);
// //               }}
// //             />
// //           )}
// //         </div>

// //         <div className="flex items-center px-4 border-l">
// //           <HiLocationMarker className="text-gray-400 mr-2" />
// //           <input
// //             type="text"
// //             placeholder={t("home.location_placeholder")}
// //             value={location}
// //             onChange={(e) => setLocation(e.target.value)}
// //             className="w-full py-3 focus:outline-none"
// //             style={{ textAlign: isArabic ? "right" : "left" }}
// //           />
// //         </div>

// //         <button type="submit" className="btn-primary px-8">
// //           {t("common.search")}
// //         </button>
// //       </div>
// //     </form>
// //   );
// // };

// // export default SearchBar;
// import React, { useState } from "react";
// import { HiSearch, HiMicrophone, HiChevronDown } from "react-icons/hi";
// import toast from "react-hot-toast";
// import { useTranslation } from "react-i18next";
// import CityDropdown from "../sharedInputs/CityDropdown";

// const SearchBar = ({
//   searchQuery,
//   setSearchQuery,
//   location,
//   setLocation,
//   navigate,
//   isArabic,
// }) => {
//   const { t } = useTranslation();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim())
//       return toast.error(t("home.errors.search_required"));
//     navigate(`/services?search=${searchQuery}&location=${location}`);
//   };

//   return (
//     <form onSubmit={handleSearch} dir={isArabic ? "rtl" : "ltr"}>
//       <div className="bg-white rounded-2xl border border-green-200 shadow-md p-3 flex flex-col md:flex-row gap-3 items-center">
        
//         {/* SEARCH INPUT */}
//         <div className="flex items-center flex-1 bg-gray-50 rounded-lg px-4 py-3">
//           <HiSearch className="text-gray-400" />
//           <input
//             type="text"
//             placeholder={t("home.search_placeholder")}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-transparent px-3 focus:outline-none"
//           />

//           {/* MIC BUTTON */}
//           <button
//             type="button"
//             className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200"
//           >
//             <HiMicrophone />
//           </button>
//         </div>

//         {/* CITY DROPDOWN MOCK */}
//         {/* <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3 min-w-[150px] justify-between cursor-pointer">
//           <span className="text-gray-700">
//             {location || t("home.location_placeholder")}
//           </span>
//           <HiChevronDown className="text-gray-500" />
//         </div> */}
//         <CityDropdown/>

//         {/* SEARCH BUTTON */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition"
//         >
//           {t("common.search")}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SearchBar;
import React, { useState, useEffect } from "react";
import { HiSearch, HiMicrophone } from "react-icons/hi";
import CityDropdown from "../sharedInputs/CityDropdown";
import { categoryAPI } from "../../services/api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  navigate,
  isArabic,
}) => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        console.log("the categories: ",res.data);
        setCategories(res?.data?.data?.categories || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return toast.error(t("home.errors.search_required"));
    navigate(`/services?search=${searchQuery}&location=${location}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      dir={isArabic ? "rtl" : "ltr"}
      className="max-w-5xl mx-auto "
    >
      {/* Outer rounded container */}
      <div className="bg-white border border-green-200 rounded-2xl shadow-md p-5">
        
        {/* Top row: search + mic + city + button */}
        {/* <div
          className={`flex flex-col md:flex-row items-center gap-3 ${
            isArabic ? "md:flex-row-reverse" : ""
          }`}
        > */}
        <div
  className="flex flex-col md:flex-row items-center gap-3"
>
          {/* Search Input */}
          {/* <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1">
            <HiSearch className="text-gray-500 mr-2" /> */}
<div
  className={`flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1
    ${isArabic ? "order-3 md:order-3" : "order-1 md:order-1"}`}
>
            <input
              type="text"
              placeholder={t("home.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 focus:outline-none bg-transparent"
              style={{ textAlign: isArabic ? "right" : "left" }}
            />

            {/* Mic button */}
            <button
              type="button"
              className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
            >
              <HiMicrophone className="text-lg" />
            </button>
          </div>

          {/* City Dropdown ppp*/}
          {/* <div className="w-48">
            <CityDropdown
              name="city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              isArabic={isArabic}
              className="h-[48px]"
            />
          </div>
           */}
           <div
  className={`w-48 
    ${isArabic ? "order-2 md:order-2" : "order-2 md:order-2"}`}
>
  <CityDropdown
    name="city"
    value={location}
    placeholder={t("auth.signup.select-city")}
    onChange={(e) => setLocation(e.target.value)}
    isArabic={isArabic}
    className="h-[48px]"
  />
</div>


          {/* Search button */}
          {/* <button
            type="submit"
            className="bg-green-600 text-white px-7 h-[48px] rounded-lg hover:bg-green-700 transition"
          >
            {t("common.search")}
          </button> */}
          <button
  type="submit"
  className={`bg-green-600 text-white px-7 h-[48px] rounded-lg hover:bg-green-700 transition 
    ${isArabic ? "order-1 md:order-1" : "order-3 md:order-3"}`}
>
  {t("common.search")}
</button>
        </div>

        {/* Popular tags */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className="text-gray-600 text-sm font-medium">
            {t("home.hero.popularTags")}
          </span>

          {/* {categories.slice(0, 6).map((c) => (
          
            <button
              key={c.id}
              type="button"
              onClick={() =>
                navigate(`/services?search=${c.name}&location=${location}`)
              }
              className="text-sm  border px-4 py-1 rounded-full hover:bg-gray-200 transition"
            >
              {c.name}
            </button>
          ))} */}
          {categories.slice(0, 6).map((c) => 
  c.name.toLowerCase() === "painting" ? null : (
    <button
      key={c.id}
      type="button"
      onClick={() =>
        navigate(`/services?search=${c.name}&location=${location}`)
      }
      className="text-sm border px-4 py-1 rounded-full hover:bg-gray-200 transition"
    >
      {c.name}
    </button>
  )
)}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
