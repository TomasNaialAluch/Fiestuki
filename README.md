# 🎉 Fiestuki — Proyecto Final (React + Vite + Firebase)

Pequeña SPA e-commerce desarrollada con React y Vite.  
Tema: Fiestuki — tienda de artículos para fiestas.

---

## ✨ Qué incluye
- Listado dinámico de productos (Firestore)
- Página de detalle (ItemDetail) con galería e ItemCount
- Carrito global con Context + SideCart
- Checkout que crea órdenes en Firestore y muestra ID de la orden
- **📧 Notificaciones por email** con Firebase Trigger Email extension
- Autenticación: Email/Password y Google (Firebase Auth)
- Responsive: estilos pensados para Desktop y Mobile
- Sistema de notificaciones toast y búsqueda inteligente
- Documentación interna: COMPONENTS_MAP, TECHNICAL_DOCS, MODIFICATION_GUIDE

---

## 🧰 Requisitos
- Node.js >= 16
- Cuenta Firebase con Firestore y Authentication habilitados
- **Gmail con verificación en 2 pasos** para notificaciones por email

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
4. **Configurar notificaciones por email** (opcional):
   - Instalar Firebase Extension "Trigger Email from Firestore"
   - Configurar Gmail SMTP con App Password
   - Ver sección "📧 Configuración de Email" más abajo
5. Levantar servidor de desarrollo:
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
- **VITE_GOOGLE_MAPS_API_KEY** (para mapas de ubicación)

### **🗺️ Configurar Google Maps API:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita la **Maps JavaScript API**
4. Crea una **API Key** con restricciones de dominio
5. Agrega la key a tu archivo `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```

---

## 📧 Configuración de Email (Firebase Extension)

### **Paso 1: Instalar Firebase Extension**
1. Ve a [Firebase Console](https://console.firebase.google.com/) → Tu proyecto
2. Navega a **Extensions** en el menú lateral
3. Busca **"Trigger Email from Firestore"**
4. Haz clic en **"Install"**

### **Paso 2: Configurar Gmail SMTP**
1. **Habilitar verificación en 2 pasos** en tu cuenta de Google
2. **Generar App Password:**
   - Ve a [Google Account Security](https://myaccount.google.com/security)
   - Busca "Contraseñas de aplicación"
   - Genera una nueva contraseña para "Firebase"
   - **Guarda la contraseña** (formato: `xxxx xxxx xxxx xxxx`)

### **Paso 3: Configurar la Extensión**
En la configuración de la extensión, completa:

- **Firestore Instance ID:** `(default)`
- **Firestore Instance Location:** `southamerica-east1` (o tu región)
- **Authentication Type:** `UsernamePassword`
- **SMTP connection URI:** 
  ```
  smtps://tu-email@gmail.com:tu-app-password@smtp.gmail.com:465
  ```
  **Ejemplo:**
  ```
  smtps://tomasaluch.ar@gmail.com:hmya hrkd irfd tbtl@smtp.gmail.com:465
  ```

### **Paso 4: Probar la configuración**
1. Haz una compra en la app
2. La extensión enviará automáticamente un email de confirmación
3. Revisa la carpeta de **Spam** si no llega inmediatamente

### **🔧 Cómo funciona**
- Cuando se crea una orden en Firestore (`orders` collection)
- La extensión detecta el evento automáticamente
- Envía un email con los detalles de la compra
- **No requiere código adicional** - funciona automáticamente

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

### **📧 Notificaciones automáticas**
- **Firebase Extension "Trigger Email"** detecta nuevas órdenes
- Envía email de confirmación automáticamente
- **No requiere código adicional** - funciona con la extensión

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


