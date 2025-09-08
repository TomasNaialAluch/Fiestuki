import { useEffect, useState } from 'react';
import { getProducts, getProductsByCategory } from '../data/api';
import ItemList from './ItemList';

export default function ItemListContainer({ greeting, categoryId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 CategoryId recibido:', categoryId);
    setLoading(true);
    
    const fetchData = categoryId ? getProductsByCategory(categoryId) : getProducts();
    
    fetchData.then((data) => {
      console.log('🔥 Datos de Firebase:', data);
      setItems(data);
      setLoading(false);
    });
  }, [categoryId]);

  return (
    <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8 max-w-7xl">
      {greeting && (
        <h2 className="text-center text-2xl md:text-3xl font-baloo font-bold text-gray-800 mb-6">
          {greeting}
        </h2>
      )}
      
      {loading ? (
        <div className="text-center text-lg text-gray-500 py-12">
          Cargando productos...
        </div>
      ) : (
        <ItemList items={items} />
      )}
    </div>
  );
}
