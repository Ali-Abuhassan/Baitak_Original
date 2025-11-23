// import React from "react";
// import { useTranslation } from "react-i18next";
// import SearchBar from "./SearchBar";

// const HeroSection = ({ searchQuery, setSearchQuery, location, setLocation, navigate }) => {
//   const { t, i18n } = useTranslation();
//   const isArabic = i18n.language === "ar";

//   return (
//     <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
//       <div className="container-custom text-center mb-12">
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//           {t("home.title")}
//         </h1>
//         <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//           {t("home.subtitle")}
//         </p>
//       </div>

//       <SearchBar
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         location={location}
//         setLocation={setLocation}
//         navigate={navigate}
//         isArabic={isArabic}
//       />

//       <div className="flex flex-wrap justify-center gap-2 mt-6">
        
//         <span className="text-sm text-gray-600">{t("home.hero.popularTags")}</span>
//         {t("home.hero.popularServices", { returnObjects: true }).map((tag) => (
//           <button
//             key={tag}
//             onClick={() => navigate(`/services?search=${tag}&location=${location}`)}
//             className="text-sm px-3 py-1 bg-white rounded-full hover:bg-primary-50 transition-colors"
//           >
//             {tag}
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
import React from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "./SearchBar";
import ServiceReqModal from "../sharedInputs/ServiceReqModal";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

const HeroSection = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  navigate,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <section className="bg-white py-20">
      <div className="container-custom text-center mb-12">
        <h1 className="text-xl md:text-5xl  text-green-600 mb-4">
          {t("home.title")}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
          {t("home.subtitle")}
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-4xl mx-auto">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          location={location}
          setLocation={setLocation}
          navigate={navigate}
          isArabic={isArabic}
        />
      </div>

      {/* Popular Tags */}
      {/* <div className="max-w-4xl mx-auto mt-5">
        <span className="text-sm text-gray-600">{t("home.hero.popularTags")}</span>

        <div className="flex flex-wrap gap-2 mt-2">
          {t("home.hero.popularServices", { returnObjects: true }).map((tag) => (
            <button
              key={tag}
              onClick={() =>
                navigate(`/services?search=${tag}&location=${location}`)
              }
              className="text-sm px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-green-50 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div> */}

      {/* Budget Section */}
      <div className="text-center mt-12">
        <p className="text-gray-700">
          {t("home.hero.haveBudget")}{" "}
          <span className="font-semibold">{t("home.hero.budgetBold")}</span>
        </p>

{/* <Link to={"/servicereq"}>
   <button className="mt-3 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
          {t("home.hero.submitRequest")}
        </button>
</Link>
      */}
      <ServiceReqModal>
      {({ setOpen }) => (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
        >
          {t("home.hero.submitRequest")}
        </button>
      )}
    </ServiceReqModal>
      </div>
    </section>
  );
};

export default HeroSection;
