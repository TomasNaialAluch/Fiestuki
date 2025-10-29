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

    // Verificar token
    const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
    console.log('🔍 MercadoPago - Verificando token:', {
      existe: !!accessToken,
      tipo: accessToken?.startsWith('TEST-') ? 'TEST' : accessToken?.startsWith('APP_USR-') ? 'PRODUCCIÓN' : 'DESCONOCIDO',
      primerosChars: accessToken?.substring(0, 20) || 'NO HAY TOKEN'
    });

    if (!accessToken) {
      console.error('❌ ERROR: No hay ACCESS_TOKEN configurado');
      throw new Error('ACCESS_TOKEN de MercadoPago no configurado');
    }

    console.log('📦 Creando preferencia con datos:', {
      items: orderData.items.length,
      buyerEmail: orderData.buyer.email,
      total: orderData.items.reduce((sum, item) => sum + (item.price || item.precio) * item.quantity, 0)
    });

    // Preparar items validando que unit_price sea número
    const items = orderData.items.map(item => {
      const price = typeof (item.price || item.precio) === 'number' 
        ? (item.price || item.precio) 
        : parseFloat(item.price || item.precio || 0);
      
      if (isNaN(price) || price <= 0) {
        throw new Error(`Precio inválido para el producto: ${item.name || item.nombre}`);
      }

      return {
        id: String(item.id || Date.now()),
        title: String(item.name || item.nombre).substring(0, 256), // MercadoPago limita a 256 caracteres
        description: String(`Producto de Fiestuki - ${item.name || item.nombre}`).substring(0, 500),
        quantity: parseInt(item.quantity || 1),
        unit_price: price,
        currency_id: 'ARS',
      };
    });

    const body = {
      items: items,
      
      payer: {
        name: String(orderData.buyer.nombre || '').substring(0, 256),
        email: String(orderData.buyer.email || '').substring(0, 256)
      },
      
      back_urls: {
        success: `${window.location.origin}/checkout/success`,
        failure: `${window.location.origin}/checkout/failure`,
        pending: `${window.location.origin}/checkout/pending`
      },
      
      auto_return: 'approved',
      
      external_reference: String(orderData.orderId || `FIESTUKI_${Date.now()}`).substring(0, 256)
    };

    // Solo incluir notification_url si está configurada y es válida
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      body.notification_url = webhookUrl;
    }
    
    // Metadata solo si hay datos
    if (orderData.orderId || orderData.buyer.email || orderData.buyer.telefono) {
      body.metadata = {};
      if (orderData.orderId) body.metadata.order_id = String(orderData.orderId).substring(0, 256);
      if (orderData.buyer.email) body.metadata.customer_email = String(orderData.buyer.email).substring(0, 256);
      if (orderData.buyer.telefono) body.metadata.customer_phone = String(orderData.buyer.telefono).substring(0, 256);
    }

    // Crear preferencia usando fetch directamente
    console.log('🚀 Enviando request a MercadoPago API...');
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ ERROR COMPLETO de MercadoPago:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        errors: errorData.errors || [],
        cause: errorData.cause || []
      });
      
      let errorMessage = errorData.message || response.statusText;
      if (errorData.errors && errorData.errors.length > 0) {
        errorMessage += ` - ${errorData.errors.map(e => e.message).join(', ')}`;
      }
      
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    const preference = await response.json();
    console.log('✅ Preferencia creada exitosamente:', {
      id: preference.id,
      initPoint: preference.init_point?.substring(0, 60) + '...'
    });
    
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
