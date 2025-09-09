import React from 'react';
import CartWidget from '../CartWidget/CartWidget.jsx';
import Logo from '../Logo/Logo.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import { Link } from 'react-router-dom';

import HamburgerMenu from '../../../Navigation/HamburgerMenu/HamburgerMenu.jsx';

export const NavBar = () => {
  return (
    <nav className="fixed top-0 w-full z-10 bg-[#FAF4E4]">
      <div className="max-w-7xl mx-auto flex items-center h-20 md:h-52 px-4 md:px-8">

        {/* Bloque Desktop: Buscador a la izquierda */}
        <div className="hidden md:flex md:w-1/3 justify-start">
          <SearchBar />
        </div>

        {/* Bloque Desktop: Logo centrado */}
        <div className="flex-1 flex justify-center items-center">
          <Logo />
        </div>

        {/* Bloque Desktop: Links y carrito a la derecha */}
        <div className="hidden md:flex md:w-1/3 justify-end items-center">
          <div className="nav-links flex items-center gap-3 font-baloo font-medium text-sm uppercase tracking-wider text-[#F25C5C]">
            <Link to="/users" className="hover:opacity-80 transition-opacity">Crear cuenta</Link>
            <span>|</span>
            <Link to="/users" className="hover:opacity-80 transition-opacity">Iniciar sesión</Link>
            <span className="cart-widget relative ml-4">
              <CartWidget />
            </span>
          </div>
        </div>

        {/* Bloque Mobile */}
        <div className="flex items-center justify-between w-full md:hidden px-4">
          <HamburgerMenu />
          <Logo />
          <CartWidget />
        </div>

      </div>
    </nav>
  )
}

export default NavBar;