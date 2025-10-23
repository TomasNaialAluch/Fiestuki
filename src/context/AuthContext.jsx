import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { createContextFactory } from "../utils/contextFactory";

// Crear el contexto usando el factory (DRY)
const { Context: AuthContext, useContextHook } = createContextFactory('Auth');
export { AuthContext };
export const useAuth = useContextHook;

// Provider de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
        const profileData = userDoc.data();
        setUserProfile(profileData);
        setIsAdmin(profileData.role === 'admin');
      } else {
        // Si no existe el documento, crearlo con datos básicos
        const newProfile = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Usuario',
          createdAt: new Date(),
          address: '',
          phone: '',
          role: 'user', // Por defecto todos son usuarios normales
          orderHistory: [] // Array de IDs de pedidos
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
        setUserProfile(newProfile);
        setIsAdmin(false); // Los nuevos usuarios no son admin por defecto
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
      setIsAdmin(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para hacer admin a un usuario (solo para super admins)
  const makeUserAdmin = async (userId) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        role: 'admin'
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error al hacer admin al usuario:', error);
      return false;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    updateUserProfile,
    addOrderToHistory,
    logout,
    makeUserAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
