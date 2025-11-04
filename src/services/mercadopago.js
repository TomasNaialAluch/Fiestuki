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

    if (!accessToken) {
      console.error('❌ ERROR: No hay ACCESS_TOKEN configurado');
      throw new Error('ACCESS_TOKEN de MercadoPago no configurado');
    }

    /* no-op */

    // Preparar items con normalización estricta (mínimos campos requeridos)
    const items = orderData.items.map(item => {
      const rawPrice = (item.price ?? item.precio ?? 0);
      const numericPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(',', '.'));
      const unitPrice = Number(Number.isFinite(numericPrice) ? numericPrice.toFixed(2) : 0);

      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        throw new Error(`Precio inválido para el producto: ${item.name || item.nombre}`);
      }

      const quantity = Math.max(1, parseInt(item.quantity || 1, 10));

      return {
        title: String(item.name || item.nombre || 'Producto Fiestuki').substring(0, 256),
        quantity,
        unit_price: unitPrice,
        currency_id: 'ARS'
      };
    });

    const body = {
      items: items,
      
      // Payer mínimo (solo email para evitar validaciones extra)
      payer: {
        email: String(orderData.buyer.email || '').substring(0, 256)
      },
      
      back_urls: {
        success: `${window.location.origin}/checkout/success`,
        failure: `${window.location.origin}/checkout/failure`,
        pending: `${window.location.origin}/checkout/pending`
      },
      
      auto_return: 'approved',
      purpose: 'wallet_purchase',
      statement_descriptor: 'FIESTUKI',
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 1
      },
      binary_mode: true,
      
      external_reference: String(orderData.orderId || `FIESTUKI_${Date.now()}`).substring(0, 256)
    };

    // Solo incluir notification_url si está configurada y es válida
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      body.notification_url = webhookUrl;
    }
    
    // Metadata opcional y segura
    const meta = {};
    if (orderData.orderId) meta.order_id = String(orderData.orderId).substring(0, 256);
    if (orderData.buyer?.email) meta.customer_email = String(orderData.buyer.email).substring(0, 256);
    if (orderData.buyer?.telefono) meta.customer_phone = String(orderData.buyer.telefono).substring(0, 64);
    if (Object.keys(meta).length > 0) {
      body.metadata = meta;
    }

    // Crear preferencia usando fetch directamente
    /* no-op */
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    /* no-op */

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      /* no-op */
      
      let errorMessage = errorData.message || response.statusText;
      if (errorData.errors && errorData.errors.length > 0) {
        errorMessage += ` - ${errorData.errors.map(e => e.message).join(', ')}`;
      }
      
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    const preference = await response.json();
    /* no-op */
    
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
