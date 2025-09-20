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
    setProfileForm({ ...profileForm, [name]: value });

    // Si es el campo de dirección, mostrar sugerencias básicas
    if (name === 'street' && value.length > 3) {
      searchAddressSuggestions(value);
    }
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
      <div className={`min-h-screen bg-gradient-to-br from-[#FAF4E4] to-[#F0E6D2] ${isMobile ? 'px-4 py-6' : 'px-8 py-8'}`}>
        <div className={`max-w-4xl mx-auto ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
          
          {/* Header del perfil */}
          <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm border border-white/20">
            <div className={`flex ${isMobile ? 'flex-col items-center space-y-4' : 'items-center space-x-6'}`}>
              
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
              <div className={`flex-1 ${isMobile ? 'text-center' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold font-baloo text-gray-800">
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
                
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaEnvelope className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                
                {userProfile?.whatsapp && (
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FaWhatsapp className="w-4 h-4 text-green-500" />
                    <span>{userProfile.whatsapp}</span>
                  </div>
                )}
                
                {userProfile?.street && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span>{userProfile.street}</span>
                    {userProfile.postalCode && <span className="text-sm">({userProfile.postalCode})</span>}
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
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Formulario de información personal - Siempre visible */}
          <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold font-baloo text-gray-800">Información Personal</h2>
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
                className="flex items-center gap-2 bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2e] transition-all disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <FaSave className="w-4 h-4" />
                )}
                Guardar
              </button>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
              
              {/* Información básica */}
              <div className="space-y-4">
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
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2">Dirección de Entrega</h3>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={profileForm.street || ''}
                    onChange={handleProfileChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      !profileForm.street 
                        ? 'border-orange-300 focus:ring-orange-500 bg-orange-50' 
                        : 'border-gray-300 focus:ring-[#FF6B35] focus:border-transparent'
                    }`}
                    placeholder="Escribe tu dirección..."
                  />
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
                  address={profileForm.street}
                />
                <p className="text-sm text-gray-600 mt-2">
                  📍 Esta es una representación visual de tu dirección. Nuestro equipo confirmará la ubicación exacta al momento de la entrega.
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
                    <button className="text-[#FF6B35] hover:text-[#e55a2e] font-medium">
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