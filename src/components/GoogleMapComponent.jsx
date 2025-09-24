import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';

const GoogleMapComponent = ({ address }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    // Función para geocodificar la dirección
    const geocodeAddress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Usar la API de geocodificación de Google Maps
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            setCoordinates({
              lat: location.lat(),
              lng: location.lng()
            });
            
            // Crear el mapa
            const map = new window.google.maps.Map(mapRef.current, {
              zoom: 15,
              center: location,
              mapTypeId: 'roadmap',
              styles: [
                {
                  featureType: 'all',
                  elementType: 'geometry.fill',
                  stylers: [{ color: '#f5f5f5' }]
                },
                {
                  featureType: 'water',
                  elementType: 'geometry.fill',
                  stylers: [{ color: '#c9c9c9' }]
                }
              ]
            });

            // Agregar marcador
            new window.google.maps.Marker({
              position: location,
              map: map,
              title: address,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#FF6B35"/>
                    <circle cx="20" cy="20" r="8" fill="white"/>
                    <circle cx="20" cy="20" r="4" fill="#FF6B35"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20)
              }
            });

            setIsLoading(false);
          } else {
            setError('No se pudo encontrar la ubicación');
            setIsLoading(false);
          }
        });
      } catch (err) {
        setError('Error al cargar el mapa');
        setIsLoading(false);
      }
    };

    // Verificar si Google Maps está cargado
    if (window.google && window.google.maps) {
      geocodeAddress();
    } else {
      // Cargar Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = geocodeAddress;
      script.onerror = () => {
        setError('Error al cargar Google Maps');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    }
  }, [address]);

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
          <span className="text-gray-600">Cargando mapa...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 bg-red-50 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-600">
          <FaExclamationTriangle className="w-8 h-8" />
          <span className="text-sm font-medium">{error}</span>
          <span className="text-xs text-gray-500">Verifica que la dirección sea correcta</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full"></div>
      
      {/* Información de la dirección */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="w-4 h-4 text-[#FF6B35]" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{address}</p>
            <p className="text-gray-600 text-xs">Ubicación confirmada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
