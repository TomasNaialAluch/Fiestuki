import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, userProfile, addOrderToHistory } = useAuth();
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-llenar formulario con datos del usuario logueado
  useEffect(() => {
    if (user && userProfile) {
      setForm({
        nombre: userProfile.displayName || user.displayName || '',
        email: userProfile.email || user.email || '',
        telefono: userProfile.phone || '',
        direccion: userProfile.address || ''
      });
    }
  }, [user, userProfile]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.email || !form.telefono || !form.direccion) {
      setError('Por favor completá todos los campos.');
      return;
    }
    setLoading(true);
    const db = getFirestore();
    const order = {
      buyer: form,
      items: cart.map(item => ({
        id: item.id,
        name: item.name || item.nombre,
        price: item.price || item.precio,
        quantity: item.quantity
      })),
      total: totalPrice,
      date: Timestamp.now(),
      userId: user?.uid || null // Asociar pedido con usuario si está logueado
    };
    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      setOrderId(docRef.id);
      
      // Si el usuario está logueado, agregar el pedido a su historial
      if (user) {
        await addOrderToHistory(docRef.id);
      }
      
      clearCart();
    } catch (err) {
      setError('Ocurrió un error al generar la orden. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold font-baloo text-[#FF6B35] mb-6 text-center">Checkout</h2>
      
      {/* Indicador de datos pre-llenados */}
      {user && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 font-baloo text-sm">
            <span className="text-lg">✅</span>
            <span>Datos pre-llenados desde tu perfil</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          className="bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] text-white font-bold py-3 rounded-xl font-baloo text-lg mt-2"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Finalizar compra'}
        </button>
      </form>
    </div>
  );
}