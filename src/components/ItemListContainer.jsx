import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts, getProductsByCategory } from '../data/api';
import ItemList from './ItemList';

export default function ItemListContainer({ greeting }) {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = categoryId ? getProductsByCategory(categoryId) : getProducts();
    fetchData.then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [categoryId]);

  return (
    <div className="text-center mt-8">
      <h2 className="text-2xl font-bold mb-4">{greeting}</h2>
      {loading ? (
        <div className="text-lg text-gray-500">Cargando productos...</div>
      ) : (
        <ItemList items={items} />
      )}
    </div>
  );
}
