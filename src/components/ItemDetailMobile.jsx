import React, { useState } from 'react';
import PaymentMethods from './PaymentMethods.jsx';
import { useCart } from '../context/CartContext';

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
  const { cart } = useCart();
  const [error, setError] = useState('');

  // Calcular cuántos ya hay en el carrito
  const cartItem = cart.find(prod => prod.id === item.id);
  const alreadyInCart = cartItem ? cartItem.quantity : 0;
  const stock = item.stock ?? 0;

  // Handler para agregar al carrito con validación de stock
  const handleAddToCart = (qty) => {
    if (qty + alreadyInCart > stock) {
      setError('No hay suficiente stock disponible');
      return;
    }
    setError('');
    onAddToCart(qty);
  };

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
            onClick={() => {
              if (quantity < stock - alreadyInCart) setQuantity(quantity + 1);
            }}
            disabled={quantity >= stock - alreadyInCart}
            style={{
              width: '50px',
              height: '50px',
              border: 'none',
              borderRadius: '12px',
              background: quantity >= stock - alreadyInCart ? '#ccc' : '#4ecdc4',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 700,
              cursor: quantity >= stock - alreadyInCart ? 'not-allowed' : 'pointer'
            }}
          >
            +
          </button>
        </div>

        <button
          onClick={() => handleAddToCart(quantity)}
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
        {error && (
          <div style={{ color: '#ff6b6b', fontWeight: 700, marginTop: 10, textAlign: 'center' }}>
            {error}
          </div>
        )}
        <div style={{ fontSize: 13, color: '#888', marginTop: 8, textAlign: 'center' }}>
          Stock disponible: {stock - alreadyInCart}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailMobile;