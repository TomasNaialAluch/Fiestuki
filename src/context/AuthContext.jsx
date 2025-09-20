import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

// Crear el contexto
export const AuthContext = createContext();

// Hook para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

// Provider de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Buscar o crear perfil del usuario en Firestore
        await loadUserProfile(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Cargar perfil del usuario desde Firestore
  const loadUserProfile = async (firebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        // Si no existe el documento, crearlo con datos básicos
        const newProfile = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Usuario',
          createdAt: new Date(),
          address: '',
          phone: '',
          orderHistory: [], // Array de IDs de pedidos
          role: 'user'
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error al cargar perfil del usuario:', error);
    }
  };

  // Actualizar perfil del usuario
  const updateUserProfile = async (profileData) => {
    if (!user) return;
    
    try {
      await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
      setUserProfile(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  // Agregar pedido al historial
  const addOrderToHistory = async (orderId) => {
    if (!user || !userProfile) return;
    
    const updatedHistory = [...(userProfile.orderHistory || []), orderId];
    await updateUserProfile({ orderHistory: updatedHistory });
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    updateUserProfile,
    addOrderToHistory,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
