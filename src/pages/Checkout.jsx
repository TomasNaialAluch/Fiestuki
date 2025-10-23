import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import MercadoPagoButton from '../components/MercadoPagoButton';

export default function Checkout() {
  const { cart, totalPrice, clearCart, addToCart, removeFromCart } = useCart();
  const { user, userProfile, addOrderToHistory } = useAuth();
  const { setIsNavBarHidden } = useUI();
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('delivery'); // 'delivery' | 'payment'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [orderData, setOrderData] = useState(null); // Guardar datos del pedido
  const [copiedField, setCopiedField] = useState(null); // Para mostrar feedback de copiado
  
  // Calcular total con descuento por transferencia
  const transferDiscount = 0.05; // 5% de descuento
  const totalWithTransferDiscount = selectedPaymentMethod === 'transferencia' 
    ? totalPrice * (1 - transferDiscount) 
    : totalPrice;

  // Pre-llenar formulario con datos del usuario logueado
  useEffect(() => {
    if (user && userProfile) {
      setForm({
        nombre: userProfile.displayName || user.displayName || '',
        email: userProfile.email || user.email || '',
        telefono: userProfile.whatsapp || '',
        direccion: userProfile.street || ''
      });
    }
  }, [user, userProfile]);

  // Controlar visibilidad del NavBar
  useEffect(() => {
    if (selectedPaymentMethod) {
      // Ocultar NavBar cuando se selecciona un método de pago
      setIsNavBarHidden(true);
    } else {
      // Mostrar NavBar cuando no hay método seleccionado
      setIsNavBarHidden(false);
    }

    // Cleanup: mostrar NavBar al desmontar el componente
    return () => {
      setIsNavBarHidden(false);
    };
  }, [selectedPaymentMethod, setIsNavBarHidden]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Funciones para manejar el carrito
  const handleIncreaseQuantity = (item) => {
    if (item.quantity < item.stock) {
      addToCart(item, 1);
    }
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      addToCart(item, -1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleProceedToPayment = async e => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.email || !form.telefono || !form.direccion) {
      setError('Por favor completá todos los campos.');
      return;
    }
    
    // Guardar datos del pedido y usuario
    const orderData = {
      buyer: form,
      user: user ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      } : null,
      userProfile: userProfile,
      items: cart.map(item => ({
        id: item.id,
        name: item.name || item.nombre,
        price: item.price || item.precio,
        quantity: item.quantity,
        image: item.mainImage || item.imagen
      })),
      total: totalPrice,
      date: new Date()
    };
    
    setOrderData(orderData);
    
    // Cambiar a la etapa de pago
    setCheckoutStep('payment');
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleGoBack = () => {
    if (selectedPaymentMethod) {
      // Si hay método seleccionado, volver a la selección de métodos
      setSelectedPaymentMethod(null);
      setError('');
      setCopiedField(null);
    } else {
      // Si no hay método seleccionado, volver al formulario
      setCheckoutStep('delivery');
      setError('');
    }
  };

  const handleCopyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000); // Limpiar feedback después de 2 segundos
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedPaymentMethod) {
      setError('Por favor seleccioná un método de pago.');
      return;
    }
    
    setLoading(true);
    
    // Para transferencia bancaria (flujo normal)
    const db = getFirestore();
    const order = {
      ...orderData,
      paymentMethod: selectedPaymentMethod,
      date: Timestamp.now()
    };
    
    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      setOrderId(docRef.id);
      
      // Si el usuario está logueado, agregar el pedido a su historial
      if (orderData.user) {
        await addOrderToHistory(docRef.id);
      }
      
      clearCart();
    } catch (err) {
      setError('Ocurrió un error al generar la orden. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleMercadoPagoPayment = async () => {
    setLoading(true);
    
    try {
      // Crear la orden primero
      const db = getFirestore();
      const order = {
        ...orderData,
        paymentMethod: 'mercadopago',
        date: Timestamp.now(),
        status: 'pending_payment'
      };
      
      const docRef = await addDoc(collection(db, 'orders'), order);
      
      // Actualizar orderData con el ID de la orden
      const updatedOrderData = {
        ...orderData,
        orderId: docRef.id
      };
      
      // El MercadoPagoButton manejará el resto del proceso
      return updatedOrderData;
      
    } catch (err) {
      setError('Ocurrió un error al crear la orden. Intentá de nuevo.');
      setLoading(false);
      return null;
    }
  };

  const handleMercadoPagoError = (error) => {
    setError(error);
    setLoading(false);
  };

  // Mostrar NavBar cuando hay orderId (página de confirmación)
  useEffect(() => {
    if (orderId) {
      setIsNavBarHidden(false);
    }
  }, [orderId, setIsNavBarHidden]);

  if (orderId) {
    return (
      <div className="max-w-lg mx-auto mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold font-baloo text-[#FF6B35] mb-4">¡Gracias por tu compra!</h2>
        <p className="text-lg mb-2">Tu ID de orden es:</p>
        <div className="font-mono text-lg bg-gray-100 rounded p-2 mb-4">{orderId}</div>
        <p className="text-gray-500">Te enviaremos un mail con los detalles.</p>
      </div>
    );
  }

  // Componente para métodos de pago
  const PaymentMethodsComponent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-baloo text-gray-800 flex items-center gap-2">
          💳 Método de Pago
        </h3>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 text-[#FF6B35] hover:text-[#E55A31] transition-colors font-baloo font-medium"
        >
          ← Volver Atrás
        </button>
      </div>
      
      {/* Mostrar opciones solo si no hay método seleccionado */}
      {!selectedPaymentMethod && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Transferencia */}
          <div 
            onClick={() => handlePaymentMethodSelect('transferencia')}
            className="relative cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            <div className="p-6 rounded-2xl border-2 border-gray-200 bg-white hover:border-[#FF6B35] shadow-lg">
              <div className="text-center">
                {/* Icono de Banco Profesional */}
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-blue-50">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    {/* Icono de banco confiable */}
                    <path d="M4 6h16v2H4V6zm0 4h16v8H4v-8zm2 2v4h4v-4H6zm6 0v4h4v-4h-4z" fill="#1e40af"/>
                    <circle cx="6" cy="8" r="1" fill="white"/>
                    <circle cx="18" cy="8" r="1" fill="white"/>
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">Transferencia</h4>
                <p className="text-sm opacity-80">Bancaria o CBU</p>
                <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                  💰 5% de descuento
                </div>
              </div>
            </div>
          </div>

          {/* MercadoPago */}
          <div 
            onClick={() => handlePaymentMethodSelect('mercadopago')}
            className="relative cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            <div className="p-6 rounded-2xl border-2 border-gray-200 bg-white hover:border-[#009EE3] shadow-lg hover:shadow-[#009EE3]/20">
              <div className="text-center">
                {/* Logo Oficial de MercadoPago */}
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-[#009EE3]/10">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    {/* Logo MercadoPago - Versión profesional */}
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#009EE3"/>
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">MercadoPago</h4>
                <p className="text-sm opacity-80">Tarjeta, efectivo o QR</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPaymentMethod === 'transferencia' && (
        <div className="mt-6 animate-slideUp">
          <div className="bg-white rounded-2xl border-2 border-[#FF6B35] p-8 shadow-xl">
            <h4 className="text-2xl font-bold font-baloo text-gray-800 mb-6 flex items-center gap-2">
              🏦 Transferencia Bancaria
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda - Datos Bancarios */}
              <div>
                <h5 className="text-lg font-bold text-gray-700 mb-4">Datos para Transferencia</h5>
                <div className="space-y-4">
                  {/* Titular */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Titular</label>
                    <p className="text-gray-800 font-medium">Melina Nieto</p>
                  </div>
                  
                  {/* Alias */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Alias</label>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-800 font-mono text-lg flex-1">sirius.bella.otto</p>
                      <button
                        onClick={() => handleCopyToClipboard('sirius.bella.otto', 'alias')}
                        className="px-3 py-1 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#E55A31] transition-colors flex items-center gap-1"
                      >
                        {copiedField === 'alias' ? '✓ Copiado' : '📋 Copiar'}
                      </button>
                    </div>
                  </div>
                  
                  {/* CBU */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">CBU</label>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-800 font-mono text-lg flex-1">0000003100059258925205</p>
                      <button
                        onClick={() => handleCopyToClipboard('0000003100059258925205', 'cbu')}
                        className="px-3 py-1 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#E55A31] transition-colors flex items-center gap-1"
                      >
                        {copiedField === 'cbu' ? '✓ Copiado' : '📋 Copiar'}
                      </button>
                    </div>
                  </div>
                  
                  {/* CUIT/CUIL */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">CUIT/CUIL</label>
                    <p className="text-gray-800 font-mono text-lg">27-37665964-5</p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Detalle de Compra y Datos del Usuario */}
              <div>
                <h5 className="text-lg font-bold text-gray-700 mb-4">Detalle de tu Compra</h5>
                
                {/* Resumen del Carrito */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">
                          {item.name || item.nombre} x {item.quantity}
                        </span>
                        <span className="text-sm font-medium">
                          ${((item.price || item.precio) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-300 mt-3 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-medium">${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-600">Descuento (5%):</span>
                      <span className="text-sm font-medium text-green-600">
                        -${(totalPrice * transferDiscount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total a Transferir:</span>
                      <span className="text-lg font-bold text-[#FF6B35]">
                        ${totalWithTransferDiscount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Datos del Usuario */}
                <h5 className="text-lg font-bold text-gray-700 mb-4">Tus Datos</h5>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nombre</label>
                    <p className="text-gray-800">{form.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-800">{form.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                    <p className="text-gray-800">{form.telefono}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Dirección</label>
                    <p className="text-gray-800">{form.direccion}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                💡 <strong>Instrucciones:</strong> Realizá la transferencia por el monto de <strong>${totalWithTransferDiscount.toLocaleString()}</strong> y enviá el comprobante por WhatsApp.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-800">📱 WhatsApp de Melina:</span>
                  <span className="text-sm font-medium text-blue-900">+54 9 297 421-8265</span>
                </div>
                <a
                  href="https://wa.me/5492974218265?text=Hola%20Melina!%20Te%20envío%20el%20comprobante%20de%20mi%20compra%20en%20Fiestuki."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  💬 Chatear
                </a>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleFinalSubmit}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] text-white font-bold py-3 rounded-xl font-baloo text-lg disabled:opacity-50 hover:from-[#ff5252] hover:to-[#ffcc02] transition-all duration-200"
          >
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </div>
      )}

      {selectedPaymentMethod === 'mercadopago' && (
        <div className="mt-6 animate-slideUp">
          <MercadoPagoButton
            orderData={orderData}
            onPaymentInitiated={(preferenceId) => {
              console.log('Pago iniciado con preferencia:', preferenceId);
            }}
            onError={handleMercadoPagoError}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 pb-16">
      <h2 className="text-3xl font-bold font-baloo text-[#FF6B35] mb-8 text-center">
        {checkoutStep === 'delivery' ? 'Checkout' : 'Método de Pago'}
      </h2>
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2 flex-wrap">
          {/* Step 1 - Datos de Entrega */}
          <div className={`flex items-center space-x-2 ${checkoutStep === 'delivery' ? 'text-[#FF6B35]' : selectedPaymentMethod ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              checkoutStep === 'delivery' 
                ? 'bg-[#FF6B35] text-white' 
                : selectedPaymentMethod
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="font-baloo font-medium text-sm">Datos</span>
          </div>
          
          {/* Arrow 1 */}
          <div className={`w-6 h-1 rounded-full ${selectedPaymentMethod ? 'bg-[#FF6B35]' : 'bg-gray-200'}`}></div>
          
          {/* Step 2 - Método de Pago */}
          <div className={`flex items-center space-x-2 ${!selectedPaymentMethod && checkoutStep === 'payment' ? 'text-[#FF6B35]' : selectedPaymentMethod ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              !selectedPaymentMethod && checkoutStep === 'payment'
                ? 'bg-[#FF6B35] text-white' 
                : selectedPaymentMethod
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="font-baloo font-medium text-sm">Pago</span>
          </div>
          
          {/* Arrow 2 */}
          <div className={`w-6 h-1 rounded-full ${selectedPaymentMethod ? 'bg-[#FF6B35]' : 'bg-gray-200'}`}></div>
          
          {/* Step 3 - Método Específico */}
          <div className={`flex items-center space-x-2 ${selectedPaymentMethod ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              selectedPaymentMethod 
                ? 'bg-[#FF6B35] text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="font-baloo font-medium text-sm">
              {selectedPaymentMethod === 'transferencia' ? 'Transferencia' : 
               selectedPaymentMethod === 'mercadopago' ? 'MercadoPago' : 'Confirmar'}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 max-w-lg mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r from-[#FF6B35] to-[#E55A31] h-2 rounded-full transition-all duration-500 ${
                checkoutStep === 'delivery' ? 'w-1/3' : 
                !selectedPaymentMethod ? 'w-2/3' : 'w-full'
              }`}
            ></div>
          </div>
        </div>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700 ${
        checkoutStep === 'payment' ? 'transform -translate-x-full opacity-0 absolute' : 'transform translate-x-0 opacity-100'
      }`}>
        {/* Columna izquierda - Resumen del Carrito */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold font-baloo text-gray-800 mb-4 flex items-center gap-2">
            🛒 Tu Pedido
          </h3>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4 text-lg">Tu carrito está vacío</p>
              <p className="text-sm">Agregá productos antes de hacer el checkout</p>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="flex flex-col gap-3 mb-4 max-h-[400px] overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="bg-[#FAF4E4] rounded-xl p-3">
                    <div className="flex gap-3 mb-2">
                      {/* Imagen del producto */}
                      {(item.mainImage || item.imagen) && (
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                          <img
                            src={item.mainImage || item.imagen}
                            alt={item.name || item.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Info del producto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">
                          {item.name || item.nombre}
                        </h4>
                        <div className="text-sm text-gray-600 mb-1">
                          Precio unitario: ${(item.price || item.precio).toLocaleString()}
                        </div>
                        <div className="font-bold text-[#FF6B35] text-base">
                          ${((item.price || item.precio) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                      <div className="flex items-center gap-2">
                        {/* Botón - */}
                        <button
                          onClick={() => handleDecreaseQuantity(item)}
                          className="w-8 h-8 flex items-center justify-center bg-white hover:bg-[#FF6B35] text-[#FF6B35] hover:text-white rounded-lg transition-colors duration-200 shadow-sm font-bold border border-[#FF6B35]"
                          aria-label="Disminuir cantidad"
                        >
                          <FaMinus className="text-xs" />
                        </button>

                        {/* Cantidad */}
                        <span className="w-12 text-center font-bold text-gray-800">
                          {item.quantity}
                        </span>

                        {/* Botón + */}
                        <button
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={item.quantity >= item.stock}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 shadow-sm font-bold border ${
                            item.quantity >= item.stock
                              ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                              : 'bg-white hover:bg-[#FF6B35] text-[#FF6B35] hover:text-white border-[#FF6B35]'
                          }`}
                          aria-label="Aumentar cantidad"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-baloo font-bold shadow-sm"
                      >
                        <FaTrash className="text-xs" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold text-lg">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Envío:</span>
                  <span className="text-green-600 font-bold">Gratis</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                  <span className="text-xl font-bold font-baloo text-gray-800">Total:</span>
                  <span className="text-2xl font-bold font-baloo text-[#FF6B35]">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Columna derecha - Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold font-baloo text-gray-800 mb-4 flex items-center gap-2">
            📋 Datos de Entrega
          </h3>
          
          {/* Indicador de datos pre-llenados */}
          {user && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 font-baloo text-sm">
                <span className="text-lg">✅</span>
                <span>Datos pre-llenados desde tu perfil</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleProceedToPayment} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre y apellido"
            value={form.nombre}
            onChange={handleChange}
            className={`w-full border-2 rounded-lg px-4 py-3 font-baloo text-base transition-colors ${
              form.nombre ? 'border-green-300 bg-green-50' : 'border-gray-300'
            } focus:border-[#FF6B35] focus:outline-none`}
          />
          {form.nombre && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              ✓
            </div>
          )}
        </div>
        
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className={`w-full border-2 rounded-lg px-4 py-3 font-baloo text-base transition-colors ${
              form.email ? 'border-green-300 bg-green-50' : 'border-gray-300'
            } focus:border-[#FF6B35] focus:outline-none`}
          />
          {form.email && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              ✓
            </div>
          )}
        </div>
        
        <div className="relative">
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className={`w-full border-2 rounded-lg px-4 py-3 font-baloo text-base transition-colors ${
              form.telefono ? 'border-green-300 bg-green-50' : 'border-gray-300'
            } focus:border-[#FF6B35] focus:outline-none`}
          />
          {form.telefono && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              ✓
            </div>
          )}
        </div>
        
        <div className="relative">
          <input
            type="text"
            name="direccion"
            placeholder="Dirección de entrega"
            value={form.direccion}
            onChange={handleChange}
            className={`w-full border-2 rounded-lg px-4 py-3 font-baloo text-base transition-colors ${
              form.direccion ? 'border-green-300 bg-green-50' : 'border-gray-300'
            } focus:border-[#FF6B35] focus:outline-none`}
          />
          {form.direccion && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              ✓
            </div>
          )}
        </div>
            {error && <div className="text-red-500 font-bold text-center">{error}</div>}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] text-white font-bold py-3 rounded-xl font-baloo text-lg mt-2 disabled:opacity-50"
              disabled={loading || cart.length === 0}
            >
              Proceder a Métodos de Pago
            </button>
          </form>
        </div>
      </div>

      {/* Métodos de pago - Aparecen cuando checkoutStep === 'payment' */}
      <div className={`transition-all duration-700 ${
        checkoutStep === 'payment' 
          ? 'transform translate-x-0 opacity-100 relative' 
          : 'transform translate-x-full opacity-0 absolute top-0 left-0 right-0'
      }`}>
        <div className="max-w-2xl mx-auto">
          <PaymentMethodsComponent />
        </div>
      </div>

    </div>
  );
}