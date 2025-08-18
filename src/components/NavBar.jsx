// src/components/NavBar.jsx

import CartWidget from './CartWidget'
import logoDesktop from '../assets/logo/Logo tuki-03.png'
import logoMobile from '../assets/logo/Logo tuki-04.png'
import { FaSearch } from 'react-icons/fa'
import HamburgerMenu from './HamburgerMenu'
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-10 bg-[#FAF4E4]">
      <div className="max-w-7xl mx-auto flex items-center h-20 md:h-52 px-4 md:px-8">

        {/* Bloque Desktop: Buscador a la izquierda */}
        <div className="hidden md:flex md:w-1/3 justify-start">
          <div className="w-full max-w-[300px] relative">
            <input
              type="text"
              placeholder="Buscar"
              className="search-input w-full h-9 px-4 border border-gray-300 rounded-l-md bg-white focus:outline-none"
              style={{ borderRadius: '6px 0 0 6px' }}
            />
            <button
              className="search-button absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 border border-l-0 border-gray-300 rounded-r-md bg-white flex items-center justify-center"
              style={{ borderRadius: '0 6px 6px 0' }}
            >
              <FaSearch className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Bloque Desktop: Logo centrado */}
        <div className="flex-1 flex justify-center items-center">
          <Link to="/">
            <img
              src={logoDesktop}
              alt="Fiestuki logo"
              className="hidden md:block h-48 object-contain mx-auto"
            />
            <img
              src={logoMobile}
              alt="Fiestuki logo"
              className="md:hidden h-36 object-contain mx-auto"
            />
          </Link>
        </div>

        {/* Bloque Desktop: Links y carrito a la derecha */}
        <div className="hidden md:flex md:w-1/3 justify-end items-center">
          <div className="nav-links flex items-center gap-3 font-baloo font-medium text-sm uppercase tracking-wider text-[#F25C5C]">
            <a href="#" className="hover:opacity-80 transition-opacity">Crear cuenta</a>
            <span>|</span>
            <a href="#" className="hover:opacity-80 transition-opacity">Iniciar sesión</a>
            <span className="cart-widget relative ml-4">
              <CartWidget />
            </span>
          </div>
        </div>

        {/* Bloque Mobile */}
        <div className="flex items-center justify-between w-full md:hidden px-4">
          <HamburgerMenu />
          <Link to="/">
            <img
              src={logoMobile}
              alt="Fiestuki logo"
              className="h-36"
            />
          </Link>
          <CartWidget />
        </div>

      </div>
    </nav>
  )
}
