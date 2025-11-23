// import React from "react";
// import { Link } from "react-router-dom";
// import Skeleton from "react-loading-skeleton";
// import CategoryTile from "../../services/CategoryTile";
// import { useTranslation } from "react-i18next";

// const CategoriesSection = ({ categories, loading }) => {
//   const { t } = useTranslation();

//   return (
//     <section className="py-16">
//       <div className="container-custom text-center mb-12">
//         <h2 className="text-3xl font-bold mb-4">{t("home.browse_categories")}</h2>
//         <p className="text-gray-600">{t("home.categories_subtitle")}</p>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {[...Array(8)].map((_, i) => (
//             <Skeleton key={i} height={150} />
//           ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {categories.map((c) => (
//             <CategoryTile key={c.id} category={c} />
//           ))}
//         </div>
//       )}

//       <div className="text-center mt-8">
//         <Link to="/services" className="btn-outline">
//           {t("home.view_all_services")}
//         </Link>
//       </div>
//     </section>
//   );
// };

// export default CategoriesSection;
import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import CategoryTile from "../../services/CategoryTile";
import { useTranslation } from "react-i18next";

const CategoriesSection = ({ categories, loading }) => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="container-custom text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">
          {t("home.browse_categories")}
        </h2>
        <p className="text-gray-600">
          {t("home.categories_subtitle")}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} height={150} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((c) => (
        c.slug === "painting" ? null : (

            <CategoryTile key={c.id} category={c} />
        )
          ))}
        </div>
      )}

      {/* <div className="text-center mt-10">
        <Link to="/services" className="btn-outline">
          {t("home.view_all_services")}
        </Link>
      </div> */}
    </section>
  );
};

export default CategoriesSection;
