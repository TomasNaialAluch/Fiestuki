import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SideCart({ open, onClose }) {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError('¡Agregá al menos un producto antes de ir al checkout!');
      return;
    }
    setError('');
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ease-in-out ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* SideCart */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-80 bg-white rounded-l-2xl shadow-2xl z-50 flex flex-col
          transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b">
          <h2 className="text-2xl font-bold font-baloo text-gray-800">Carrito</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="group p-2 -m-2 transition-transform duration-300"
          >
            {/* SVG cruz animada con rotación */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              className="stroke-gray-400 group-hover:stroke-[#FF6B35] transition-colors duration-200 group-hover:rotate-90 transform"
              style={{ display: 'block', transition: 'transform 0.3s' }}
            >
              <line x1="8" y1="8" x2="24" y2="24" strokeWidth="3" strokeLinecap="round" />
              <line x1="24" y1="8" x2="8" y2="24" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {cart.length === 0 ? (
            <span className="text-gray-500 text-center mt-8">El carrito está vacío</span>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-semibold">{item.name || item.nombre}</span>
                    <span className="ml-2 text-sm text-gray-500">x{item.quantity}</span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              {/* Texto para vaciar el carrito */}
              <button
                onClick={clearCart}
                className="mt-4 text-[#FF6B35] font-baloo font-bold text-base hover:underline transition-colors self-center"
                disabled={cart.length === 0}
              >
                Vaciar el carrito
              </button>
            </>
          )}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t font-bold text-lg flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
          {error && (
            <div className="text-red-500 text-center font-normal text-base mb-2">{error}</div>
          )}
          <button
            className="mt-2 w-full bg-[#FF6B35] hover:bg-[#E55A31] text-white font-baloo font-bold py-3 rounded-xl transition-colors duration-200 text-base shadow"
            onClick={handleCheckout}
          >
            Ir al checkout
          </button>
        </div>
      </aside>
    </>
  );
}