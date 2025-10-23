import { useState, useEffect, useRef } from "react";
import { createContextFactory } from "../utils/contextFactory";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

// Crear el contexto usando el factory (DRY)
const { Context: CartContext, useContextHook } = createContextFactory('Cart');
export { CartContext };
export const useCart = useContextHook;

// Provider del carrito
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const isFirstLoad = useRef(true); // Para evitar guardar en la primera carga
  const { user } = useAuth();

  // Guardar carrito en Firebase
  const saveCartToFirebase = async (cartData) => {
    if (!user) return;
    
    try {
      console.log('Guardando carrito en Firebase:', cartData);
      await setDoc(doc(db, 'userCarts', user.uid), {
        cart: cartData,
        lastUpdated: new Date()
      }, { merge: true });
      console.log('Carrito guardado exitosamente');
    } catch (error) {
      console.error('Error guardando carrito:', error);
    }
  };

  // Cargar carrito desde Firebase
  const loadCartFromFirebase = async () => {
    if (!user) {
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    try {
      console.log('Cargando carrito desde Firebase para usuario:', user.uid);
      const cartDoc = await getDoc(doc(db, 'userCarts', user.uid));
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        console.log('Carrito encontrado:', cartData.cart);
        setCart(cartData.cart || []);
      } else {
        console.log('No se encontró carrito guardado');
        setCart([]);
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  // Cargar carrito cuando el usuario se loguea
  useEffect(() => {
    if (user) {
      console.log('Usuario logueado, cargando carrito...', user.uid);
      loadCartFromFirebase();
    } else {
      console.log('Usuario no logueado, limpiando carrito');
      setCart([]);
      setLoading(false);
      setIsInitialized(true);
    }
  }, [user]);

  // Guardar carrito cada vez que cambia (SOLO después de inicializar)
  useEffect(() => {
    // Saltar el primer render después de cargar
    if (isFirstLoad.current) {
      if (isInitialized) {
        console.log('Primera carga completada, activando auto-guardado');
        isFirstLoad.current = false;
      }
      return;
    }

    // Guardar solo si ya está inicializado y hay usuario
    if (user && isInitialized && !loading) {
      console.log('Guardando cambios del carrito automáticamente:', cart);
      saveCartToFirebase(cart);
    }
  }, [cart, user, isInitialized, loading]);

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
  const clearCart = () => {
    setCart([]);
    // También limpiar de Firebase
    if (user) {
      saveCartToFirebase([]);
    }
  };

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
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}