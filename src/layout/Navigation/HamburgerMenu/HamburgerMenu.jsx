import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';

const categorias = [
  { id: 'cumple', nombre: 'Cumpleaños', color: '#FF5722' },
  { id: 'despedida', nombre: 'Despedida de soltera', color: '#FFC107' },
  { id: 'baby', nombre: 'Baby Shower', color: '#4CAF50' },
  { id: 'religion', nombre: 'Religión', color: '#F48FB1' },
  { id: 'fiestas', nombre: 'Fiestas Patrias', color: '#1976D2' },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const navigate = useNavigate();

  // Maneja la animación de giro al cerrar el menú
  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 300)
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
        className={`fixed inset-y-0 left-0 w-64 bg-white p-6 pt-4 z-30 transition-all duration-500 ease-in-out
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
            className={`p-3 ml-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none
              transition-transform duration-300 ease-in-out
              ${closing ? 'rotate-90' : 'rotate-0'}
            `}
            aria-label="Cerrar menú"
          >
            <FaTimes size={28} />
          </button>
        </div>
        <hr className="border-t border-gray-200 mb-8" />
        <div className="mt-8 flex flex-col items-center">
          <p className="text-lg font-semibold text-gray-700 mb-2">Menú en construcción</p>
          <span className="text-sm text-gray-400">¡Pronto vas a poder navegar desde acá!</span>
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