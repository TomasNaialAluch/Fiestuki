import React, { useState, useRef } from 'react';
import { FaWhatsapp, FaInstagram, FaShare, FaCopy, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export default function ShareButton({ item }) {
  const [copied, setCopied] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const location = useLocation();
  
  // URL completa del producto
  const productUrl = `${window.location.origin}${location.pathname}`;
  
  // Mensaje para compartir
  const shareMessage = `¡Mira este producto de Fiestuki! 🎉\n\n${item.name || item.nombre}\n$${(item.price || item.precio)?.toLocaleString()}\n\n${productUrl}`;
  
  // Compartir en WhatsApp
  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const canvasRef = useRef(null);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [storyImageUrl, setStoryImageUrl] = useState(null);
  
  // Generar imagen tipo Story de Instagram
  const generateInstagramStory = async () => {
    setGeneratingStory(true);
    setShowInstagramModal(true);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas no disponible');
      setGeneratingStory(false);
      return;
    }
    
    // Dimensiones de Instagram Story (9:16)
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    
    // Obtener imagen principal siguiendo la misma lógica que ItemDetailContainer
    let mainImageUrl = '';
    
    // Prioridad: mainImage > primera imagen del array images > imagen
    if (item.mainImage) {
      mainImageUrl = item.mainImage;
    } else if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      // Si es array de objetos, extraer URL
      const firstImg = item.images[0];
      mainImageUrl = typeof firstImg === 'string' ? firstImg : (firstImg.url || firstImg);
    } else if (item.imagenes && Array.isArray(item.imagenes) && item.imagenes.length > 0) {
      const firstImg = item.imagenes[0];
      mainImageUrl = typeof firstImg === 'string' ? firstImg : (firstImg.url || firstImg);
    } else if (item.imagen) {
      mainImageUrl = item.imagen;
    }
    
    console.log('Imagen principal encontrada:', mainImageUrl);
    console.log('Item completo:', item);
    
    // Función auxiliar para renderizar el canvas con una imagen
    const renderCanvas = (img) => {
      const ctx = canvas.getContext('2d');
      const width = 1080;
      const height = 1920;
      
      // Fondo con gradiente
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#FAF4E4');
      gradient.addColorStop(1, '#FFE5D4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Imagen del producto
      const imgWidth = width;
      const imgHeight = height * 0.65;
      const imgY = 0;
      
      const imgAspect = img.width / img.height;
      const targetAspect = imgWidth / imgHeight;
      
      let drawWidth = imgWidth;
      let drawHeight = imgHeight;
      let drawX = 0;
      let drawY = imgY;
      
      if (imgAspect > targetAspect) {
        drawHeight = imgWidth / imgAspect;
        drawY = imgY + (imgHeight - drawHeight) / 2;
      } else {
        drawWidth = imgHeight * imgAspect;
        drawX = (imgWidth - drawWidth) / 2;
      }
      
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      // Overlay para texto
      const textOverlay = ctx.createLinearGradient(0, imgHeight * 0.5, 0, imgHeight);
      textOverlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
      textOverlay.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = textOverlay;
      ctx.fillRect(0, imgHeight * 0.5, imgWidth, imgHeight * 0.5);
      
      // Sección inferior con información
      const infoY = imgHeight;
      const infoHeight = height - imgHeight;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, infoY, width, infoHeight);
      
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold 80px "Baloo 2", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('FIESTUKI', width / 2, infoY + 40);
      
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 64px "Baloo 2", sans-serif';
      const productName = item.name || item.nombre || 'Producto';
      const maxWidth = width - 120;
      const lineHeight = 80;
      const lines = [];
      const words = productName.split(' ');
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
      
      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, infoY + 180 + (index * lineHeight));
      });
      
      const price = `$${(item.price || item.precio)?.toLocaleString()}`;
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold 72px "Baloo 2", sans-serif';
      ctx.fillText(price, width / 2, infoY + 180 + (lines.length * lineHeight) + 40);
      
      ctx.fillStyle = '#666666';
      ctx.font = '32px "Baloo 2", sans-serif';
      ctx.fillText('fiestuki.com', width / 2, height - 100);
      
      const imageUrl = canvas.toDataURL('image/png');
      setStoryImageUrl(imageUrl);
      setGeneratingStory(false);
    };
    
    // Cargar imagen del producto directamente
    // Firebase Storage tiene restricciones CORS, así que usaremos un proxy CORS directamente
    const productImage = new Image();
    
    // Timeout para evitar carga infinita
    const timeout = setTimeout(() => {
      console.warn('Timeout cargando imagen, usando fallback');
      if (!storyImageUrl) {
        fallbackRender();
      }
    }, 10000); // 10 segundos máximo
    
    let imageLoaded = false;
    
    const loadImage = (imageUrl) => {
      // Si es Firebase Storage, usar proxy CORS directamente (sabemos que directo falla por CORS)
      if (imageUrl.includes('firebasestorage') || imageUrl.includes('firebase')) {
        console.log('Usando proxy CORS para Firebase Storage...');
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
        
        const proxiedImage = new Image();
        proxiedImage.crossOrigin = 'anonymous';
        
        proxiedImage.onload = () => {
          if (imageLoaded) return;
          imageLoaded = true;
          clearTimeout(timeout);
          console.log('Imagen cargada desde proxy, dimensiones:', proxiedImage.width, 'x', proxiedImage.height);
          try {
            renderCanvas(proxiedImage);
          } catch (error) {
            console.error('Error renderizando canvas desde proxy:', error);
            fallbackRender();
          }
        };
        
        proxiedImage.onerror = (error) => {
          clearTimeout(timeout);
          console.error('Error cargando imagen desde proxy:', error);
          console.error('URL del proxy:', proxyUrl);
          console.error('URL original:', imageUrl);
          fallbackRender();
        };
        
        proxiedImage.src = proxyUrl;
        return;
      }
      
      // Para otras URLs, cargar directamente
      productImage.crossOrigin = 'anonymous';
      
      productImage.onload = () => {
        if (imageLoaded) return;
        imageLoaded = true;
        clearTimeout(timeout);
        console.log('Imagen cargada correctamente, dimensiones:', productImage.width, 'x', productImage.height);
        
        try {
          renderCanvas(productImage);
        } catch (error) {
          console.error('Error renderizando canvas:', error);
          fallbackRender();
        }
      };
      
      productImage.onerror = (error) => {
        if (imageLoaded) return;
        clearTimeout(timeout);
        console.error('Error cargando imagen:', error);
        console.error('URL intentada:', imageUrl);
        fallbackRender();
      };
      
      productImage.src = imageUrl;
    };
    
    const fallbackRender = () => {
      const ctx = canvas.getContext('2d');
      const width = 1080;
      const height = 1920;
      
      // Si falla la carga de imagen, usar fondo sólido
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#FAF4E4');
      gradient.addColorStop(1, '#FFE5D4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Continuar con el texto
      const infoY = height * 0.6;
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold 80px "Baloo 2", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FIESTUKI', width / 2, 40);
      
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 64px "Baloo 2", sans-serif';
      const productName = item.name || item.nombre || 'Producto';
      const maxWidth = width - 120;
      const lines = [];
      const words = productName.split(' ');
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
      
      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, infoY + 180 + (index * 80));
      });
      
      const price = `$${(item.price || item.precio)?.toLocaleString()}`;
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold 72px "Baloo 2", sans-serif';
      ctx.fillText(price, width / 2, infoY + 180 + (lines.length * 80) + 40);
      
      const imageUrl = canvas.toDataURL('image/png');
      setStoryImageUrl(imageUrl);
      setGeneratingStory(false);
    };
    
    if (mainImageUrl) {
      loadImage(mainImageUrl);
    } else {
      console.warn('No se encontró imagen principal, usando fallback');
      productImage.onerror();
    }
  };
  
  // Descargar imagen Story
  const downloadStory = () => {
    if (!storyImageUrl) return;
    
    const link = document.createElement('a');
    link.download = `fiestuki-${(item.name || item.nombre || 'producto').toLowerCase().replace(/\s+/g, '-')}-story.png`;
    link.href = storyImageUrl;
    link.click();
  };
  
  // Compartir imagen Story (usando Web Share API si está disponible)
  const shareStory = async () => {
    if (!storyImageUrl) return;
    
    try {
      // Convertir data URL a blob
      const response = await fetch(storyImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'fiestuki-story.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${item.name || item.nombre} - Fiestuki`,
          text: `¡Mira este producto de Fiestuki! 🎉`,
          files: [file]
        });
      } else {
        // Fallback: descargar
        downloadStory();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Fallback: descargar
        downloadStory();
      }
    }
  };
  
  // Copiar link para Instagram
  const handleShareInstagram = () => {
    generateInstagramStory();
  };
  
  // Copiar link directamente
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };
  
  // Compartir genérico (usa Web Share API del navegador)
  const handleShareGeneric = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.name || item.nombre,
          text: shareMessage,
          url: productUrl
        });
      } else {
        // Si no está disponible, copiar al portapapeles
        handleCopyLink();
      }
    } catch (error) {
      // Si el usuario cancela, no hacer nada
      if (error.name !== 'AbortError') {
        console.error('Error al compartir:', error);
      }
    }
  };

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        border: '2px solid #e0e0e0',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div className="flex items-center gap-2 mb-3">
          <FaShare className="text-[#FF6B35]" style={{ fontSize: '20px' }} />
          <span className="font-baloo font-bold text-gray-800" style={{ fontSize: '18px' }}>
            Compartir producto
          </span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {/* WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            style={{
              flex: '1',
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: '#25D366',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: "'Baloo 2', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#20BA5A'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#25D366'}
          >
            <FaWhatsapp style={{ fontSize: '18px' }} />
            <span>WhatsApp</span>
          </button>
          
          {/* Instagram */}
          <button
            onClick={handleShareInstagram}
            style={{
              flex: '1',
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: "'Baloo 2', sans-serif",
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              boxShadow: '0 2px 8px rgba(188, 24, 136, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <FaInstagram style={{ fontSize: '18px' }} />
            <span>Instagram</span>
          </button>
          
          {/* Copiar link */}
          <button
            onClick={handleCopyLink}
            style={{
              flex: '1',
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: copied ? '#10b981' : '#FF6B35',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: "'Baloo 2', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: copied ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(255, 107, 53, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!copied) e.currentTarget.style.background = '#E55A31';
            }}
            onMouseLeave={(e) => {
              if (!copied) e.currentTarget.style.background = '#FF6B35';
            }}
          >
            {copied ? (
              <>
                <FaCheck style={{ fontSize: '18px' }} />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <FaCopy style={{ fontSize: '18px' }} />
                <span>Copiar link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas oculto para generar la imagen */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Modal de Instagram Story */}
      {showInstagramModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => {
            setShowInstagramModal(false);
            setStoryImageUrl(null);
          }}
        >
          <div
            style={{
              background: '#FAF4E4',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowInstagramModal(false);
                setStoryImageUrl(null);
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                color: '#666',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e0e0e0'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <FaTimes />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📸</div>
              <h3 style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 800,
                fontSize: '24px',
                color: '#333',
                marginBottom: '10px'
              }}>
                {generatingStory ? 'Generando tu Story...' : '¡Tu Story está lista!'}
              </h3>
              <p style={{
                fontFamily: "'Baloo 2', sans-serif",
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {generatingStory 
                  ? 'Creando una imagen perfecta para Instagram Stories' 
                  : 'Descarga la imagen y compártela en tus Stories'}
              </p>
            </div>

            {generatingStory && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                fontFamily: "'Baloo 2', sans-serif",
                color: '#666'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #FF6B35',
                  borderTop: '4px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px'
                }} />
                <p>Generando imagen...</p>
              </div>
            )}

            {storyImageUrl && !generatingStory && (
              <>
                {/* Preview de la Story */}
                <div style={{
                  background: '#fff',
                  borderRadius: '15px',
                  padding: '10px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src={storyImageUrl}
                    alt="Instagram Story"
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Instrucciones */}
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '2px solid #e0e0e0'
                }}>
                  <p style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontSize: '14px',
                    color: '#444',
                    lineHeight: '1.8',
                    margin: 0,
                    fontWeight: 600
                  }}>
                    📱 <strong>Pasos para compartir:</strong>
                  </p>
                  <ol style={{
                    margin: '10px 0 0 0',
                    paddingLeft: '20px',
                    fontFamily: "'Baloo 2', sans-serif",
                    fontSize: '14px',
                    color: '#444',
                    lineHeight: '2'
                  }}>
                    <li>Descarga la imagen</li>
                    <li>Abre Instagram</li>
                    <li>Ve a Stories y sube la imagen</li>
                    <li>¡Comparte y disfruta! 🎉</li>
                  </ol>
                </div>

                {/* Botones de acción */}
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <button
                    onClick={downloadStory}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontFamily: "'Baloo 2', sans-serif",
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(188, 24, 136, 0.3)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <FaDownload />
                    <span>Descargar Story</span>
                  </button>

                  <button
                    onClick={shareStory}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#FF6B35',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontFamily: "'Baloo 2', sans-serif",
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#E55A31'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B35'}
                  >
                    <FaShare />
                    <span>Compartir directamente</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

