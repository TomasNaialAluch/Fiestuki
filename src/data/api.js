// src/data/api.js
import { db } from '../services/firebase.js';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

// Obtener todos los productos
export async function getProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(categoryId) {
  try {
    const q = query(
      collection(db, 'products'), 
      where('category', '==', categoryId)
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    return [];
  }
}

// Obtener producto por ID
export async function getProductById(id) {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log('No se encontró el producto');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    return null;
  }
}
