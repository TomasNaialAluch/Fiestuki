// src/components/ItemCount.jsx
import { useState } from 'react';

export default function ItemCount({ stock = 10, initial = 1, onAdd }) {
  const [count, setCount] = useState(initial);

  const handleAdd = () => {
    if (count < stock) setCount(count + 1);
  };
  const handleSubtract = () => {
    if (count > 1) setCount(count - 1);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button onClick={handleSubtract} className="px-3 py-1 bg-gray-200 rounded text-lg">-</button>
      <span className="font-bold text-lg">{count}</span>
      <button onClick={handleAdd} className="px-3 py-1 bg-gray-200 rounded text-lg">+</button>
      <button onClick={() => onAdd(count)} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Agregar</button>
    </div>
  );
}
