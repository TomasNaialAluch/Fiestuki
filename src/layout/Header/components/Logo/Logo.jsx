import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoDesktop from '../../../../assets/logo/Logo tuki-03.png';
import logoMobile from '../../../../assets/logo/Logo tuki-04.png';

export const Logo = ({ size = 'medium', isScrolled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const smoothScrollToTop = () => {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 1500; // 1.5 segundos más lento

    const easeInOutBounce = (t) => {
      if (t < 0.5) {
        return 4 * t * t * t;
      } else {
        const f = 2 * t - 2;
        return 1 + (f * f * f) / 2;
      }
    };

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const easeProgress = easeInOutBounce(progress);
      const currentPosition = startPosition * (1 - easeProgress);

      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Mini rebote al final
        window.scrollTo({ top: -20, behavior: 'smooth' });
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (location.pathname === '/') {
      // Si estamos en home, scroll suave con rebote
      smoothScrollToTop();
    } else {
      // Si estamos en otra página, navegar y después scroll
      navigate('/');
      setTimeout(() => {
        smoothScrollToTop();
      }, 300);
    }
  };

  return (
    <Link to="/" onClick={handleLogoClick}>
      {/* Logo Desktop: cambia de tuki-03 a tuki-04 cuando hay scroll */}
      <img
        src={isScrolled ? logoMobile : logoDesktop}
        alt="Fiestuki logo"
        className={`hidden md:block object-contain mx-auto transition-all duration-300 hover:opacity-90 hover:scale-105 ${
          isScrolled ? 'h-28' : 'h-48'
        }`}
      />
      {/* Logo Mobile: siempre usa tuki-04 sin cambios */}
      <img
        src={logoMobile}
        alt="Fiestuki logo"
        className="md:hidden h-36 object-contain mx-auto transition-all duration-200 hover:opacity-90 hover:scale-105"
      />
    </Link>
  );
};

export default Logo;