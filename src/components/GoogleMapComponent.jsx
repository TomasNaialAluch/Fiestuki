import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';

const GoogleMapComponent = ({ address }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const mapRef = useRef(null);
  const [mapElement, setMapElement] = useState(null);

  // Callback ref para asegurar que el elemento se conecte
  const mapRefCallback = (element) => {
    console.log('🔗 ===== CALLBACK REF EJECUTADO =====');
    console.log('📍 Element recibido:', element);
    console.log('📍 Element type:', typeof element);
    console.log('📍 Element tagName:', element?.tagName);
    console.log('📍 Element id:', element?.id);
    console.log('📍 Element className:', element?.className);
    
    mapRef.current = element;
    setMapElement(element);
    
    if (element) {
      console.log('✅ ===== ELEMENTO CONECTADO EXITOSAMENTE =====');
      console.log('📍 mapRef.current actualizado:', mapRef.current);
    } else {
      console.log('❌ ===== ELEMENTO DESCONECTADO =====');
    }
  };

  // Log cuando el componente recibe una nueva dirección
  useEffect(() => {
    console.log('🗺️ GoogleMapComponent recibió dirección:', address);
    console.log('📍 Tipo de dirección:', typeof address);
    console.log('📍 Longitud de dirección:', address ? address.length : 'null');
  }, [address]);

  // useEffect para verificar el elemento del mapa después del renderizado
  useEffect(() => {
    console.log('🔍 ===== VERIFICANDO ELEMENTO DESPUÉS DEL RENDER =====');
    console.log('📍 mapRef después del render:', mapRef);
    console.log('📍 mapRef.current después del render:', mapRef.current);
    console.log('📍 document.getElementById("google-map-container"):', document.getElementById('google-map-container'));
    console.log('📍 document.querySelector("[data-map-container]"):', document.querySelector('[data-map-container]'));
    console.log('📍 document.querySelector("#google-map-container"):', document.querySelector('#google-map-container'));
    console.log('📍 Todos los divs en el documento:', document.querySelectorAll('div'));
    console.log('📍 Todos los elementos con ID:', document.querySelectorAll('[id]'));
  }, []);

  // useEffect para inicializar el mapa fijo
  useEffect(() => {
    console.log('🗺️ ===== INICIANDO CARGA DEL MAPA =====');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🔍 Estado inicial - isLoading:', isLoading, 'error:', error);
    console.log('📍 mapRef.current:', mapRef.current);
    console.log('🌐 window.google:', !!window.google);
    console.log('🗺️ window.google.maps:', !!(window.google && window.google.maps));
    
    const initializeMap = () => {
      console.log('🚀 ===== INICIALIZANDO MAPA =====');
      console.log('🔍 Verificando Google Maps API...');
      
      // Cargar Google Maps si no está disponible
      if (!window.google || !window.google.maps) {
        console.log('📡 ===== CARGANDO GOOGLE MAPS API =====');
        console.log('🔗 URL del script:', `https://maps.googleapis.com/maps/api/js?key=AIzaSyAas9KthJKkzY3FYHIKK3CSjugiGf15bT8&libraries=places,geocoding&loading=async`);
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAas9KthJKkzY3FYHIKK3CSjugiGf15bT8&libraries=places,geocoding&loading=async`;
        script.async = true;
        script.defer = true;
        
        console.log('📝 Script creado:', script);
        console.log('📝 Script src:', script.src);
        console.log('📝 Script async:', script.async);
        console.log('📝 Script defer:', script.defer);
        
        script.onload = () => {
          console.log('✅ ===== GOOGLE MAPS API CARGADO EXITOSAMENTE =====');
          console.log('🌐 window.google después de carga:', !!window.google);
          console.log('🗺️ window.google.maps después de carga:', !!(window.google && window.google.maps));
          console.log('⏰ Esperando 1000ms antes de crear mapa...');
          setTimeout(createMap, 1000);
        };
        
        script.onerror = (err) => {
          console.error('❌ ===== ERROR AL CARGAR GOOGLE MAPS =====');
          console.error('💥 Error details:', err);
          console.error('📝 Script src que falló:', script.src);
          setError('Error al cargar Google Maps');
          setIsLoading(false);
        };
        
        console.log('📤 Agregando script al head...');
        document.head.appendChild(script);
        console.log('✅ Script agregado al head');
        
      } else {
        console.log('✅ ===== GOOGLE MAPS YA ESTÁ CARGADO =====');
        console.log('🌐 window.google:', !!window.google);
        console.log('🗺️ window.google.maps:', !!(window.google && window.google.maps));
        console.log('⏰ Esperando 1000ms antes de crear mapa...');
        setTimeout(createMap, 1000);
      }
    };

    const createMap = () => {
      console.log('🔧 ===== CREANDO MAPA =====');
      console.log('🔍 Verificando elemento del mapa...');
      console.log('📍 mapRef:', mapRef);
      console.log('📍 mapRef.current:', mapRef.current);
      console.log('📍 mapElement:', mapElement);
      console.log('📍 Tipo de mapRef.current:', typeof mapRef.current);
      console.log('📍 mapRef.current === null:', mapRef.current === null);
      console.log('📍 mapRef.current === undefined:', mapRef.current === undefined);
      
      // Intentar usar mapElement si mapRef.current no está disponible
      const elementToUse = mapRef.current || mapElement;
      console.log('📍 elementToUse:', elementToUse);
      
      if (!elementToUse) {
        console.log('❌ ===== ELEMENTO DEL MAPA NO ENCONTRADO =====');
        console.log('💥 mapRef.current es:', mapRef.current);
        console.log('💥 mapElement es:', mapElement);
        console.log('💥 mapRef es:', mapRef);
        console.log('💥 document.getElementById("google-map-container"):', document.getElementById('google-map-container'));
        console.log('💥 document.querySelector("[data-map-container]"):', document.querySelector('[data-map-container]'));
        console.log('💥 document.querySelector("#google-map-container"):', document.querySelector('#google-map-container'));
        setError('Elemento del mapa no encontrado');
        setIsLoading(false);
        return;
      }

      console.log('✅ ===== ELEMENTO DEL MAPA ENCONTRADO =====');
      console.log('📍 Elemento encontrado:', elementToUse);
      console.log('📍 Tag name:', elementToUse.tagName);
      console.log('📍 Class name:', elementToUse.className);
      console.log('📍 ID:', elementToUse.id);
      console.log('📍 Parent element:', elementToUse.parentElement);
      console.log('📍 Is connected to DOM:', elementToUse.isConnected);
      
      try {
        console.log('🗺️ ===== CREANDO MAPA CON GOOGLE MAPS =====');
        console.log('🌐 window.google:', !!window.google);
        console.log('🗺️ window.google.maps:', !!(window.google && window.google.maps));
        console.log('🗺️ window.google.maps.Map:', !!(window.google && window.google.maps && window.google.maps.Map));
        
        // Crear mapa con ubicación fija (Buenos Aires)
        console.log('📍 Creando mapa con centro:', { lat: -34.6037, lng: -58.3816 });
        console.log('📍 Zoom:', 15);
        console.log('📍 MapTypeId:', 'roadmap');
        console.log('📍 Usando elemento:', elementToUse);
        
        const map = new window.google.maps.Map(elementToUse, {
          zoom: 15,
          center: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
          mapTypeId: 'roadmap'
        });

        console.log('✅ ===== MAPA CREADO EXITOSAMENTE =====');
        console.log('🗺️ Instancia del mapa:', map);
        console.log('📍 Agregando marcador...');

        // Agregar marcador fijo
        const marker = new window.google.maps.Marker({
          position: { lat: -34.6037, lng: -58.3816 },
          map: map,
          title: 'Buenos Aires, Argentina'
        });

        console.log('📍 Marcador creado:', marker);
        console.log('📍 Marcador position:', marker.getPosition());
        console.log('📍 Marcador map:', marker.getMap());

        setMapInstance(map);
        setMapReady(true);
        setIsLoading(false);
        console.log('🎉 ===== ¡MAPA CREADO EXITOSAMENTE! =====');
        console.log('✅ mapInstance:', map);
        console.log('✅ mapReady:', true);
        console.log('✅ isLoading:', false);
        
      } catch (err) {
        console.error('❌ ===== ERROR AL CREAR EL MAPA =====');
        console.error('💥 Error type:', err.constructor.name);
        console.error('💥 Error message:', err.message);
        console.error('💥 Error stack:', err.stack);
        console.error('💥 Error details:', err);
        setError('Error al crear el mapa: ' + err.message);
      setIsLoading(false);
      }
    };

    // Delay inicial para asegurar que el componente se haya renderizado
    console.log('⏰ ===== INICIANDO DELAY DE 500MS =====');
    console.log('📅 Timestamp inicio delay:', new Date().toISOString());
    setTimeout(() => {
      console.log('⏰ ===== DELAY COMPLETADO =====');
      console.log('📅 Timestamp fin delay:', new Date().toISOString());
      initializeMap();
    }, 500);
  }, []);

  // useEffect para validar direcciones por consola
  useEffect(() => {
    console.log('🔍 ===== VALIDANDO DIRECCIÓN =====');
    console.log('📍 address:', address);
    console.log('📍 mapReady:', mapReady);
    console.log('📍 mapInstance:', mapInstance);
    console.log('📍 window.google:', !!window.google);
    console.log('📍 window.google.maps:', !!(window.google && window.google.maps));
    console.log('📍 window.google.maps.Geocoder:', !!(window.google && window.google.maps && window.google.maps.Geocoder));
    
    if (!address || !mapReady || !mapInstance) {
      console.log('❌ ===== CONDICIONES NO CUMPLIDAS =====');
      console.log('❌ address:', address);
      console.log('❌ mapReady:', mapReady);
      console.log('❌ mapInstance:', mapInstance);
      setIsValidAddress(false);
      return;
    }

    console.log('✅ ===== CONDICIONES CUMPLIDAS - INICIANDO VALIDACIÓN =====');
    console.log('🔍 VALIDANDO DIRECCIÓN:', address);
    console.log('📍 Dirección recibida:', address);
    console.log('📍 Tipo de dirección:', typeof address);
    console.log('📍 Longitud de dirección:', address ? address.length : 'null');

    // Validar la dirección usando Geocoder
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      console.log('✅ ===== GEOCODER DISPONIBLE =====');
      console.log('🔧 Creando instancia de Geocoder...');
      
      const geocoder = new window.google.maps.Geocoder();
      console.log('✅ Geocoder creado:', geocoder);
      
      console.log('🔍 Iniciando geocodificación...');
      console.log('📍 Address a geocodificar:', address);
      
      geocoder.geocode({ address: address }, (results, status) => {
        console.log('🗺️ ===== RESULTADO DE GEOCODIFICACIÓN =====');
        console.log('📅 Timestamp:', new Date().toISOString());
        console.log('📊 Status:', status);
        console.log('📊 Results count:', results ? results.length : 'null');
        console.log('📊 Results:', results);
        
        if (status === 'OK' && results[0]) {
          console.log('✅ ===== DIRECCIÓN VÁLIDA! =====');
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          console.log('📍 Coordenadas encontradas:');
          console.log('📍 Latitud:', lat);
          console.log('📍 Longitud:', lng);
          console.log('📍 Dirección completa:', results[0].formatted_address);
          console.log('📍 Dirección formateada:', results[0].formatted_address);
          console.log('📍 Place ID:', results[0].place_id);
          console.log('📍 Types:', results[0].types);
          
          console.log('🗺️ ===== ACTUALIZANDO MAPA =====');
          console.log('📍 mapInstance antes de actualizar:', mapInstance);
          console.log('📍 Centro anterior:', mapInstance.getCenter());
          console.log('📍 Zoom anterior:', mapInstance.getZoom());
          
          // Actualizar el mapa con la nueva ubicación
          mapInstance.setCenter(location);
          mapInstance.setZoom(15);
          
          console.log('📍 Centro después de actualizar:', mapInstance.getCenter());
          console.log('📍 Zoom después de actualizar:', mapInstance.getZoom());
          
          console.log('📍 ===== CREANDO MARCADOR =====');
          // Limpiar marcadores anteriores y agregar nuevo
          const marker = new window.google.maps.Marker({
            position: location,
            map: mapInstance,
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
          
          console.log('📍 Marcador creado:', marker);
          console.log('📍 Marcador position:', marker.getPosition());
          console.log('📍 Marcador map:', marker.getMap());
          
          setCoordinates({ lat, lng });
          setError(null);
          setIsValidAddress(true);
          
          console.log('🎯 ===== MAPA ACTUALIZADO CON NUEVA UBICACIÓN! =====');
          console.log('✅ Validación exitosa - Input debería mostrar verde');
          console.log('✅ coordinates:', { lat, lng });
          console.log('✅ error:', null);
          console.log('✅ isValidAddress:', true);
          
        } else {
          console.log('❌ ===== DIRECCIÓN INVÁLIDA! =====');
          console.log('💥 Status:', status);
          console.log('💥 Results:', results);
          
          let errorMessage = 'No se pudo encontrar la ubicación';
          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = 'No se encontraron resultados para esta dirección. Verifica que esté bien escrita.';
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = 'Límite de consultas excedido. Intenta más tarde.';
              break;
            case 'REQUEST_DENIED':
              errorMessage = 'Solicitud denegada. Verifica la configuración de la API.';
              break;
            case 'INVALID_REQUEST':
              errorMessage = 'Solicitud inválida. Verifica el formato de la dirección.';
              break;
            default:
              errorMessage = `Error de geocodificación: ${status}`;
          }
          
          console.log('💥 Error message:', errorMessage);
          setError(errorMessage);
          setIsValidAddress(false);
          console.log('❌ ===== VALIDACIÓN FALLIDA =====');
          console.log('❌ error:', errorMessage);
          console.log('❌ isValidAddress:', false);
        }
      });
    } else {
      console.log('⚠️ ===== GOOGLE MAPS GEOCODER NO DISPONIBLE =====');
      console.log('⚠️ window.google:', !!window.google);
      console.log('⚠️ window.google.maps:', !!(window.google && window.google.maps));
      console.log('⚠️ window.google.maps.Geocoder:', !!(window.google && window.google.maps && window.google.maps.Geocoder));
      setIsValidAddress(false);
    }
  }, [address, mapReady, mapInstance]);

  // Función para obtener el estado de validación (para uso externo)
  const getValidationState = () => {
    return {
      isValid: isValidAddress,
      coordinates: coordinates,
      error: error,
      isLoading: isLoading
    };
  };

  // Exponer la función de validación globalmente para debugging
  useEffect(() => {
    window.googleMapValidation = getValidationState;
  }, [isValidAddress, coordinates, error, isLoading]);

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

  console.log('🎨 ===== RENDERIZANDO COMPONENTE MAPA =====');
  console.log('📍 mapRef en render:', mapRef);
  console.log('📍 mapRef.current en render:', mapRef.current);
  console.log('📍 isLoading:', isLoading);
  console.log('📍 error:', error);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg relative">
      {/* Mapa siempre visible */}
      <div 
        id="google-map-container"
        ref={mapRefCallback} 
        className="w-full"
        data-map-container="true"
        style={{ 
          height: '400px', 
          width: '100%',
          minHeight: '400px',
          backgroundColor: '#f0f0f0'
        }}
      >
        {/* El mapa se renderizará aquí */}
        </div>
        
        {/* Información de la dirección */}
      {address && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="w-4 h-4 text-[#FF6B35]" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{address}</p>
              <p className="text-gray-600 text-xs">Ubicación confirmada</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;