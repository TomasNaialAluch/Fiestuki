import React from 'react';

const ProductActions = ({ quantity, setQuantity, onAddToCart, maxStock = 10 }) => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{
        fontSize: '18px',
        fontWeight: 600,
        color: '#333',
        marginBottom: '15px'
      }}>
        CANTIDAD
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px',
        background: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '12px',
        border: '2px solid #e0e0e0',
        width: 'fit-content'
      }}>
        <button
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '8px',
            background: '#ff6b6b',
            color: '#fff',
            fontSize: '20px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease'
          }}
          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        >
          −
        </button>
        
        <span style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#333',
          minWidth: '40px',
          textAlign: 'center'
        }}>
          {quantity}
        </span>
        
        <button
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '8px',
            background: '#4ecdc4',
            color: '#fff',
            fontSize: '20px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease'
          }}
          onClick={() => quantity < maxStock && setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>

      <button
        style={{
          width: '100%',
          padding: '18px',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
          border: 'none',
          borderRadius: '15px',
          color: '#fff',
          fontSize: '20px',
          fontWeight: 700,
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onClick={() => onAddToCart(quantity)}
      >
        🛒 AGREGAR AL CARRITO
      </button>
    </div>
  );
};

export default ProductActions;