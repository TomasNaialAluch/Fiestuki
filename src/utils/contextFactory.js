import { createContext, useContext } from 'react';

/**
 * Factory para crear contextos de manera consistente
 * Aplica el principio DRY eliminando código repetitivo
 */
export function createContextFactory(name) {
  const Context = createContext();
  
  const useContextHook = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  };
  
  return {
    Context,
    useContextHook,
    displayName: `${name}Context`
  };
}
