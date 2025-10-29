import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../../../context/SearchContext';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { getProducts } from '../../../../data/api';

export const SearchBar = ({ placeholder = "Buscar", fullWidth = false, enableDropdown = true }) => {
  const { search, setSearch } = useSearch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const dropdownRef = useRef(null);

  // Detectar si es desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Cargar productos una vez (solo si el dropdown está habilitado)
  useEffect(() => {
    if (!enableDropdown) return;
    getProducts().then(data => setProducts(data));
  }, [enableDropdown]);

  // Filtrar productos cuando cambia la búsqueda (solo desktop y si el dropdown está habilitado)
  useEffect(() => {
    if (!enableDropdown) {
      setFilteredProducts([]);
      return;
    }
    if (search && search.trim() !== '' && isDesktop) {
      const filtered = products
        .filter(item => 
          (item.name || item.nombre || '').toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 5); // Solo primeros 5 resultados
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [search, products, isDesktop, enableDropdown]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // No hacemos nada, el dropdown se cerrará solo cuando no haya búsqueda
        // Esto permite que el usuario pueda hacer clic en los resultados
      }
    };

    if (enableDropdown && isDesktop && (filteredProducts.length > 0 || (search && search.trim() !== ''))) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filteredProducts, search, isDesktop, enableDropdown]);

  return (
    <div ref={dropdownRef} className={`w-full ${fullWidth ? 'max-w-full' : 'max-w-[300px]'} relative`}>
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
      
      {/* Dropdown de resultados - Solo desktop y cuando hay búsqueda */}
      {enableDropdown && search && search.trim() !== '' && filteredProducts.length > 0 && isDesktop && (
        <div className="hidden md:block absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/item/${product.id}`}
                onClick={() => setSearch('')}
                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {product.mainImage || product.images?.[0] ? (
                    <img 
                      src={product.mainImage || product.images?.[0]} 
                      alt={product.name || product.nombre}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <FaSearch className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-baloo font-semibold text-sm text-gray-800 truncate">
                      {product.name || product.nombre}
                    </p>
                    <p className="font-baloo font-bold text-sm text-[#FF6B35]">
                      ${(product.price || product.precio)?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Link para ver buscador expandido */}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <Link
                to="/search"
                className="block px-4 py-2 text-center text-sm font-baloo font-bold text-[#FF6B35] hover:bg-[#FAF4E4] transition-colors"
              >
                Ver buscador expandido →
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Si hay búsqueda pero no hay resultados */}
      {enableDropdown && search && search.trim() !== '' && filteredProducts.length === 0 && isDesktop && (
        <div className="hidden md:block absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="py-4 px-4 text-center">
            <p className="text-sm text-gray-500 font-baloo mb-2">No se encontraron resultados</p>
            <Link
              to="/search"
              className="text-sm font-baloo font-bold text-[#FF6B35] hover:underline"
            >
              Ver buscador expandido →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;