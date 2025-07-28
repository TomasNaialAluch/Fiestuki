import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

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
      </div>
    </>
  )
}
