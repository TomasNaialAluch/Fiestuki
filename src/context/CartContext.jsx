import { createContext, useContext, useState } from "react";

// Crear el contexto
export const CartContext = createContext();

// Hook para usar el contexto fácilmente
export const useCart = () => useContext(CartContext);

// Provider del carrito
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);

  // Agregar producto al carrito
  const addToCart = (item, quantity) => {
    setCart(prevCart => {
      const existing = prevCart.find(prod => prod.id === item.id);
      if (existing) {
        return prevCart.map(prod =>
          prod.id === item.id
            ? { ...prod, quantity: prod.quantity + quantity }
            : prod
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(prod => prod.id !== id));
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  // Cantidad total de productos
  const totalQuantity = cart.reduce((acc, prod) => acc + prod.quantity, 0);

  // Total en $
  const totalPrice = cart.reduce((acc, prod) => acc + prod.quantity * prod.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalQuantity,
        totalPrice,
        isSideCartOpen,
        setIsSideCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}