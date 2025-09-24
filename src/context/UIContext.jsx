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
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
