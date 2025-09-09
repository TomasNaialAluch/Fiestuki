import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      date: Timestamp.now()
    };
    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      setOrderId(docRef.id);
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre y apellido"
          value={form.nombre}
          onChange={handleChange}
          className="border rounded-lg px-4 py-3 font-baloo text-base"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="border rounded-lg px-4 py-3 font-baloo text-base"
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="border rounded-lg px-4 py-3 font-baloo text-base"
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección de entrega"
          value={form.direccion}
          onChange={handleChange}
          className="border rounded-lg px-4 py-3 font-baloo text-base"
        />
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