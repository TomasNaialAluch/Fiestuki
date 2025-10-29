// src/components/Item.jsx
import { Link } from 'react-router-dom';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ItemMobile from './ItemMobile';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useState } from 'react';

export default function Item({ item }) {
  const { isMobile } = useDeviceDetection();
  const { addToCart, cart } = useCart();
  const { showAddedProductModal } = useUI();
  const [error, setError] = useState('');

  // Si es mobile, pasa addToCart como prop
  if (isMobile) {
    return <ItemMobile item={item} />;
  }

  const cartItem = cart.find(prod => prod.id === item.id);
  const alreadyInCart = cartItem ? cartItem.quantity : 0;
  const stock = item.stock ?? 0;
  const isOutOfStock = stock === 0 || stock - alreadyInCart <= 0;

  const handleAddToCart = (e, qty = 1) => {
    e.preventDefault(); // Evita la navegación al detalle solo cuando se hace click en el botón
    e.stopPropagation();

    if (isOutOfStock) {
      setError('Producto agotado');
      return;
    }

    if (qty + alreadyInCart > stock) {
      setError('No hay suficiente stock disponible');
      return;
    }
    addToCart(item, qty);
    showAddedProductModal(item, qty);
    setError('');
  };

  return (
    <Link to={`/item/${item.id}`} className="block">
      <div className="bg-[#FAF4E4] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Imagen del producto */}
        <div className="relative overflow-hidden bg-[#F0E8D8] p-3">
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center rounded-lg">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold font-baloo text-lg">
                AGOTADO
              </div>
            </div>
          )}
          <img 
            src={item.mainImage || item.images?.[0] || item.imagen} 
            alt={item.name || item.nombre} 
            className={`w-full h-28 object-cover rounded-lg ${isOutOfStock ? 'opacity-50' : ''}`}
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
            onClick={(e) => handleAddToCart(e, 1)}
            disabled={isOutOfStock}
            className={`w-full font-bold py-2 px-4 rounded-xl transition-colors duration-200 shadow-sm font-baloo text-base ${
              isOutOfStock 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-[#F0AB7A] text-white hover:bg-[#E55A31]'
            }`}
          >
            {isOutOfStock ? '❌ Agotado' : '🛒 Agregar al carrito'}
          </button>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      </div>
    </Link>
  );
}
