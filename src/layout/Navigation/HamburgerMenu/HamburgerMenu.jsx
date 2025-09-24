import { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';

const categorias = [
  { id: 'cumple', nombre: 'Cumpleaños', color: '#FF5722' },
  { id: 'despedida', nombre: 'Despedida de soltera', color: '#FFC107' },
  { id: 'baby', nombre: 'Baby Shower', color: '#4CAF50' },
  { id: 'religion', nombre: 'Religión', color: '#F48FB1' },
  { id: 'fiestas', nombre: 'Fiestas Patrias', color: '#1976D2' },
];

export default function HamburgerMenu({ showMobileSearch, toggleMobileSearch }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();

  // Maneja el cierre del menú
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {/* Botón menú hamburguesa */}
      <button
        onClick={() => setOpen(!open)}
        className={`block md:hidden text-2xl text-gray-700 transform transition-transform duration-300 ease-in-out ${
          open ? 'rotate-90' : 'rotate-0'
        }`}
        aria-label="Abrir menú"
      >
        <FaBars />
      </button>

      {/* Overlay oscuro */}
      <div
        className={`fixed inset-0 bg-black z-20 transition-opacity duration-300 ease-in-out ${
          open ? 'bg-opacity-30 pointer-events-auto opacity-100' : 'bg-opacity-0 pointer-events-none opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Panel lateral del menú */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#FAF4E4] p-6 pt-4 z-30 transition-all duration-500 ease-in-out
          ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
        `}
        style={{ boxShadow: open ? '2px 0 16px rgba(0,0,0,0.10)' : 'none' }}
      >
        <div className="flex items-center justify-between mb-4">
          {/* Título del menú */}
          <span
            className="font-bold font-baloo text-xl text-gray-700 pl-1"
            style={{ letterSpacing: '0.03em' }}
          >
            Menu
          </span>
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="group p-2 -m-2 transition-transform duration-300"
            aria-label="Cerrar menú"
          >
            {/* SVG cruz animada con rotación - misma que el carrito */}
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
        <hr className="border-t border-gray-200 mb-8" />
        
        {/* Botón mostrar/ocultar buscador */}
        <div className="px-6 mb-6">
          <button
            onClick={() => {
              toggleMobileSearch();
              handleClose();
            }}
            className="w-full bg-[#FF6B35] hover:bg-[#E55A31] text-white font-baloo font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔍</span>
            <span>{showMobileSearch ? 'Ocultar buscador' : 'Mostrar buscador'}</span>
          </button>
        </div>

        {/* Navegación de categorías como texto colorido */}
        <nav className="flex flex-col gap-4 px-6 py-8">
          {categorias.map(cat => (
            <span
              key={cat.id}
              onClick={() => { navigate(`/category/${cat.id}`); handleClose(); }}
              style={{
                color: cat.color,
                fontWeight: 700,
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              className="hover:underline"
            >
              {cat.nombre}
            </span>
          ))}
        </nav>
        {/* Línea divisoria antes de los botones de cuenta */}
        <div className="border-b border-gray-200 my-6 mx-6" />
        {/* Botones de cuenta abajo de todo */}
        <div className="mt-auto px-6 pb-8 flex flex-col gap-2">
          <span
            onClick={() => { navigate('/users'); handleClose(); }}
            className="text-[#FF6B35] font-baloo font-bold text-base hover:underline transition-colors cursor-pointer"
          >
            Crear cuenta
          </span>
          <span
            onClick={() => { navigate('/users'); handleClose(); }}
            className="text-[#FF6B35] font-baloo font-bold text-base hover:underline transition-colors cursor-pointer"
          >
            Iniciar sesión
          </span>
        </div>
      </div>
    </>
  )
}