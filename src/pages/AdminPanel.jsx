// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FaShoppingBag, FaBox, FaUser, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ProductForm from '../components/ProductForm';

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Verificar si es admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF4E4] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        await loadOrders();
      } else if (activeTab === 'products') {
        await loadProducts();
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProducts(productsData);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#FAF4E4]">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold font-baloo text-[#FF6B35]">
            🛠️ Panel de Administración
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.displayName || user?.email}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaShoppingBag className="w-5 h-5" />
              Pedidos ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaBox className="w-5 h-5" />
              Productos ({products.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
            </div>
          ) : (
            <>
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FaShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-500">No hay pedidos aún</h3>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              Pedido #{order.id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#FF6B35]">
                              {formatPrice(order.total)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.paymentMethod === 'mercadopago' ? '💳 MercadoPago' : '🏦 Transferencia'}
                            </p>
                          </div>
                        </div>

                        {/* Buyer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">📋 Datos del Comprador</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Nombre:</strong> {order.buyer?.nombre}</p>
                              <p><strong>Email:</strong> {order.buyer?.email}</p>
                              <p><strong>Teléfono:</strong> {order.buyer?.telefono}</p>
                              <p><strong>Dirección:</strong> {order.buyer?.direccion}</p>
                            </div>
                          </div>
                          
                          {/* Items */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">🛒 Productos</h4>
                            <div className="space-y-2">
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                  <span>{item.name || item.nombre} x {item.quantity}</span>
                                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending_payment'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status === 'completed' ? '✅ Completado' : 
                               order.status === 'pending_payment' ? '⏳ Pago Pendiente' : '📦 En Proceso'}
                            </span>
                          </div>
                          <button className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E55A31] transition-colors">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Gestión de Productos</h2>
                    <button 
                      onClick={() => {
                        setEditingProduct(null);
                        setShowProductForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E55A31] transition-colors"
                    >
                      <FaPlus className="w-4 h-4" />
                      Agregar Producto
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-500">No hay productos aún</h3>
                      <p className="text-gray-400 mt-2">Agrega tu primer producto para empezar</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                            {product.mainImage ? (
                              <img 
                                src={product.mainImage} 
                                alt={product.name || product.nombre}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <FaBox className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          
                          <h3 className="font-bold text-lg mb-2">
                            {product.name || product.nombre}
                          </h3>
                          
                          <p className="text-2xl font-bold text-[#FF6B35] mb-4">
                            {formatPrice(product.price || product.precio)}
                          </p>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductForm(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <FaEdit className="w-4 h-4" />
                              Editar
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                              <FaTrash className="w-4 h-4" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            loadProducts();
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
