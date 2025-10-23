# 🚀 Guía de Migración: React + Vite → Next.js

## ✅ **¿Por qué migrar a Next.js?**

### **Ventajas que obtienes:**
- **SEO mejorado**: Mejor indexación en Google
- **Rendimiento**: Server-side rendering y optimizaciones automáticas
- **Deploy más fácil**: Vercel, Netlify, etc.
- **API Routes**: Backend integrado
- **Imágenes optimizadas**: Componente `next/image`
- **Bundle splitting automático**

## 📋 **Pasos para la Migración**

### **1. Instalar Next.js**
```bash
# Crear backup del proyecto actual
cp -r . ../fiestuki-backup

# Instalar Next.js
npm install next@latest react@latest react-dom@latest

# Instalar dependencias de desarrollo
npm install -D eslint-config-next
```

### **2. Reemplazar package.json**
```bash
# Reemplazar tu package.json actual con package-next.json
mv package.json package-vite.json
mv package-next.json package.json
```

### **3. Actualizar scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint"
  }
}
```

### **4. Migrar archivos**
- ✅ **Ya creados**: Estructura de carpetas `app/`
- ✅ **Ya creados**: Páginas convertidas a Next.js
- ✅ **Ya creados**: Layout principal
- ✅ **Ya creados**: Configuración de Next.js

### **5. Actualizar imports en componentes**
Cambiar imports de React Router por Next.js:

```javascript
// ❌ Antes (React Router)
import { useParams, useNavigate } from 'react-router-dom'

// ✅ Después (Next.js)
import { useParams, useRouter } from 'next/navigation'
```

### **6. Variables de entorno**
Crear `.env.local`:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_domain
# ... resto de variables
```

## 🔧 **Cambios Necesarios en el Código**

### **1. Navegación**
```javascript
// ❌ React Router
const navigate = useNavigate()
navigate('/checkout')

// ✅ Next.js
const router = useRouter()
router.push('/checkout')
```

### **2. Parámetros de URL**
```javascript
// ❌ React Router
const { itemId } = useParams()

// ✅ Next.js (igual)
const { itemId } = useParams()
```

### **3. Componentes que necesitan 'use client'**
- Todos los componentes que usan hooks
- Componentes con interactividad
- Contextos y providers

## 🚀 **Comandos de Migración**

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Construir para producción
npm run build

# 4. Ejecutar en producción
npm start
```

## ⚠️ **Consideraciones Importantes**

### **Lo que NO cambia:**
- ✅ Todos tus componentes
- ✅ Contextos y estado
- ✅ Firebase y MercadoPago
- ✅ Estilos y Tailwind
- ✅ Lógica de negocio

### **Lo que SÍ cambia:**
- 🔄 Estructura de carpetas (`app/` en lugar de `src/`)
- 🔄 Routing (App Router en lugar de React Router)
- 🔄 Algunos imports y hooks

## 🎯 **Resultado Final**

Tendrás:
- ✅ **Misma funcionalidad** que tu app actual
- ✅ **Mejor SEO** y rendimiento
- ✅ **Deploy más fácil** en Vercel/Netlify
- ✅ **Optimizaciones automáticas**
- ✅ **API routes** para backend

## 🆘 **Si algo falla**

1. **Revisar console** para errores
2. **Verificar imports** de Next.js
3. **Añadir 'use client'** donde sea necesario
4. **Revisar variables de entorno**

¿Quieres que proceda con la migración completa?
