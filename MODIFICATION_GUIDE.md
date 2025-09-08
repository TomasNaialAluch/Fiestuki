# 🔧 Guía de Modificaciones

## ✅ Modificaciones Comunes

### 1. Cambiar colores del tema
**Archivo:** `src/utils/constants.js`
```javascript
STYLES: {
  COLORS: {
    primary: '#tu-color-aquí',
    secondary: '#tu-color-aquí'
  }
}
```

### 2. Agregar nuevo método de pago
**Archivo:** `src/components/PaymentMethods.jsx`
```javascript
// Agregar en el array:
['💳 Visa', '💳 Mastercard', '💰 Efectivo', '🆕 Nuevo método']
```

### 3. Cambiar breakpoint mobile
**Archivo:** `src/hooks/useDeviceDetection.js`
```javascript
setIsMobile(window.innerWidth <= 992); // Cambiar 768 por tu valor
```

### 4. Agregar validación de stock
**Archivo:** `src/components/ProductInfo.jsx`
```javascript
// En el botón +
onClick={() => quantity < item.stock && setQuantity(quantity + 1)}
```

## 🆕 Nuevas Funcionalidades

### Agregar zoom a imágenes:
1. Crear `src/hooks/useProductZoom.js`
2. Importar en `ProductGallery.jsx`
3. Agregar evento onMouseMove

### Agregar carrito de compras:
1. Crear `src/context/CartContext.jsx`
2. Modificar `handleAddToCart` en `ItemDetail.jsx`
3. Agregar persistencia con localStorage

### Sistema de favoritos:
1. Crear `src/hooks/useWishlist.js`
2. Agregar botón corazón en `ProductInfo.jsx`
3. Persistir en Firebase/localStorage

## ⚠️ Precauciones

### NO modificar directamente:
- Props de hooks existentes (pueden romper funcionalidad)
- Estructura de `item` object sin actualizar todos los componentes
- Imports/exports sin verificar dependencias

### SÍ es seguro modificar:
- Estilos CSS inline
- Textos y labels
- Constantes en `constants.js`
- Lógica dentro de componentes específicos