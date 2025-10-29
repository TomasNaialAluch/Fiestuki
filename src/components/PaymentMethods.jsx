import React from 'react';

const PaymentMethods = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #74c0fc 0%, #ffd93d 100%)',
      padding: '20px',
      borderRadius: '15px',
      marginBottom: '30px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <span style={{ fontSize: '20px' }}>💳</span>
        <span style={{ fontWeight: 600, color: '#333' }}>Medios de pago</span>
      </div>
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {['💰 Transferencia', '💳 Mercado Pago'].map((method, index) => (
          <span key={index} style={{
            background: '#fff',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            {method}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;