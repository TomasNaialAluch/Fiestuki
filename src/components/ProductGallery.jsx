import React from 'react';

const ProductGallery = ({ 
  allImages, 
  selectedImage, 
  onPrevImage, 
  onNextImage, 
  onSelectImage,
  itemName 
}) => {
  if (!allImages || allImages.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '500px',
        background: '#f5f5f5',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        Sin imágenes disponibles
      </div>
    );
  }

  return (
    <div className="gallery-section">
      {/* Imagen principal */}
      <div style={{
        width: '100%',
        height: '500px',
        background: '#fff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '20px'
      }}>
        <img 
          src={allImages[selectedImage]}
          alt={itemName}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '15px'
          }}
        />

        {/* Botones de navegación */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 107, 107, 0.9)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700
              }}
            >
              ←
            </button>

            <button
              onClick={onNextImage}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 107, 107, 0.9)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700
              }}
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {allImages.length > 1 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '10px',
          background: '#fff',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              style={{
                width: '80px',
                height: '80px',
                border: selectedImage === index ? '3px solid #ff6b6b' : '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '3px',
                background: '#fff',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              <img 
                src={image}
                alt={`Vista ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;