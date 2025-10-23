// src/services/mercadopago.js

// Función para crear una preferencia de pago
export const createPaymentPreference = async (orderData) => {
  try {
    // Validar datos requeridos
    if (!orderData || !orderData.items || !orderData.buyer) {
      throw new Error('Datos de orden incompletos');
    }

    if (!orderData.buyer.nombre || !orderData.buyer.email) {
      throw new Error('Datos del comprador incompletos');
    }

    if (!orderData.items.length) {
      throw new Error('No hay productos en el carrito');
    }

    console.log('Creando preferencia con datos:', orderData);

    const body = {
      items: orderData.items.map(item => ({
        id: item.id,
        title: item.name || item.nombre,
        description: `Producto de Fiestuki - ${item.name || item.nombre}`,
        quantity: item.quantity,
        unit_price: item.price || item.precio,
        currency_id: 'ARS',
      })),
      
      payer: {
        name: orderData.buyer.nombre,
        email: orderData.buyer.email
      },
      
      back_urls: {
        success: `${window.location.origin}/checkout/success`,
        failure: `${window.location.origin}/checkout/failure`,
        pending: `${window.location.origin}/checkout/pending`
      },
      
      auto_return: 'approved',
      
      external_reference: orderData.orderId || `FIESTUKI_${Date.now()}`,
      
      notification_url: import.meta.env.VITE_WEBHOOK_URL || `${window.location.origin}/api/mercadopago/webhook`,
      
      metadata: {
        order_id: orderData.orderId,
        customer_email: orderData.buyer.email,
        customer_phone: orderData.buyer.telefono
      }
    };

    // Crear preferencia usando fetch directamente
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de MercadoPago:', errorData);
      throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    const preference = await response.json();
    
    return {
      success: true,
      preferenceId: preference.id,
      initPoint: preference.init_point
    };
    
  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para obtener el estado de un pago
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN}`
      }
    });
    
    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error('Error obteniendo estado del pago:', error);
    return null;
  }
};

export default { createPaymentPreference, getPaymentStatus };
