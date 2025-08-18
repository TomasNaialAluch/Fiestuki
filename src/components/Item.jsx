// src/components/Item.jsx
import { Link } from 'react-router-dom';

export default function Item({ item }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img src={item.imagen} alt={item.nombre} className="w-full h-40 object-contain mb-2" />
      <h3 className="font-bold text-lg mb-1">{item.nombre}</h3>
      <p className="text-gray-600 mb-1">${item.precio}</p>
      <p className="text-xs text-gray-400 mb-2">Categoría: {item.categoria}</p>
      <Link to={`/item/${item.id}`} className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Ver detalle
      </Link>
    </div>
  );
}
