import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../../../context/CartContext'
import { useUI } from '../../../../context/UIContext'

export default function CartWidget() {
  const { totalQuantity, loading } = useCart();
  const { setIsSideCartOpen } = useUI();

  return (
    // Icono de carrito con badge de cantidad
    <div className="relative cursor-pointer" onClick={() => setIsSideCartOpen(true)}>
      <FaShoppingCart className={`text-2xl ${loading ? 'text-gray-400' : 'text-gray-700'}`} />
      {!loading && totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
      {loading && (
        <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  )
}