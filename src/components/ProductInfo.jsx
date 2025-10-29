import React from 'react';
import PaymentMethods from './PaymentMethods.jsx';

const ProductInfo = ({ item, quantity, setQuantity, onAddToCart, error }) => {
  const formatPrice = (price) => price?.toLocaleString();

  return (
    <div className="product-info">
      <h1 style={{
        fontSize: '36px',
        fontWeight: 800,
        color: '#333',
        margin: '0 0 20px 0',
        lineHeight: '1.2'
      }}>
        {item.name}
      </h1>

      {/* Precio */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#ff6b6b',
          marginBottom: '5px'
        }}>
          ${formatPrice(item.price)} ARS
        </div>
      </div>

      {/* Métodos de pago */}
      <PaymentMethods />

      {/* Descripción del producto */}
      {(item.description || item.descripcion) && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#333',
            marginBottom: '10px'
          }}>
            Descripción
          </div>
          <div style={{
            background: '#ffffff',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            padding: '14px 16px',
            color: '#444',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap'
          }}>
            {item.description || item.descripcion}
          </div>
        </div>
      )}

      {/* Cantidad */}
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
              cursor: 'pointer'
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
              cursor: 'pointer'
            }}
            onClick={() => setQuantity(quantity + 1)}
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
            textTransform: 'uppercase'
          }}
          onClick={() => onAddToCart(quantity)}
        >
          🛒 AGREGAR AL CARRITO
        </button>
      </div>

      {error && <div className="text-red-500 font-bold mt-2">{error}</div>}
    </div>
  );
};

export default ProductInfo;