import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const GoogleMapComponent = ({ address }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga del mapa
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F25C5C]"></div>
          <span className="text-gray-600">Cargando mapa...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#FAF4E4] to-[#F0E6D2] relative">
      {/* Mapa simulado */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200">
        {/* Calles simuladas */}
        <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-300"></div>
        <div className="absolute left-1/3 top-0 bottom-0 w-2 bg-gray-300"></div>
        <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-400"></div>
        <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-gray-400"></div>
        
        {/* Marcador central con animación */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Círculo de pulso */}
            <div className="absolute inset-0 bg-[#FF6B35] rounded-full opacity-20 animate-ping"></div>
            <div className="absolute inset-2 bg-[#FF6B35] rounded-full opacity-40 animate-ping animation-delay-300"></div>
            
            {/* Marcador */}
            <div className="relative bg-[#FF6B35] text-white p-3 rounded-full shadow-lg animate-bounce">
              <FaMapMarkerAlt className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Información de la dirección */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="w-4 h-4 text-[#FF6B35]" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{address || 'Tu dirección'}</p>
              <p className="text-gray-600 text-xs">Ubicación confirmada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
