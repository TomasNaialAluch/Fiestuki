// src/components/Item.jsx
import { Link } from 'react-router-dom';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ItemMobile from './ItemMobile';

export default function Item({ item }) {
  const { isMobile } = useDeviceDetection();

  // Si es mobile, usa el componente ItemMobile
  if (isMobile) {
    return <ItemMobile item={item} />;
  }

  // Desktop version
  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Agregando al carrito:', item);
  };

  return (
    <Link to={`/item/${item.id}`} className="block">
      <div className="bg-[#FAF4E4] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Imagen del producto */}
        <div className="relative overflow-hidden bg-[#F0E8D8] p-3">
          <img 
            src={item.mainImage || item.images?.[0] || item.imagen} 
            alt={item.name || item.nombre} 
            className="w-full h-28 object-cover rounded-lg" 
          />
          <div className="absolute bottom-2 right-2 bg-[#FF6B35] text-white px-2 py-1 rounded-full text-xs font-bold font-baloo">
            {item.category || item.categoria}
          </div>
        </div>

        {/* Contenido de la card */}
        <div className="p-3 text-center bg-[#FAF4E4]">
          <h3 className="font-baloo font-bold text-xl text-gray-800 mb-1 min-h-[3rem] flex items-center justify-center">
            {item.name || item.nombre}
          </h3>
          
          <div className="mb-3">
            <span className="text-xl font-bold text-[#8E44AD] font-baloo">
              ${(item.price || item.precio)?.toLocaleString()}
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#F0AB7A] text-white font-bold py-2 px-4 rounded-xl hover:bg-[#E55A31] transition-colors duration-200 shadow-sm font-baloo text-base"
          >
            🛒 Agregar al carrito
          </button>
        </div>
      </div>
    </Link>
  );
}
