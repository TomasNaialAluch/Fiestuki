# Configuración de MercadoPago para Fiestuki

## 🎯 **IMPORTANTE: Melina debe configurar la API en SU cuenta**

**Todos los pagos van a la cuenta de Melina** (tanto MercadoPago como transferencias bancarias).

## 📋 Pasos para Configurar MercadoPago

### 1. Melina debe crear la API en SU cuenta
1. **Melina entra** a su cuenta de MercadoPago
2. **Ve al Panel de Desarrolladores:** https://www.mercadopago.com.ar/developers
3. **Completa la verificación** de identidad si es necesario

### 2. Crear Aplicación en MercadoPago
**Melina debe hacer lo siguiente:**
1. **Hacer clic en "Crear aplicación"**
2. **Completar los datos:**
   - **Nombre:** "Fiestuki"
   - **Descripción:** "Tienda online de productos para fiestas"
   - **Categoría:** "E-commerce" o "Retail"
3. **Guardar la aplicación**

### 3. Obtener Credenciales
**Después de crear la aplicación, Melina debe:**
1. **Ir a "Credenciales"** en su aplicación
2. **Copiar la Public Key** y **Access Token**
3. **PASARTE ambas credenciales** para que las pongas en el código
4. **IMPORTANTE**: Usar credenciales de TEST primero para pruebas

### 4. Configurar Variables de Entorno (TÚ haces esto)
**Una vez que Melina te pase las credenciales:**
1. **Crea un archivo `.env`** en la raíz del proyecto
2. **Agrega las credenciales de Melina:**

```env
# Credenciales de Melina para Fiestuki
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-la-clave-publica-de-melina
VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-el-token-de-melina
VITE_WEBHOOK_URL=https://tu-dominio.com/api/mercadopago/webhook
```

**Ejemplo real:**
```env
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-12345678-1234-1234-1234-123456789012
VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-12345678901234567890123456789012-123456-12345678901234567890123456789012-123456
```

### 5. Credenciales de TEST vs PRODUCCIÓN

#### TEST (Para desarrollo):
- Public Key: `TEST-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`
- Access Token: `TEST-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`

#### PRODUCCIÓN (Para usuarios reales):
- Public Key: `APP_USR-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`
- Access Token: `APP_USR-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`

### 6. Reiniciar el Servidor
**Después de configurar las variables de entorno:**
```bash
# Detener el servidor (Ctrl+C) y volver a ejecutar:
npm run dev
```

### 7. Probar la Integración
1. **Usa tarjetas de prueba** de MercadoPago (ver sección abajo)
2. **Verifica que los pagos** se procesen correctamente
3. **Prueba diferentes escenarios** (éxito, fallo, pendiente)
4. **Confirma que el dinero** llegue a la cuenta de Melina

### 8. Configurar Webhooks (Opcional)
1. **En el panel de Melina**, configura la URL de notificaciones
2. **Implementa un endpoint** para recibir notificaciones
3. **Actualiza el estado** de las órdenes automáticamente

## 🔧 Archivos Creados

- `src/services/mercadopago.js` - Servicio para crear preferencias
- `src/components/MercadoPagoButton.jsx` - Botón de pago real
- `src/pages/PaymentSuccess.jsx` - Página de pago exitoso
- `src/pages/PaymentFailure.jsx` - Página de pago fallido
- `env.example` - Ejemplo de variables de entorno

## 🚨 Importante

1. **NUNCA** expongas el Access Token en el frontend
2. **SIEMPRE** usa HTTPS en producción
3. **VALIDA** los pagos en el backend
4. **PRUEBA** con credenciales de TEST primero

## 📱 Tarjetas de Prueba

### Aprobada:
- Número: 4009 1753 3280 6176
- CVV: 123
- Fecha: Cualquier fecha futura

### Rechazada:
- Número: 4000 0000 0000 0002
- CVV: 123
- Fecha: Cualquier fecha futura

## 🔄 Flujo de Pago

1. **Usuario selecciona MercadoPago**
2. **Se crea una preferencia** con los datos del pedido (usando credenciales de Melina)
3. **Usuario es redirigido** a MercadoPago
4. **Usuario completa el pago**
5. **Dinero va directo a la cuenta de Melina** ✅
6. **MercadoPago redirige** de vuelta con el resultado
7. **Se actualiza el estado** de la orden

## 💰 **IMPORTANTE: Flujo de Dinero**
```
Usuario compra → Paga por MercadoPago → Dinero va a MELINA ✅
Usuario compra → Paga por Transferencia → Dinero va a MELINA ✅
```

## 📋 **RESUMEN DE TAREAS**

### **Para Melina:**
1. ✅ Entrar a su cuenta de MercadoPago
2. ✅ Ir a https://www.mercadopago.com.ar/developers
3. ✅ Crear aplicación "Fiestuki"
4. ✅ Copiar Public Key y Access Token
5. ✅ Pasarte las credenciales

### **Para Ti:**
1. ✅ Crear archivo `.env` con las credenciales de Melina
2. ✅ Reiniciar el servidor (`npm run dev`)
3. ✅ Probar con tarjetas de prueba
4. ✅ Confirmar que el dinero llegue a Melina

## 📞 Soporte

Si tienes problemas:
1. Revisa la [documentación oficial](https://www.mercadopago.com.ar/developers)
2. Consulta el [centro de ayuda](https://www.mercadopago.com.ar/ayuda)
3. Contacta al soporte técnico de MercadoPago
