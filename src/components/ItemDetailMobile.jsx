import React from 'react';
import PaymentMethods from './PaymentMethods.jsx';

const ItemDetailMobile = ({ 
  item, 
  quantity, 
  setQuantity, 
  onAddToCart,
  allImages,
  selectedImage,
  onPrevImage,
  onNextImage,
  onSelectImage
}) => {
  const formatPrice = (price) => price?.toLocaleString();

  return (
    <div style={{
      padding: '10px',
      fontFamily: "'Baloo 2', sans-serif",
      background: '#faf4e4',
      minHeight: '100vh'
    }}>
      {/* Galería móvil */}
      <div style={{
        width: '100%',
        height: '350px',
        background: '#fff',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <img 
          src={allImages[selectedImage]}
          alt={item.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '15px'
          }}
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 107, 107, 0.9)',
                color: '#fff',
                fontSize: '16px'
              }}
            >
              ←
            </button>

            <button
              onClick={onNextImage}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 107, 107, 0.9)',
                color: '#fff',
                fontSize: '16px'
              }}
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Información del producto */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '20px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#333',
          margin: '0 0 15px 0'
        }}>
          {item.name}
        </h1>

        <div style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#ff6b6b',
          marginBottom: '20px'
        }}>
          ${formatPrice(item.price)} ARS
        </div>

        <PaymentMethods />

        {/* Controles de cantidad */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '20px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            style={{
              width: '50px',
              height: '50px',
              border: 'none',
              borderRadius: '12px',
              background: '#ff6b6b',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 700
            }}
          >
            −
          </button>
          
          <span style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#333',
            minWidth: '60px',
            textAlign: 'center'
          }}>
            {quantity}
          </span>
          
          <button
            onClick={() => setQuantity(quantity + 1)}
            style={{
              width: '50px',
              height: '50px',
              border: 'none',
              borderRadius: '12px',
              background: '#4ecdc4',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 700
            }}
          >
            +
          </button>
        </div>

        <button
          onClick={() => onAddToCart(quantity)}
          style={{
            width: '100%',
            padding: '18px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
            border: 'none',
            borderRadius: '15px',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          🛒 AGREGAR AL CARRITO
        </button>
      </div>
    </div>
  );
};

export default ItemDetailMobile;