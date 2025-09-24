import { useState } from "react";
import { createContextFactory } from "../utils/contextFactory";

// Crear el contexto usando el factory (DRY)
const { Context: CartContext, useContextHook } = createContextFactory('Cart');
export { CartContext };
export const useCart = useContextHook;

// Provider del carrito
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}