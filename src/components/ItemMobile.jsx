import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

export default function ItemMobile({ item }) {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { showAddedProductModal } = useUI();
  
  const cartItem = cart.find(prod => prod.id === item.id);
  const alreadyInCart = cartItem ? cartItem.quantity : 0;
  const stock = item.stock ?? 0;
  const isOutOfStock = stock === 0 || stock - alreadyInCart <= 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(item, 1);
    showAddedProductModal(item, 1);
  };

  const handleOpenDetail = () => {
    navigate(`/item/${item.id}`);
  };

  return (
    <div
      className="bg-[#FAF4E4] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex cursor-pointer"
      onClick={handleOpenDetail}
    >
      {/* Imagen del producto - Lado izquierdo */}
      <div className="relative flex-1 bg-[#F0E8D8] p-2">
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center rounded-lg">
            <div className="bg-red-600 text-white px-2 py-1 rounded font-bold font-baloo text-xs">
              AGOTADO
            </div>
          </div>
        )}
        <img 
          src={item.mainImage || item.images?.[0] || item.imagen} 
          alt={item.name || item.nombre} 
          className={`w-full h-24 object-cover rounded-lg ${isOutOfStock ? 'opacity-50' : ''}`}
        />
        {/* Categoría sobre la imagen */}
        <div className="absolute bottom-1 right-1 bg-[#FF6B35] text-white px-2 py-1 rounded-full text-xs font-bold font-baloo">
          {item.category || item.categoria}
        </div>
      </div>

      {/* Contenido - Lado derecho */}
      <div className="flex-1 p-2 flex flex-col justify-between">
        {/* Info del producto */}
        <div className="text-center">
          <h3 className="font-baloo font-bold text-sm text-gray-800 mb-1 leading-tight">
            {item.name || item.nombre}
          </h3>
          
          <div className="mb-2">
            <span className="text-base font-bold text-[#8E44AD] font-baloo">
              ${(item.price || item.precio)?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Botón Agregar al carrito */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-bold py-2 px-2 rounded-lg transition-colors duration-200 shadow-sm font-baloo text-sm ${
            isOutOfStock 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-[#F0AB7A] text-white hover:bg-[#E55A31]'
          }`}
        >
          {isOutOfStock ? '❌' : '🛒 +'}
        </button>
      </div>
    </div>
  );
}