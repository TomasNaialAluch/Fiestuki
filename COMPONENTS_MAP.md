# 🗺️ Mapa de Componentes

## 📊 Jerarquía Visual

```
ItemDetail
├── useDeviceDetection()
├── useImageGallery()
├── ProductGallery
│   ├── Imagen principal
│   ├── Botones navegación
│   └── Miniaturas
├── ProductInfo
│   ├── Título y precio
│   ├── PaymentMethods
│   ├── Controles cantidad
│   └── Botón compra
└── ItemDetailMobile (alternativo)
    ├── Galería mobile
    ├── PaymentMethods
    └── Controles mobile
```

## 🔗 Dependencias entre archivos

```
ItemDetail.jsx
├── imports useDeviceDetection from ../hooks/
├── imports useImageGallery from ../hooks/
├── imports ProductGallery from ./
├── imports ProductInfo from ./
├── imports ItemDetailMobile from ./
└── imports constants from ../utils/

ProductInfo.jsx
└── imports PaymentMethods from ./

PaymentMethods.jsx
└── (sin dependencias externas)

ItemDetailMobile.jsx
└── imports PaymentMethods from ./
```

## 📝 Props Flow

```
App.jsx
└── item object
    └── ItemDetail
        ├── item → ProductInfo
        ├── item → useImageGallery
        ├── allImages → ProductGallery
        └── quantity/setQuantity → ProductInfo
```