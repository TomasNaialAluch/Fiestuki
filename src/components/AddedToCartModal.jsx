import { FaCheckCircle, FaShoppingCart } from 'react-icons/fa';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';

export default function AddedToCartModal() {
  const { addedProduct, hideAddedProductModal } = useUI();
  const navigate = useNavigate();

  if (!addedProduct) return null;

  const handleContinueShopping = () => {
    hideAddedProductModal();
  };

  const handleGoToCheckout = () => {
    hideAddedProductModal();
    navigate('/checkout');
  };

  // Obtener la imagen principal del producto
  const mainImage = addedProduct.mainImage || addedProduct.imagen || '';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={hideAddedProductModal}
      >
        {/* Modal */}
        <div
          className="bg-[#FAF4E4] rounded-3xl shadow-2xl max-w-md w-full animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con ícono de éxito */}
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#E55A31] rounded-t-3xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white rounded-full p-3 animate-bounce">
                <FaCheckCircle className="text-[#FF6B35] text-4xl" />
              </div>
            </div>
            <h2 className="text-white font-baloo font-bold text-2xl">
              ¡Agregado al carrito! 🎉
            </h2>
          </div>

          {/* Contenido - Detalles del producto */}
          <div className="p-6">
            <div className="flex gap-4 items-center bg-white rounded-2xl p-4 shadow-md mb-6">
              {/* Imagen del producto */}
              {mainImage && (
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={mainImage}
                    alt={addedProduct.name || addedProduct.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Info del producto */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                  {addedProduct.name || addedProduct.nombre}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full font-semibold">
                    x{addedProduct.addedQuantity}
                  </span>
                  <span className="font-bold text-[#FF6B35] text-base">
                    ${(addedProduct.price * addedProduct.addedQuantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3">
              {/* Botón Ir a Checkout - Principal */}
              <button
                onClick={handleGoToCheckout}
                className="w-full bg-[#FF6B35] hover:bg-[#E55A31] text-white font-baloo font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
              >
                <FaShoppingCart className="text-xl" />
                Ir a Checkout
              </button>

              {/* Botón Continuar Comprando - Secundario */}
              <button
                onClick={handleContinueShopping}
                className="w-full bg-white hover:bg-gray-50 text-[#FF6B35] font-baloo font-bold py-4 px-6 rounded-xl transition-all duration-200 border-2 border-[#FF6B35] hover:border-[#E55A31] transform hover:scale-105 text-lg"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

