// src/pages/PaymentFailure.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

export default function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener parámetros de la URL
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <div className="min-h-screen bg-[#FAF4E4] flex items-center justify-center px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <FaExclamationTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-baloo text-gray-800 mb-2">
            Pago Rechazado
          </h1>
          <p className="text-gray-600">
            No pudimos procesar tu pago
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-red-800 mb-2">Información del Error</h3>
          <div className="text-sm text-red-700 space-y-1">
            <p>El pago fue rechazado por alguna de estas razones:</p>
            <ul className="list-disc list-inside text-left mt-2 space-y-1">
              <li>Fondos insuficientes</li>
              <li>Tarjeta vencida o bloqueada</li>
              <li>Datos incorrectos</li>
              <li>Límite de la tarjeta excedido</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#E55A31] text-white font-bold py-3 rounded-xl font-baloo text-lg hover:from-[#E55A31] hover:to-[#D04A21] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaRedo className="w-5 h-5" />
            Intentar Nuevamente
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white hover:bg-gray-50 text-[#FF6B35] font-bold py-3 rounded-xl font-baloo text-lg transition-all duration-200 border-2 border-[#FF6B35] hover:border-[#E55A31] flex items-center justify-center gap-2"
          >
            <FaHome className="w-5 h-5" />
            Volver al Inicio
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Alternativa:</strong> Podés pagar por transferencia bancaria con 5% de descuento.
          </p>
        </div>
      </div>
    </div>
  );
}



