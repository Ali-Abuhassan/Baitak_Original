// import React from 'react';
// import { Link } from 'react-router-dom';
// import { formatPrice } from './currency';

// const CategoryTile = ({ category }) => {
//   return (
//     <Link
//       to={`/providers?category=${category.slug}`}
//       className="group card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//     >
//       <div className="flex flex-col items-center text-center">
//         {category.image ? (
//           <img 
//             src={`/uploads/${category.image}`} 
//             alt={category.name}
//             className="w-20 h-20 rounded-full mb-3 object-cover"
//           />
//         ) : (
//           <div className="text-6xl mb-3">{category.icon || '🏠'}</div>
//         )}
//         <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
//           {category.name}
//         </h3>
//         <p className="text-sm text-gray-600 mt-1">{category.description}</p>
//         {/* {category.suggested_price_range && (
//           <p className="text-xs text-gray-500 mt-2">
//             {formatPrice(category.suggested_price_range.min)} - {formatPrice(category.suggested_price_range.max)}/hr
//           </p>
//         )} */}
//       </div>
//     </Link>
//   );
// };

// export default CategoryTile;
import React from "react";
import { Link } from "react-router-dom";

const CategoryTile = ({ category }) => {
  return (
    <Link
      to={`/providers?category=${category.slug}`}
      className="
        group 
        bg-white 
        rounded-2xl 
        border border-green-300 
        shadow-sm 
        hover:shadow-lg 
        transition-all 
        duration-300 
        p-6 
        flex 
        flex-col 
        items-center 
        text-center
        hover:-translate-y-1
      "
    >
      {/* Icon OR image */}
      {category.image ? (
        <img
          src={`/uploads/${category.image}`}
          alt={category.name}
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
      ) : (
        <div className="text-7xl mb-4">
          {category.icon || "🏠"}
        </div>
      )}

      {/* Name */}
      <h3 className="font-bold text-lg text-gray-900 mb-1">
        {category.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600">
        {category.description}
      </p>
      
    </Link>
    
  );
};

export default CategoryTile;
