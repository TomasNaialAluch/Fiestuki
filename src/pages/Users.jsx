import { useState, useRef, useEffect } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import GoogleLogo from '../assets/GoogleLogo.png';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { auth } from '../services/firebase';
import GoogleMapComponent from '../components/GoogleMapComponent';
import { FaUser, FaCamera, FaSave, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShoppingBag, FaSignOutAlt, FaWhatsapp, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

export default function Users() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [profileForm, setProfileForm] = useState({});
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const fileInputRef = useRef(null);
  const { user, userProfile, logout, loading, updateUserProfile } = useAuth();
  const { isMobile } = useDeviceDetection();

  // Inicializar el formulario del perfil cuando el usuario está disponible
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        displayName: userProfile.displayName || '',
        street: userProfile.street || '',
        postalCode: userProfile.postalCode || '',
        floor: userProfile.floor || '',
        buzzer: userProfile.buzzer || '',
        whatsapp: userProfile.whatsapp || '',
        contactEmail: userProfile.contactEmail || user?.email || ''
      });
      
      // Mostrar mapa si hay dirección
      if (userProfile.street) {
        setShowMap(true);
      }
    }
  }, [userProfile, user]);

  // Validar dirección existente cuando se carga el perfil
  useEffect(() => {
    if (profileForm.street && profileForm.street.length > 10) {
      console.log('🔄 VALIDANDO DIRECCIÓN EXISTENTE:', profileForm.street);
      
      const formattedAddress = validateAndFormatAddress(profileForm.street);
      if (formattedAddress) {
        const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`;
        console.log('🗺️ LINK DE GOOGLE MAPS (dirección existente):', googleMapsLink);
        
        setIsValidAddress(true);
        console.log('✅ DIRECCIÓN EXISTENTE VÁLIDA - Input debería mostrar verde');
      } else {
        setIsValidAddress(false);
        console.log('❌ DIRECCIÓN EXISTENTE INVÁLIDA');
      }
    } else {
      setIsValidAddress(false);
    }
  }, [profileForm.street]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF4E4] to-[#F0E6D2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F25C5C]"></div>
          <div className="text-lg text-[#F25C5C] font-baloo">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileChange = e => {
    const { name, value } = e.target;
    console.log('📝 INPUT CAMBIADO:', { name, value });
    setProfileForm({ ...profileForm, [name]: value });

    // Si es el campo de dirección, generar link de Google Maps
    if (name === 'street' && value.length > 3) {
      console.log('🏠 Dirección ingresada:', value);
      
      // Generar link de Google Maps
      const formattedAddress = validateAndFormatAddress(value);
      if (formattedAddress) {
        const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`;
        console.log('🗺️ LINK DE GOOGLE MAPS:', googleMapsLink);
        console.log('📍 Dirección formateada para el link:', formattedAddress);
        
        // También generar link directo para abrir en nueva pestaña
        console.log('🔗 Para abrir en nueva pestaña, usa:');
        console.log(`window.open('${googleMapsLink}', '_blank')`);
        
        // Validar que la dirección sea válida (más de 10 caracteres)
        const isValid = value.trim().length >= 10;
        setIsValidAddress(isValid);
        
        if (isValid) {
          console.log('✅ DIRECCIÓN VÁLIDA - Input debería mostrar verde');
        } else {
          console.log('⚠️ DIRECCIÓN MUY CORTA - Input debería mostrar naranja');
        }
      } else {
        setIsValidAddress(false);
        console.log('❌ DIRECCIÓN INVÁLIDA - Input debería mostrar rojo');
      }
      
      searchAddressSuggestions(value);
    } else if (name === 'street') {
      setIsValidAddress(false);
    }
  };

  const validateAndFormatAddress = (address) => {
    console.log('🔍 VALIDANDO DIRECCIÓN:', address);
    
    if (!address || address.trim().length < 5) {
      console.log('❌ Dirección muy corta o vacía');
      return null;
    }

    // Formatear la dirección para Google Maps
    let formattedAddress = address.trim();
    console.log('📍 Dirección original:', formattedAddress);
    
    // Agregar "Argentina" si no está presente
    if (!formattedAddress.toLowerCase().includes('argentina')) {
      formattedAddress += ', Argentina';
    }
    
    // Agregar "Buenos Aires" si no está presente
    if (!formattedAddress.toLowerCase().includes('buenos aires') && 
        !formattedAddress.toLowerCase().includes('caba') &&
        !formattedAddress.toLowerCase().includes('capital federal')) {
      formattedAddress += ', Buenos Aires';
    }

    console.log('✅ Dirección formateada:', formattedAddress);
    return formattedAddress;
  };

  const searchAddressSuggestions = (query) => {
    // Sugerencias básicas para demostración (sin API real)
    const basicSuggestions = [
      { description: `${query}, Capital Federal, Buenos Aires, Argentina` },
      { description: `${query}, Vicente López, Buenos Aires, Argentina` },
      { description: `${query}, San Isidro, Buenos Aires, Argentina` },
      { description: `${query}, Belgrano, CABA, Argentina` },
      { description: `${query}, Palermo, CABA, Argentina` }
    ];
    
    setAddressSuggestions(basicSuggestions);
  };

  const selectAddress = (suggestion) => {
    setProfileForm({ ...profileForm, street: suggestion.description });
    setAddressSuggestions([]);
    setSelectedLocation(suggestion);
    setShowMap(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        await createUserWithEmailAndPassword(auth, form.email, form.password);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleViewOrderDetails = async (orderId) => {
    setSelectedOrder(orderId);
    setLoadingOrder(true);
    setError('');
    
    try {
      // Aquí podrías hacer una consulta a Firestore para obtener los detalles del pedido
      // Por ahora, simularemos los datos
      const mockOrderDetails = {
        id: orderId,
        date: new Date().toLocaleDateString('es-AR'),
        items: [
          { name: 'Producto de ejemplo', quantity: 2, price: 1500 },
          { name: 'Otro producto', quantity: 1, price: 800 }
        ],
        total: 3800,
        status: 'Completado',
        buyer: {
          nombre: userProfile?.displayName || 'Usuario',
          email: userProfile?.email || user?.email || 'email@ejemplo.com',
          telefono: userProfile?.whatsapp || 'Sin teléfono',
          direccion: userProfile?.street || 'Sin dirección'
        }
      };
      
      setOrderDetails(mockOrderDetails);
    } catch (err) {
      setError('Error al cargar los detalles del pedido');
    } finally {
      setLoadingOrder(false);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Crear referencia única para la imagen
      const imageRef = ref(storage, `profile-images/${user.uid}/${Date.now()}_${file.name}`);
      
      // Subir imagen
      const snapshot = await uploadBytes(imageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);

      // Actualizar perfil en Firebase Auth
      await updateProfile(user, { photoURL });

      // Actualizar perfil en Firestore
      await updateUserProfile({ photoURL });

      setUploading(false);
    } catch (err) {
      setError('Error al subir la imagen: ' + err.message);
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');

    try {
      // Actualizar displayName en Firebase Auth si cambió
      if (profileForm.displayName !== user.displayName) {
        await updateProfile(user, { displayName: profileForm.displayName });
      }

      // Actualizar perfil en Firestore
      await updateUserProfile(profileForm);

      setSaving(false);
    } catch (err) {
      setError('Error al guardar perfil: ' + err.message);
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileForm({
      displayName: userProfile?.displayName || '',
      street: userProfile?.street || '',
      postalCode: userProfile?.postalCode || '',
      floor: userProfile?.floor || '',
      buzzer: userProfile?.buzzer || '',
      whatsapp: userProfile?.whatsapp || '',
      contactEmail: userProfile?.contactEmail || user?.email || ''
    });
    setError('');
  };

  // Verificar qué campos faltan completar
  const getIncompleteFields = () => {
    const required = ['displayName', 'street', 'postalCode', 'whatsapp'];
    return required.filter(field => !profileForm[field] || profileForm[field].trim() === '');
  };

  const incompleteFields = getIncompleteFields();
  const isProfileComplete = incompleteFields.length === 0;

  // Estilos responsivos para login
  const containerClass = isMobile 
    ? "min-h-screen bg-gradient-to-br from-[#FAF4E4] to-[#F0E6D2] flex items-center justify-center px-4 py-8"
    : "min-h-screen bg-gradient-to-br from-[#FAF4E4] to-[#F0E6D2] flex items-center justify-center";

  const cardClass = isMobile
    ? "bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm backdrop-blur-sm"
    : "bg-white p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm";

  const titleClass = isMobile
    ? "text-2xl font-bold font-baloo text-[#FF6B35] mb-4 text-center"
    : "text-3xl font-bold font-baloo text-[#FF6B35] mb-6 text-center";

  const inputClass = isMobile
    ? "p-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
    : "p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all";

  const buttonClass = isMobile
    ? "bg-[#FF6B35] text-white py-3 px-6 rounded-xl font-bold text-base hover:bg-[#e55a2e] transition-all transform hover:scale-105"
    : "bg-[#FF6B35] text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-[#e55a2e] transition-all transform hover:scale-105";

  const googleBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    background: '#fff',
    border: '1px solid #dadce0',
    borderRadius: isMobile ? '12px' : '6px',
    padding: isMobile ? '14px 0' : '10px 0',
    fontWeight: 500,
    fontSize: isMobile ? '18px' : '16px',
    color: '#3c4043',
    gap: '12px',
    marginTop: isMobile ? '20px' : '18px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  if (user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-[#FAF4E4] to-[#F0E6D2] ${isMobile ? 'px-2 py-4' : 'px-8 py-8'}`}>
        <div className={`max-w-4xl mx-auto ${isMobile ? 'space-y-6' : 'space-y-6'}`}>
          
          {/* Header del perfil */}
          <div className={`bg-white rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`flex ${isMobile ? 'flex-col items-center space-y-6' : 'items-center space-x-6'}`}>
              
              {/* Foto de perfil */}
              <div className="relative">
                <div className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full overflow-hidden bg-gradient-to-br from-[#FF6B35] to-[#F25C5C] p-1 shadow-lg`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    {user.photoURL || userProfile?.photoURL ? (
                      <img 
                        src={user.photoURL || userProfile?.photoURL} 
                        alt="Perfil" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-gray-400 text-4xl" />
                    )}
                  </div>
                </div>
                
                {/* Botón para cambiar foto */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-[#FF6B35] text-white p-2 rounded-full shadow-lg hover:bg-[#e55a2e] transition-all transform hover:scale-110 disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <FaCamera className="w-4 h-4" />
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Info básica */}
              <div className={`flex-1 ${isMobile ? 'text-center w-full' : ''}`}>
                <div className={`flex items-center gap-2 mb-3 ${isMobile ? 'flex-col space-y-2' : ''}`}>
                  <h1 className={`font-bold font-baloo text-gray-800 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                    {userProfile?.displayName || user.displayName || 'Usuario'}
                  </h1>
                  {!isProfileComplete && (
                    <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                      <FaExclamationCircle className="w-3 h-3" />
                      <span>Perfil incompleto</span>
                    </div>
                  )}
                  {isProfileComplete && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                      <FaCheckCircle className="w-3 h-3" />
                      <span>Perfil completo</span>
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center gap-2 text-gray-600 mb-2 ${isMobile ? 'justify-center' : ''}`}>
                  <FaEnvelope className="w-4 h-4" />
                  <span className={isMobile ? 'text-sm' : ''}>{user.email}</span>
                </div>
                
                {userProfile?.whatsapp && (
                  <div className={`flex items-center gap-2 text-gray-600 mb-2 ${isMobile ? 'justify-center' : ''}`}>
                    <FaWhatsapp className="w-4 h-4 text-green-500" />
                    <span className={isMobile ? 'text-sm' : ''}>{userProfile.whatsapp}</span>
                  </div>
                )}
                
                {userProfile?.street && (
                  <div className={`flex items-center gap-2 text-gray-600 ${isMobile ? 'justify-center flex-wrap' : ''}`}>
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span className={`${isMobile ? 'text-sm text-center' : ''}`}>{userProfile.street}</span>
                    {userProfile.postalCode && <span className={`text-sm ${isMobile ? 'block w-full text-center mt-1' : ''}`}>({userProfile.postalCode})</span>}
                  </div>
                )}

                {/* Estadísticas */}
                <div className={`flex gap-4 mt-4 ${isMobile ? 'justify-center' : ''}`}>
                  <div className="bg-gradient-to-r from-[#FF6B35] to-[#F25C5C] text-white px-4 py-2 rounded-full">
                    <div className="flex items-center gap-2">
                      <FaShoppingBag className="w-4 h-4" />
                      <span className="font-bold">{userProfile?.orderHistory?.length || 0}</span>
                      <span className="text-sm">Pedidos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón cerrar sesión */}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all ${isMobile ? 'w-full justify-center' : ''}`}
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span className={isMobile ? 'text-sm' : ''}>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Formulario de información personal - Siempre visible */}
          <div className={`bg-white rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center justify-between mb-6 ${isMobile ? 'flex-col space-y-4' : ''}`}>
              <div className={`flex items-center gap-3 ${isMobile ? 'flex-col text-center' : ''}`}>
                <h2 className={`font-bold font-baloo text-gray-800 ${isMobile ? 'text-xl' : 'text-2xl'}`}>Información Personal</h2>
                {!isProfileComplete && (
                  <div className="flex items-center gap-1 text-orange-600 text-sm">
                    <FaExclamationCircle className="w-4 h-4" />
                    <span>Completa tu perfil para una mejor experiencia</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className={`flex items-center gap-2 bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2e] transition-all disabled:opacity-50 ${isMobile ? 'w-full justify-center' : ''}`}
              >
                {saving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <FaSave className="w-4 h-4" />
                )}
                <span className={isMobile ? 'text-sm' : ''}>Guardar</span>
              </button>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-6'}`}>
              
              {/* Información básica */}
              <div className={`space-y-4 ${isMobile ? 'space-y-6' : ''}`}>
                <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2">Datos Básicos</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={profileForm.displayName || ''}
                    onChange={handleProfileChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      !profileForm.displayName 
                        ? 'border-orange-300 focus:ring-orange-500 bg-orange-50' 
                        : 'border-gray-300 focus:ring-[#FF6B35] focus:border-transparent'
                    }`}
                    placeholder="Ingresa tu nombre completo"
                  />
                  {!profileForm.displayName && (
                    <p className="text-orange-600 text-xs mt-1">Este campo es obligatorio</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <div className="relative">
                    <FaWhatsapp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={profileForm.whatsapp || ''}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        !profileForm.whatsapp 
                          ? 'border-orange-300 focus:ring-orange-500 bg-orange-50' 
                          : 'border-gray-300 focus:ring-[#FF6B35] focus:border-transparent'
                      }`}
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                  {!profileForm.whatsapp && (
                    <p className="text-orange-600 text-xs mt-1">Necesario para coordinar entregas</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contacto
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={profileForm.contactEmail || ''}
                    onChange={handleProfileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                    placeholder="Email alternativo (opcional)"
                  />
                  <p className="text-gray-500 text-xs mt-1">Si prefieres que te contactemos a otro email</p>
                </div>
              </div>

              {/* Dirección */}
              <div className={`space-y-4 ${isMobile ? 'space-y-6' : ''}`}>
                <h3 className={`font-bold text-gray-700 border-b border-gray-200 pb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>Dirección de Entrega</h3>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="street"
                      value={profileForm.street || ''}
                      onChange={handleProfileChange}
                      className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        !profileForm.street 
                          ? 'border-orange-300 focus:ring-orange-500 bg-orange-50' 
                          : isValidAddress
                          ? 'border-green-500 focus:ring-green-500 bg-green-50'
                          : 'border-gray-300 focus:ring-[#FF6B35] focus:border-transparent'
                      }`}
                      placeholder="Escribe tu dirección..."
                    />
                    {isValidAddress && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FaCheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {!profileForm.street && (
                    <p className="text-orange-600 text-xs mt-1">Necesaria para realizar entregas</p>
                  )}
                  
                  {/* Sugerencias de direcciones */}
                  {addressSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectAddress(suggestion)}
                          className="w-full p-3 text-left hover:bg-[#FF6B35]/10 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="w-4 h-4 text-[#FF6B35]" />
                            <span className="text-sm">{suggestion.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={profileForm.postalCode || ''}
                      onChange={handleProfileChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        !profileForm.postalCode 
                          ? 'border-orange-300 focus:ring-orange-500 bg-orange-50' 
                          : 'border-gray-300 focus:ring-[#FF6B35] focus:border-transparent'
                      }`}
                      placeholder="1234"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Piso (opcional)
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={profileForm.floor || ''}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                      placeholder="5° A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timbre (opcional)
                  </label>
                  <input
                    type="text"
                    name="buzzer"
                    value={profileForm.buzzer || ''}
                    onChange={handleProfileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                    placeholder="Apellido o número de timbre"
                  />
                </div>
              </div>
            </div>

            {/* Mapa */}
            {showMap && profileForm.street && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Ubicación en el Mapa</h3>
                <GoogleMapComponent 
                  address={validateAndFormatAddress(profileForm.street)}
                />
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    📍 Dirección formateada: {validateAndFormatAddress(profileForm.street)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Si la ubicación no es correcta, verifica que la dirección esté bien escrita.
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Esta es una representación visual de tu dirección. Nuestro equipo confirmará la ubicación exacta al momento de la entrega.
                </p>
              </div>
            )}
          </div>

          {/* Historial de pedidos */}
          <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm border border-white/20">
            <h3 className="text-2xl font-bold font-baloo text-gray-800 mb-4">Historial de Pedidos</h3>
            
            {userProfile?.orderHistory?.length > 0 ? (
              <div className="space-y-3">
                {userProfile.orderHistory.map((orderId, index) => (
                  <div key={orderId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Pedido #{orderId.slice(-8)}</p>
                      <p className="text-sm text-gray-600">Pedido #{index + 1}</p>
                    </div>
                    <button 
                      onClick={() => handleViewOrderDetails(orderId)}
                      className="text-[#FF6B35] hover:text-[#e55a2e] font-medium transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Aún no tienes pedidos</p>
                <p className="text-gray-500">¡Explora nuestros productos y haz tu primera compra!</p>
              </div>
            )}
          </div>

          {/* Mostrar errores */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Modal de detalles de pedido */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Detalles del Pedido</h3>
                  <button
                    onClick={closeOrderDetails}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {loadingOrder ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-6">
                    {/* Información del pedido */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">ID del Pedido</p>
                          <p className="font-semibold">{orderDetails.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fecha</p>
                          <p className="font-semibold">{orderDetails.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estado</p>
                          <p className="font-semibold text-green-600">{orderDetails.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-semibold text-[#FF6B35]">${orderDetails.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Productos */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Productos</h4>
                      <div className="space-y-2">
                        {orderDetails.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Información del comprador */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Información de Entrega</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p><span className="font-medium">Nombre:</span> {orderDetails.buyer.nombre}</p>
                        <p><span className="font-medium">Email:</span> {orderDetails.buyer.email}</p>
                        <p><span className="font-medium">Teléfono:</span> {orderDetails.buyer.telefono}</p>
                        <p><span className="font-medium">Dirección:</span> {orderDetails.buyer.direccion}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No se pudieron cargar los detalles del pedido</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Formulario de login/registro
  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <h2 className={titleClass}>
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            required
          />
          {error && <div className="text-red-500 font-bold text-center p-2 bg-red-50 rounded-lg">{error}</div>}
          <button
            type="submit"
            className={buttonClass}
          >
            {isLogin ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
        
        <div className="flex flex-col items-center gap-2 mt-6">
          <button
            onClick={handleGoogle}
            style={googleBtnStyle}
          >
            <img
              src={GoogleLogo}
              alt="Google"
              style={{ width: isMobile ? 26 : 22, height: isMobile ? 26 : 22, marginRight: 8 }}
            />
            <span>Continuar con Google</span>
          </button>
          
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#FF6B35] font-baloo font-bold hover:underline mt-4 transition-all"
          >
            {isLogin ? '¿No tenés cuenta? Crear una' : '¿Ya tenés cuenta? Ingresar'}
          </button>
        </div>
      </div>
    </div>
  );
}