# 📚 Documentación Técnica - ItemDetail Module

## 🎯 Propósito
Sistema modular para mostrar detalles de productos con galería de imágenes, información de producto y funcionalidad responsive.

## 🏗️ Arquitectura del Módulo

### 📦 Componentes Principales

#### 1. `ItemDetail.jsx` - Componente Orquestador
**Ubicación:** `src/components/ItemDetail.jsx`
**Propósito:** Punto de entrada principal que decide entre versión desktop/mobile

```jsx
// Props que recibe:
{
  item: {
    name: string,
    price: number,
    mainImage: string,
    images: array,
    category: string,
    description: string,
    stock: number
  }
}
```

**Responsabilidades:**
- Detectar tipo de dispositivo (desktop/mobile)
- Manejar estado de cantidad
- Coordinar hooks de galería
- Renderizar componente apropiado según dispositivo

#### 2. `ProductGallery.jsx` - Galería de Imágenes
**Ubicación:** `src/components/ProductGallery.jsx`
**Propósito:** Mostrar imagen principal y miniaturas

```jsx
// Props que recibe:
{
  allImages: array,
  selectedImage: number,
  onPrevImage: function,
  onNextImage: function,
  onSelectImage: function,
  itemName: string
}
```

**Características:**
- Navegación con flechas
- Miniaturas clickeables
- Responsive design
- Fallback para imágenes faltantes

#### 3. `ProductInfo.jsx` - Información del Producto
**Ubicación:** `src/components/ProductInfo.jsx`
**Propósito:** Mostrar datos del producto y controles de compra

```jsx
// Props que recibe:
{
  item: object,
  quantity: number,
  setQuantity: function,
  onAddToCart: function
}
```

**Incluye:**
- Título y precio
- Métodos de pago
- Controles de cantidad
- Botón agregar al carrito

#### 4. `PaymentMethods.jsx` - Métodos de Pago
**Ubicación:** `src/components/PaymentMethods.jsx`
**Propósito:** Mostrar opciones de pago disponibles

**Características:**
- Lista de métodos (Visa, Mastercard, Efectivo)
- Diseño visual atractivo
- Información de cuotas

#### 5. `ItemDetailMobile.jsx` - Versión Móvil
**Ubicación:** `src/components/ItemDetailMobile.jsx`
**Propósito:** Versión optimizada para dispositivos móviles

**Diferencias con desktop:**
- Layout vertical
- Controles más grandes
- Galería simplificada
- Mejor UX táctil

### 🎣 Custom Hooks

#### 1. `useDeviceDetection.js`
**Ubicación:** `src/hooks/useDeviceDetection.js`
**Propósito:** Detectar si es dispositivo móvil

```javascript
// Retorna:
{
  isMobile: boolean  // true si width <= 768px
}
```

**Funcionalidad:**
- Listener de resize
- Breakpoint configurable
- Cleanup automático

#### 2. `useImageGallery.js`
**Ubicación:** `src/hooks/useImageGallery.js`
**Propósito:** Manejar lógica de galería de imágenes

```javascript
// Parámetros:
item: object

// Retorna:
{
  selectedImage: number,
  allImages: array,
  handlePrevImage: function,
  handleNextImage: function,
  selectImage: function
}
```

**Funcionalidad:**
- Combina mainImage + images array
- Navegación circular
- Memoización para performance

### 🛠️ Utilidades

#### 1. `constants.js`
**Ubicación:** `src/utils/constants.js`
**Propósito:** Constantes globales del proyecto

```javascript
PRODUCT_CONSTANTS: {
  DEFAULT_QUANTITY: 1,
  ZOOM_SCALE: 2.5,
  TAX_RATE: 1.215,
  FREE_SHIPPING_THRESHOLD: 50000
}

STYLES: {
  COLORS: { ... },
  FONT_FAMILY: "'Baloo 2', sans-serif"
}
```

## 🔄 Flujo de Datos

```
ItemDetail (entrada)
    ↓
useDeviceDetection → isMobile?
    ↓                    ↓
Desktop              Mobile
    ↓                    ↓
ProductGallery      ItemDetailMobile
ProductInfo
    ↓
PaymentMethods
```

## 🎨 Sistema de Estilos

### Colores principales:
- `primary`: #ff6b6b (Rosa/Coral)
- `secondary`: #4ecdc4 (Turquesa)
- `yellow`: #ffd93d (Amarillo)
- `background`: #faf4e4 (Beige claro)

### Breakpoints:
- Mobile: ≤ 768px
- Desktop: > 768px

## 🔧 Configuración de Performance

### Optimizaciones implementadas:
- `useCallback` para funciones
- `useMemo` para arrays calculados
- Lazy loading de imágenes
- Componentes memoizados

## 🚀 Cómo Escalar

### Para agregar nuevas funcionalidades:

1. **Nueva galería de funciones:**
   - Crear hook en `src/hooks/`
   - Importar en `ItemDetail.jsx`

2. **Nuevos componentes:**
   - Crear en `src/components/`
   - Seguir patrón de props consistente

3. **Nuevas utilidades:**
   - Agregar a `src/utils/`
   - Exportar desde archivos existentes

### Ejemplos de extensiones futuras:
- `useProductZoom.js` - Zoom de imágenes
- `ProductReviews.jsx` - Sistema de reseñas
- `ProductRecommendations.jsx` - Productos relacionados
- `useWishlist.js` - Lista de deseos

## 📝 Convenciones de Código

### Nomenclatura:
- Componentes: PascalCase (`ProductGallery.jsx`)
- Hooks: camelCase con prefijo use (`useImageGallery.js`)
- Constantes: UPPER_SNAKE_CASE (`DEFAULT_QUANTITY`)

### Estructura de archivos:
```jsx
// 1. Imports
import React from 'react';
import Component from './Component.jsx';

// 2. Componente
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Estado y hooks
  const [state, setState] = useState();
  
  // 4. Funciones
  const handleClick = () => {};
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 6. Export
export default MyComponent;
```

## 🐛 Debugging

### Logs útiles:
```javascript
console.log('ItemDetail props:', { item, quantity });
console.log('Gallery state:', { selectedImage, allImages });
console.log('Device detection:', { isMobile });
```

### Errores comunes:
1. **Imágenes no cargan:** Verificar URLs en `item.mainImage` y `item.images`
2. **Hook no funciona:** Verificar que el componente padre pase props correctas
3. **Responsive no funciona:** Verificar breakpoint en `useDeviceDetection`

## 📋 Checklist para nuevos desarrolladores

- [ ] Entender estructura de `item` object
- [ ] Revisar flujo de props entre componentes
- [ ] Probar en mobile y desktop
- [ ] Verificar que todas las imágenes carguen
- [ ] Testear controles de cantidad
- [ ] Validar responsive design