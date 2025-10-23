import React from 'react';
import { FaMapMarkerAlt, FaTools } from 'react-icons/fa';

const GoogleMapComponent = ({ address }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg relative">
      {/* Cartel de En Desarrollo */}
      <div 
        className="w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
        style={{ 
          height: '400px', 
          width: '100%',
          minHeight: '400px',
        }}
      >
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <FaTools className="w-16 h-16 text-[#FF6B35] animate-pulse" />
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🚧 Mapa en Desarrollo
            </h3>
            <p className="text-gray-600 text-sm">
              Estamos trabajando en esta funcionalidad
            </p>
          </div>
        </div>
      </div>
        
      {/* Información de la dirección */}
      {address && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="w-4 h-4 text-[#FF6B35]" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{address}</p>
              <p className="text-gray-600 text-xs">Dirección ingresada</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
