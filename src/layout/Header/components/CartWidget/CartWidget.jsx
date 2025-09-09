import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../../../context/CartContext'

export default function CartWidget() {
  const { totalQuantity, setIsSideCartOpen } = useCart();

  return (
    // Icono de carrito con badge de cantidad
    <div className="relative cursor-pointer" onClick={() => setIsSideCartOpen(true)}>
      <FaShoppingCart className="text-2xl text-gray-700" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {totalQuantity}
      </span>
    </div>
  )
}