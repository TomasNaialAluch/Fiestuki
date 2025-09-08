import React from 'react';

const ProductThumbnails = ({ images, selectedImage, onSelectImage, isMobile }) => {
  const containerStyle = {
    display: isMobile ? 'flex' : 'grid',
    gridTemplateColumns: isMobile ? 'none' : 'repeat(auto-fill, minmax(80px, 1fr))',
    flexDirection: isMobile ? 'row' : 'none',
    overflowX: isMobile ? 'auto' : 'visible',
    overflowY: isMobile ? 'visible' : 'auto',
    gap: isMobile ? '8px' : '10px',
    maxHeight: isMobile ? '90px' : '200px',
    padding: '10px',
    background: '#fff',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    scrollBehavior: 'smooth'
  };

  const buttonStyle = (index) => ({
    width: isMobile ? '70px' : '80px',
    height: isMobile ? '70px' : '80px',
    minWidth: isMobile ? '70px' : 'auto',
    border: selectedImage === index ? '3px solid #ff6b6b' : '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '3px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    overflow: 'hidden',
    boxShadow: selectedImage === index ? '0 4px 12px rgba(255, 107, 107, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
    willChange: 'transform'
  });

  return (
    <div className="thumbnails-container" style={containerStyle}>
      {images.map((image, index) => (
        <button
          key={index}
          className="thumbnail-button"
          onClick={() => onSelectImage(index)}
          style={buttonStyle(index)}
        >
          <img 
            src={image}
            alt={`Vista ${index + 1}`}
            loading="lazy"
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
  );
};

export default ProductThumbnails;