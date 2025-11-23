import React from "react";
import { HiSearch } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const SearchSuggestions = ({ suggestions, loading, searchQuery, onSelect }) => {
  const { t } = useTranslation();

  if (loading)
    return (
      <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 mt-1 p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
        <p>{t("home.search.loading_suggestions")}</p>
      </div>
    );

  if (!suggestions.length)
    return (
      <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 mt-1 p-4 text-center text-gray-500">
        {t("home.search.no_suggestions", { query: searchQuery })}
      </div>
    );

  return (
    <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
      {suggestions.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(item.text || item)}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-none flex items-center group"
        >
          <HiSearch className="text-gray-400 mr-3" />
          <span className="text-gray-700">{item.text || item}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;
