import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { useUI } from '../../context/UIContext';

const Footer = () => {
  const navigate = useNavigate();
  const { search, clearSearch } = useSearch();
  const { addNotification } = useUI();
  
  const categorias = [
    { id: 'cumpleaños', nombre: 'Cumpleaños', emoji: '🎂' },
    { id: 'despedida', nombre: 'Despedida', emoji: '👋' },
    { id: 'baby-shower', nombre: 'Baby Shower', emoji: '👶' },
    { id: 'religion', nombre: 'Religión', emoji: '⛪' },
    { id: 'fiestas-patrias', nombre: 'Fiestas Patrias', emoji: '🇦🇷' }
  ];

  // Función de scroll suave (igual que el logo)
  const smoothScrollToTop = () => {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 1500; // 1.5 segundos

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

  // Manejar click en categoría
  const handleCategoryClick = (categoryId) => {
    // Navegar a la categoría
    navigate(`/category/${categoryId}`);
    
    // Scroll suave después de un pequeño delay
    setTimeout(() => {
      smoothScrollToTop();
    }, 300);
  };

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #f4c2a1 0%, #f7e7ce 30%, #e8f4f8 70%, #d4e8fc 100%)',
      padding: '60px 20px 30px',
      marginTop: '80px',
      fontFamily: "'Baloo 2', Inter, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decoraciones flotantes más sutiles */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        left: '10%',
        fontSize: '35px',
        opacity: 0.15,
        animation: 'float 3s ease-in-out infinite'
      }}>🎈</div>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '15%',
        fontSize: '30px',
        opacity: 0.2,
        animation: 'float 2.5s ease-in-out infinite reverse'
      }}>🎉</div>
      
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '5%',
        fontSize: '28px',
        opacity: 0.15,
        animation: 'float 4s ease-in-out infinite'
      }}>🎂</div>
      
      <div style={{
        position: 'absolute',
        bottom: '60px',
        right: '8%',
        fontSize: '25px',
        opacity: 0.2,
        animation: 'float 3.5s ease-in-out infinite reverse'
      }}>🎊</div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Logo y descripción */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            fontSize: '42px',
            marginBottom: '10px'
          }}>
            🐕🎉
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#5a5a5a',
            margin: '0 0 15px 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            FIESTUKI
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b6b6b',
            fontWeight: 600,
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.5'
          }}>
            ¡Hacemos que cada celebración sea inolvidable! 🎈✨
          </p>
        </div>

        {/* Secciones del footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Categorías */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#4a4a4a',
              marginBottom: '20px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
            }}>
              🎯 Categorías
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {categorias.map((categoria, index) => (
                <li key={index} style={{
                  marginBottom: '10px'
                }}>
                  <span 
                    onClick={() => handleCategoryClick(categoria.id)}
                    style={{
                      color: '#5a5a5a',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      display: 'block',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.4)';
                      e.target.style.transform = 'translateX(5px)';
                      e.target.style.color = '#3a3a3a';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                      e.target.style.color = '#5a5a5a';
                    }}
                  >
                    {categoria.emoji} {categoria.nombre}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#4a4a4a',
              marginBottom: '20px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
            }}>
              📞 Contacto
            </h3>
            <div style={{
              color: '#5a5a5a',
              fontSize: '15px',
              fontWeight: 600,
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
              lineHeight: '1.8'
            }}>
              <p style={{ margin: '0 0 10px 0' }}>📱 WhatsApp: +54 9 297 421-8265</p>
              <p style={{ margin: '0 0 10px 0' }}>📧 Email: hola@fiestuki.com</p>
              <p style={{ margin: '0 0 10px 0' }}>📍 Buenos Aires, Argentina</p>
              <p style={{ margin: '0 0 10px 0' }}>🕐 Lun a Vie: 9:00 - 18:00</p>
            </div>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#4a4a4a',
              marginBottom: '20px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
            }}>
              🌟 Síguenos
            </h3>
            <div style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              {[
                { emoji: '📘', name: 'Facebook', color: '#1877f2' },
                { emoji: '📷', name: 'Instagram', color: '#e4405f' },
                { emoji: '🐦', name: 'Twitter', color: '#1da1f2' },
                { emoji: '💬', name: 'WhatsApp', color: '#25d366' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  style={{
                    display: 'inline-block',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: social.color,
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                    opacity: 0.9
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                    e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.25)';
                    e.target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)';
                    e.target.style.opacity = '0.9';
                  }}
                  title={social.name}
                >
                  {social.emoji}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '2px solid rgba(0,0,0,0.1)',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#4a4a4a',
            fontSize: '15px',
            fontWeight: 600,
            margin: 0,
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
          }}>
            © 2024 Fiestuki - ¡Creando momentos mágicos! ✨🎉
          </p>
          <p style={{
            color: '#6b6b6b',
            fontSize: '13px',
            fontWeight: 500,
            margin: '5px 0 0 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
          }}>
            Hecho con 💖 para hacer tus fiestas inolvidables
          </p>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @media (max-width: 768px) {
          footer {
            padding: 40px 15px 20px !important;
          }
          
          footer h2 {
            font-size: 24px !important;
          }
          
          footer h3 {
            font-size: 16px !important;
          }
          
          footer p, footer a {
            font-size: 13px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;