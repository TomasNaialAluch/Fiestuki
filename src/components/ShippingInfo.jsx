import React from 'react';

const ShippingInfo = () => {
  return (
    <div style={{
      border: '2px solid #e0e0e0',
      borderRadius: '15px',
      padding: '20px',
      background: '#fff'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <span style={{ fontSize: '20px' }}>📦</span>
        <span style={{ fontWeight: 600, color: '#333' }}>Medios de envío</span>
      </div>
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <input 
          type="text" 
          placeholder="Tu código postal"
          style={{
            flex: 1,
            padding: '10px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '16px'
          }}
        />
        <button style={{
          padding: '10px 20px',
          background: '#4ecdc4',
          border: 'none',
          borderRadius: '10px',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          CALCULAR
        </button>
      </div>
      <p style={{
        fontSize: '14px',
        color: '#666',
        margin: 0
      }}>
        Ingresá tu código postal para conocer los tiempos de entrega
      </p>
    </div>
  );
};

export default ShippingInfo;