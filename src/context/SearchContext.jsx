import { createContext, useContext, useState } from "react";
import { createContextFactory } from "../utils/contextFactory";

// Crear el contexto usando el factory (DRY)
const { Context: SearchContext, useContextHook } = createContextFactory('Search');
export { SearchContext };
export const useSearch = useContextHook;

// Provider de búsqueda
export function SearchProvider({ children }) {
  const [search, setSearch] = useState('');
  
  const clearSearch = () => setSearch('');
  
  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
