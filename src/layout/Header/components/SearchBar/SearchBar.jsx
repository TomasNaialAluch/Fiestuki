import React from 'react';
import { useSearch } from '../../../../context/SearchContext';
import { FaSearch } from "react-icons/fa";

export const SearchBar = ({ placeholder = "Buscar" }) => {
  const { search, setSearch } = useSearch();

  return (
    <div className="w-full max-w-[300px] relative">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={placeholder}
        className="search-input w-full h-9 px-4 border border-gray-300 rounded-l-md bg-white focus:outline-none"
        style={{ borderRadius: '6px 0 0 6px' }}
      />
      <button
        className="search-button absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 border border-l-0 border-gray-300 rounded-r-md bg-white flex items-center justify-center"
        style={{ borderRadius: '0 6px 6px 0' }}
        tabIndex={-1}
        type="button"
      >
        <FaSearch className="text-gray-600" />
      </button>
    </div>
  );
};

export default SearchBar;