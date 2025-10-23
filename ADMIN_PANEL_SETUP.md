# Panel de Administración - Fiestuki

## 🎯 **Panel de Administración Completo**

El panel de administración permite gestionar pedidos y productos de Fiestuki.

## 🔐 **Sistema de Roles**

### **Roles Disponibles:**
- **`user`**: Usuario normal (por defecto)
- **`admin`**: Administrador con acceso al panel

### **Cómo hacer admin a un usuario:**

#### **Opción 1: Script Automático (Recomendado)**
```bash
# Desde la raíz del proyecto
node scripts/makeAdmin.js
```

**Opciones del script:**
1. **Listar usuarios** - Ver todos los usuarios registrados
2. **Hacer admin por email** - Buscar usuario por email
3. **Hacer admin por ID** - Usar ID directo de Firebase
4. **Salir**

#### **Opción 2: Manual en Firebase Console**
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Busca la colección `users`
5. Encuentra el usuario que quieres hacer admin
6. Edita el campo `role` y cambia de `user` a `admin`

## 🛠️ **Funcionalidades del Panel**

### **1. Gestión de Pedidos**
- ✅ Ver todos los pedidos con información completa
- ✅ Datos del comprador (nombre, email, teléfono, dirección)
- ✅ Lista de productos comprados
- ✅ Método de pago (MercadoPago o Transferencia)
- ✅ Estado del pedido
- ✅ Fecha y hora del pedido
- ✅ Total del pedido

### **2. Gestión de Productos**
- ✅ Ver todos los productos
- ✅ Agregar nuevos productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Subir múltiples imágenes
- ✅ Establecer imagen principal
- ✅ Gestión de stock

## 📱 **Acceso al Panel**

### **Para Administradores:**
1. **Inicia sesión** en tu cuenta de Fiestuki
2. **Ve a la barra de navegación**
3. **Haz clic en "🛠️ Admin"** (solo visible para admins)
4. **O navega directamente** a `/admin`

### **Para Usuarios Normales:**
- ❌ No ven el enlace "Admin" en la navegación
- ❌ Si intentan acceder a `/admin` ven mensaje de "Acceso Denegado"

## 🖼️ **Gestión de Imágenes**

### **Funcionalidades:**
- ✅ **Subir múltiples imágenes** por producto
- ✅ **Drag & Drop** para subir imágenes
- ✅ **Validación de tamaño** (máximo 5MB por imagen)
- ✅ **Validación de tipo** (solo imágenes)
- ✅ **Eliminar imágenes** individuales
- ✅ **Establecer imagen principal** con un clic
- ✅ **Almacenamiento en Firebase Storage**

### **Tipos de Imagen Soportados:**
- JPG/JPEG
- PNG
- GIF
- WebP

## 📋 **Campos de Producto**

### **Información Básica:**
- **Nombre** (obligatorio)
- **Precio** (obligatorio)
- **Categoría** (obligatorio)
- **Descripción** (opcional)
- **Stock** (opcional)

### **Categorías Disponibles:**
- `cumpleaños`
- `despedida`
- `baby-shower`
- `religion`
- `fiestas-patrias`

## 🔄 **Flujo de Trabajo**

### **Agregar Producto:**
1. Ir al panel de admin
2. Pestaña "Productos"
3. Clic en "Agregar Producto"
4. Completar formulario
5. Subir imágenes
6. Guardar

### **Editar Producto:**
1. Ir al panel de admin
2. Pestaña "Productos"
3. Clic en "Editar" en el producto
4. Modificar campos necesarios
5. Actualizar imágenes si es necesario
6. Guardar

### **Ver Pedidos:**
1. Ir al panel de admin
2. Pestaña "Pedidos"
3. Ver información completa de cada pedido
4. Contactar cliente si es necesario

## 🚨 **Importante**

### **Seguridad:**
- ✅ Solo usuarios con `role: 'admin'` pueden acceder
- ✅ Verificación automática en cada carga
- ✅ Interfaz oculta para usuarios normales

### **Backup:**
- ✅ Todos los datos se guardan en Firebase
- ✅ Las imágenes se almacenan en Firebase Storage
- ✅ Los cambios son inmediatos y persistentes

## 📞 **Soporte**

Si tienes problemas:
1. Verifica que el usuario tenga `role: 'admin'` en Firebase
2. Revisa la consola del navegador para errores
3. Confirma que las credenciales de Firebase estén configuradas
4. Verifica los permisos de Firebase Storage

## 🎯 **Próximas Funcionalidades**

- [ ] Estadísticas de ventas
- [ ] Exportar pedidos a Excel
- [ ] Notificaciones de nuevos pedidos
- [ ] Gestión de categorías
- [ ] Descuentos y promociones
- [ ] Inventario automático



