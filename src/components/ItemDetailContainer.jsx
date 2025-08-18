// src/components/ItemDetailContainer.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../data/api';
import ItemDetail from './ItemDetail';

export default function ItemDetailContainer() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductById(itemId).then((data) => {
      setItem(data);
      setLoading(false);
    });
  }, [itemId]);

  if (loading) return <div className="text-center mt-8 text-lg text-gray-500">Cargando producto...</div>;
  if (!item) return <div className="text-center mt-8 text-red-500">Producto no encontrado</div>;

  return <ItemDetail item={item} />;
}
