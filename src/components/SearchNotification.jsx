import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { useUI } from '../context/UIContext';

export default function SearchNotification() {
  const { search, clearSearch } = useSearch();
  const { addNotification } = useUI();
  const [showModal, setShowModal] = useState(false);

  // No mostrar notificación automática, solo la notificación flotante

  // Función para mostrar modal de confirmación
  const handleClearSearch = () => {
    setShowModal(true);
  };

  // Función para confirmar limpiar búsqueda
  const confirmClearSearch = () => {
    clearSearch();
    setShowModal(false);
    addNotification('✨ Búsqueda limpiada', 'success');
  };

  // Función para cancelar
  const cancelClearSearch = () => {
    setShowModal(false);
  };

  // No mostrar nada si no hay búsqueda
  if (!search || search.trim() === '') {
    return null;
  }

  return (
    <>
      {/* Notificación flotante naranja */}
      <div className="fixed bottom-4 right-4 z-50 bg-[#FF6B35] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-2 border-white">
        <div className="text-2xl">🔍</div>
        <div className="flex flex-col">
          <span className="text-sm font-baloo font-bold">
            Búsqueda activa
          </span>
          <span className="text-xs font-baloo opacity-90">
            "{search}"
          </span>
        </div>
        <button
          onClick={handleClearSearch}
          className="bg-white text-[#FF6B35] px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg"
        >
          ✕ Limpiar
        </button>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF4E4] rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-[#FF6B35]">
            {/* Header del modal */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-baloo font-bold text-gray-800 mb-2">
                ¿Limpiar búsqueda?
              </h3>
              <p className="text-gray-600 font-baloo">
                Estás buscando: <span className="font-bold text-[#FF6B35]">"{search}"</span>
              </p>
            </div>

            {/* Contenido del modal */}
            <div className="bg-white rounded-xl p-4 mb-6 border-2 border-gray-200">
              <p className="text-gray-700 font-baloo text-center">
                Si limpias la búsqueda, verás todos los productos disponibles en esta categoría.
              </p>
            </div>

            {/* Botones del modal */}
            <div className="flex gap-3">
              <button
                onClick={cancelClearSearch}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-baloo font-bold py-3 px-4 rounded-xl transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmClearSearch}
                className="flex-1 bg-[#FF6B35] hover:bg-[#E55A31] text-white font-baloo font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg"
              >
                ✨ Limpiar búsqueda
              </button>
            </div>

            {/* Decoración del modal */}
            <div className="absolute -top-2 -right-2 text-3xl opacity-20">🎉</div>
            <div className="absolute -bottom-2 -left-2 text-3xl opacity-20">🎈</div>
          </div>
        </div>
      )}
    </>
  );
}
