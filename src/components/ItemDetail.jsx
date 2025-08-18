// src/components/ItemDetail.jsx

import ItemCount from './ItemCount';

export default function ItemDetail({ item }) {
  const handleAdd = (cantidad) => {
    alert(`Agregaste ${cantidad} unidades al carrito`);
  };
  return (
    <div className="max-w-md mx-auto mt-10 border rounded-lg p-6 shadow">
      <img src={item.imagen} alt={item.nombre} className="w-full h-60 object-contain mb-4" />
      <h2 className="text-2xl font-bold mb-2">{item.nombre}</h2>
      <p className="text-lg text-gray-700 mb-2">Precio: ${item.precio}</p>
      <ItemCount stock={10} initial={1} onAdd={handleAdd} />
    </div>
  );
}
