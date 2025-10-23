import { useState } from "react";
import { createContextFactory } from "../utils/contextFactory";

// Crear el contexto usando el factory (DRY)
const { Context: UIContext, useContextHook } = createContextFactory('UI');
export { UIContext };
export const useUI = useContextHook;

// Provider consolidado para estados de UI (YAGNI - solo lo que necesitas)
export function UIProvider({ children }) {
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [addedProduct, setAddedProduct] = useState(null); // Para el modal de producto agregado
  const [isNavBarHidden, setIsNavBarHidden] = useState(false); // Para ocultar NavBar en checkout

  // Funciones para manejar notificaciones
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove después de 3 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearNotifications = () => setNotifications([]);

  // Funciones para manejar el modal de producto agregado
  const showAddedProductModal = (product, quantity) => {
    setAddedProduct({ ...product, addedQuantity: quantity });
  };

  const hideAddedProductModal = () => {
    setAddedProduct(null);
  };

  return (
    <UIContext.Provider
      value={{
        // Side cart
        isSideCartOpen,
        setIsSideCartOpen,
        
        // Loading states
        isLoading,
        setIsLoading,
        
        // Notifications
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,

        // Added product modal
        addedProduct,
        showAddedProductModal,
        hideAddedProductModal,

        // NavBar visibility
        isNavBarHidden,
        setIsNavBarHidden,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
