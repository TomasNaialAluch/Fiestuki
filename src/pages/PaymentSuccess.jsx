// src/pages/PaymentSuccess.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener parámetros de la URL
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  return (
    <div className="min-h-screen bg-[#FAF4E4] flex items-center justify-center px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-baloo text-gray-800 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600">
            Tu pago ha sido procesado correctamente
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-2">Detalles del Pago</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {paymentId && (
              <p><strong>ID de Pago:</strong> {paymentId}</p>
            )}
            {externalReference && (
              <p><strong>Referencia:</strong> {externalReference}</p>
            )}
            <p><strong>Estado:</strong> <span className="text-green-600 font-medium">Aprobado</span></p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#E55A31] text-white font-bold py-3 rounded-xl font-baloo text-lg hover:from-[#E55A31] hover:to-[#D04A21] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaHome className="w-5 h-5" />
            Volver al Inicio
          </button>
          
          <button
            onClick={() => navigate('/category/cumpleaños')}
            className="w-full bg-white hover:bg-gray-50 text-[#FF6B35] font-bold py-3 rounded-xl font-baloo text-lg transition-all duration-200 border-2 border-[#FF6B35] hover:border-[#E55A31] flex items-center justify-center gap-2"
          >
            <FaShoppingBag className="w-5 h-5" />
            Seguir Comprando
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Próximos pasos:</strong> Te contactaremos por WhatsApp para coordinar la entrega de tu pedido.
          </p>
        </div>
      </div>
    </div>
  );
}



