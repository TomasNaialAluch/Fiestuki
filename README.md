# 🎉 Fiestuki — Proyecto Final (React + Vite + Firebase)

Pequeña SPA e-commerce desarrollada con React y Vite.  
Tema: Fiestuki — tienda de artículos para fiestas.

---

## ✨ Qué incluye
- Listado dinámico de productos (Firestore)
- Página de detalle (ItemDetail) con galería e ItemCount
- Carrito global con Context + SideCart
- Checkout que crea órdenes en Firestore y muestra ID de la orden
- Autenticación: Email/Password y Google (Firebase Auth)
- Responsive: estilos pensados para Desktop y Mobile
- Documentación interna: COMPONENTS_MAP, TECHNICAL_DOCS, MODIFICATION_GUIDE

---

## 🧰 Requisitos
- Node.js >= 16
- Cuenta Firebase con Firestore y Authentication habilitados

---

## 🚀 Instalación rápida
1. Clonar repo:
   ```
   git clone https://github.com/TomasNaialAluch/Fiestuki.git
   cd Fiestuki
   ```
2. Instalar dependencias:
   ```
   npm install
   ```
3. Crear archivo de variables de entorno (ver `.env.example`) y completar con tus credenciales de Firebase.
4. Levantar servidor de desarrollo:
   ```
   npm run dev
   ```

---

## 🔐 Variables de entorno (ejemplo)
Usa prefijo `VITE_` para Vite. Crea un `.env` basado en `.env.example`.

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

(Ver archivo `.env.example` incluido)

---

## 📁 Estructura relevante
- src/pages — Pages (HomePage, Users, Checkout)
- src/components — UI (ItemList, ItemDetail, ItemCount, SideCart, etc.)
- src/context — CartContext, SearchContext
- src/hooks — useDeviceDetection, useImageGallery, useProductZoom
- src/services/firebase.js — inicialización de Firebase
- src/assets — logos, imágenes y GoogleLogo.png

---

## 🧭 Rutas principales
- `/` — Home / catálogo  
- `/category/:categoryId` — Filtrado por categoría  
- `/item/:itemId` — Detalle del producto  
- `/checkout` — Checkout / generar orden  
- `/users` — Login / Registro (Email + Google)

---

## 🔥 Firebase — modelo de datos (resumen)
Colección `products` — documentos con: id, name, price, stock, images, category, description.  
Colección `orders` — cada orden guarda:
- cartId
- createdAt, updatedAt (Timestamp)
- delivery: { sds (dirección), status, shippingCost }
- subtotal, total
- userId (si hay auth)
- items: [{ id, name, price, quantity }]

En checkout se crea un doc en `orders` y se muestra `orderId` al usuario.

---

## ✅ Validaciones y UX importantes
- ItemCount valida mínimo y máximo por stock (suma lo que ya hay en cart).
- ItemCount se oculta en ItemDetail tras agregar y muestra CTA alternativos.
- Si el carrito está vacío, el botón Checkout muestra aviso en SideCart.
- Mensajes condicionales: "producto sin stock", "carrito vacío", loaders.

---

## 📦 Scripts útiles
- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run preview` — previsualizar build

---

## 📤 Despliegue
Recomendado: Vercel o Netlify.  
Recordá configurar las variables de entorno en el panel del servicio.

---

## 🧾 Notas para la entrega
- Incluí `.env.example` (no subas `.env` con credenciales).
- README con instrucciones claras (este archivo).
- Repositorio público: `ProyectoFinal+Apellido` (ej: ProyectoFinal+Aluch).

---

## ✍️ Autor
Tomás Aluch

--- 
¡Listo! Colocá `.env.example` y probá correr `npm run dev`. Si querés, lo subo también al repo con otro fragmento listo para pegar.


