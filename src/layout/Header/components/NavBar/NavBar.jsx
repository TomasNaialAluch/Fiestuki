import React, { useEffect } from 'react';
import CartWidget from '../CartWidget/CartWidget.jsx';
import Logo from '../Logo/Logo.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { useUI } from '../../../../context/UIContext.jsx';

import HamburgerMenu from '../../../Navigation/HamburgerMenu/HamburgerMenu.jsx';

export const NavBar = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const { isNavBarHidden, isNavBarScrolled, setIsNavBarScrolled } = useUI();
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/checkout');

  useEffect(() => {
    const handleScroll = () => {
      // Solo aplicar en desktop (pantallas >= 768px)
      if (window.innerWidth >= 768) {
        setIsNavBarScrolled(window.scrollY > 50);
      } else {
        setIsNavBarScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Verificar estado inicial
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsNavBarScrolled]);

  return (
    <nav className={`${isCheckout ? 'md:fixed' : 'fixed'} top-0 w-full z-10 bg-[#FAF4E4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] 
      translate-y-0 opacity-100 
      md:transition-all md:duration-500 ${
        isNavBarHidden ? 'md:-translate-y-full md:opacity-0' : 'md:translate-y-0 md:opacity-100'
      }`}>
      <div className={`max-w-7xl mx-auto flex items-center px-4 md:px-8 md:transition-all md:duration-300 ${
        // En mobile, forzar altura compacta en Checkout
        isCheckout ? 'h-16 md:h-20' : (isNavBarScrolled ? 'h-20 md:h-20' : 'h-20 md:h-52')
      }`}>

        {/* Bloque Desktop: Buscador a la izquierda (oculto en /search para evitar duplicado) */}
        <div className="hidden md:flex md:w-1/3 justify-start">
          {location.pathname !== '/search' ? (
            <SearchBar />
          ) : (
            // Reservamos el espacio para no desalinear logo/derecha
            <div className="h-9" />
          )}
        </div>

        {/* Bloque Desktop: Logo centrado */}
        <div className="flex-1 flex justify-center items-center">
          <Logo isScrolled={isNavBarScrolled} />
        </div>

        {/* Bloque Desktop: Links y carrito a la derecha */}
        <div className="hidden md:flex md:w-1/3 justify-end items-center">
          <div className="nav-links flex items-center gap-3 font-baloo font-medium text-sm uppercase tracking-wider text-[#F25C5C]">
            {user ? (
              // Usuario logueado
              <>
                <span className="font-bold text-[#F25C5C] font-baloo">
                  ¡Hola! {userProfile?.displayName || user.displayName || 'Usuario'}
                </span>
                <span>|</span>
                <Link to="/users" className="hover:opacity-80 transition-opacity">Mi Cuenta</Link>
                {isAdmin && (
                  <>
                    <span>|</span>
                    <Link to="/admin" className="hover:opacity-80 transition-opacity text-[#FF6B35] font-bold">
                      🛠️ Admin
                    </Link>
                  </>
                )}
              </>
            ) : (
              // Usuario no logueado
              <>
                <Link to="/users" className="hover:opacity-80 transition-opacity">Crear cuenta</Link>
                <span>|</span>
                <Link to="/users" className="hover:opacity-80 transition-opacity">Iniciar sesión</Link>
              </>
            )}
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