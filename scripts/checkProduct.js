// scripts/checkProduct.js
import { db } from '../src/services/firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

async function checkProduct(productName) {
  console.log(`🔍 Buscando producto: "${productName}"`);
  console.log('=====================================\n');

  try {
    // Crear consulta para buscar por nombre
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where("name", "==", productName));
    
    // Ejecutar consulta
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // ❌ No existe
      console.log('❌ PRODUCTO NO ENCONTRADO');
      console.log(`El producto "${productName}" no existe en la base de datos.`);
      return false;
    } else {
      // ✅ Existe
      console.log('✅ PRODUCTO ENCONTRADO');
      console.log('=======================\n');
      
      // Mostrar información del producto
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`📄 ID del documento: ${doc.id}`);
        console.log(`📝 Nombre: ${data.name}`);
        console.log(`💰 Precio: $${data.price}`);
        console.log(`📦 Stock: ${data.stock}`);
        console.log(`🔗 Slug: ${data.slug}`);
        console.log(`🔄 Activo: ${data.active ? 'SÍ' : 'NO'}`);
        console.log(`📅 Creado: ${data.createdAt?.toDate?.() || data.createdAt}`);
        console.log(`🖼️  Imagen principal: ${data.mainImage ? 'SÍ' : 'NO'}`);
        console.log(`📷 Otras imágenes: ${data.images?.length || 0}`);
        console.log(`🏷️  Tags: ${data.tags?.join(', ') || 'Sin tags'}`);
      });
      
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error al buscar producto:', error.message);
    return false;
  }
}

// Exportar para usar en otros scripts
export { checkProduct };

// 🔧 CAMBIO IMPORTANTE: Solo ejecutar si se llama directamente Y tiene argumentos
if (import.meta.url === `file://${process.argv[1]}` && process.argv[2]) {
  const productName = process.argv.slice(2).join(' ');
  
  checkProduct(productName).then((exists) => {
    console.log(`\n🎯 Resultado: ${exists ? 'EXISTE' : 'NO EXISTE'}`);
    process.exit(0);
  });
} else if (import.meta.url === `file://${process.argv[1]}` && !process.argv[2]) {
  console.error('❌ Por favor proporciona el nombre del producto');
  console.log('📝 Uso: node scripts/checkProduct.js "Nombre del Producto"');
  console.log('💡 Ejemplos:');
  console.log('   node scripts/checkProduct.js "Animales de la Selva"');
  console.log('   node scripts/checkProduct.js Globos');
  process.exit(1);
}