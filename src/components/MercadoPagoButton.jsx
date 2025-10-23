// src/components/MercadoPagoButton.jsx
import React, { useState } from 'react';
import { createPaymentPreference } from '../services/mercadopago';

export default function MercadoPagoButton({ orderData, onPaymentInitiated, onError }) {
  const [loading, setLoading] = useState(false);

  const handleMercadoPagoPayment = async () => {
    setLoading(true);
    
    try {
      // Crear preferencia de pago
      const result = await createPaymentPreference(orderData);
      
      if (result.success) {
        onPaymentInitiated?.(result.preferenceId);
        
        // Redirigir a MercadoPago
        window.location.href = result.initPoint;
      } else {
        onError?.(result.error);
      }
    } catch (error) {
      console.error('Error procesando pago MercadoPago:', error);
      onError?.('Error al procesar el pago. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMercadoPagoPayment}
      disabled={loading}
      className="w-full bg-[#009EE3] text-white font-bold py-4 px-6 rounded-lg font-medium text-lg disabled:opacity-50 hover:bg-[#0070BA] transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #009EE3 0%, #0070BA 100%)',
        boxShadow: '0 4px 15px rgba(0, 158, 227, 0.3)'
      }}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          Procesando...
        </>
      ) : (
        <>
          {/* Logo oficial de MercadoPago */}
          <svg 
            className="w-6 h-6" 
            viewBox="0 0 24 24" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="4" fill="white"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#009EE3"/>
          </svg>
          Continuar con MercadoPago
        </>
      )}
    </button>
  );
}
