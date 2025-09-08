// scripts/modifyProduct.js
import { db } from '../src/services/firebase.js';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Función para mostrar todos los productos
async function getAllProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error.message);
    return [];
  }
}

// 🎯 FUNCIÓN DINÁMICA: Obtener campos del producto + campos faltantes
function getProductFields(product) {
  const fields = [];
  const excludeFields = ['id', 'createdAt', 'updatedAt']; // Campos que no se pueden modificar
  
  // Campos existentes en el producto
  Object.keys(product).forEach((key, index) => {
    if (!excludeFields.includes(key)) {
      fields.push({
        key: key,
        value: product[key],
        displayName: getFieldDisplayName(key),
        emoji: getFieldEmoji(key),
        exists: true
      });
    }
  });
  
  // ⭐ NUEVO: Verificar si falta el campo 'category'
  if (!product.hasOwnProperty('category')) {
    fields.push({
      key: 'category',
      value: null,
      displayName: 'Categoría',
      emoji: '📂',
      exists: false
    });
  }
  
  return fields;
}

// 🎯 FUNCIÓN DINÁMICA: Nombres amigables para mostrar
function getFieldDisplayName(fieldKey) {
  const displayNames = {
    'name': 'Nombre',
    'price': 'Precio',
    'stock': 'Stock',
    'slug': 'Slug',
    'description': 'Descripción',
    'category': 'Categoría',
    'mainImage': 'Imagen Principal (URL)',
    'images': 'Otras Imágenes (URLs)',
    'tags': 'Tags',
    'active': 'Estado Activo',
    'descriptionImages': 'Descripciones de Imágenes'
  };
  
  return displayNames[fieldKey] || fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1);
}

// 🎯 FUNCIÓN DINÁMICA: Emojis para los campos
function getFieldEmoji(fieldKey) {
  const emojis = {
    'name': '📝',
    'price': '💰',
    'stock': '📦',
    'slug': '🔗',
    'description': '📋',
    'category': '📂',
    'mainImage': '🖼️',
    'images': '📷',
    'tags': '🏷️',
    'active': '🔄',
    'descriptionImages': '📸'
  };
  
  return emojis[fieldKey] || '📄';
}

// 🎯 FUNCIÓN DINÁMICA: Mostrar valor del campo (actualizada)
function displayFieldValue(key, value, exists = true) {
  if (!exists) {
    return '❌ No creado';
  }
  
  if (value === null || value === undefined) {
    return 'Sin valor';
  }
  
  switch (key) {
    case 'price':
      return `$${value}`;
    case 'active':
      return value ? 'SÍ' : 'NO';
    case 'tags':
    case 'images':
    case 'descriptionImages':
      return Array.isArray(value) ? value.join(', ') : 'Sin elementos';
    case 'createdAt':
    case 'updatedAt':
      return value?.toDate?.() || value;
    default:
      return typeof value === 'string' && value.length > 100 
        ? value.substring(0, 100) + '...' 
        : value.toString();
  }
}

// 🎯 FUNCIÓN DINÁMICA: Menú basado en campos reales
function showModificationMenu(product) {
  const fields = getProductFields(product);
  
  console.log('\n📝 ¿QUÉ QUERÉS MODIFICAR?');
  console.log('========================');
  
  fields.forEach((field, index) => {
    console.log(`${index + 1}. ${field.emoji} ${field.displayName}`);
  });
  
  console.log(`${fields.length + 1}. 📊 Ver producto completo`);
  console.log(`${fields.length + 2}. ✅ Guardar cambios`);
  console.log('0. ❌ Cancelar');
  
  return fields;
}

// 🎯 FUNCIÓN DINÁMICA: Mostrar producto completo (actualizada)
function showCurrentProduct(product) {
  const fields = getProductFields(product);
  
  console.log('\n📋 PRODUCTO ACTUAL:');
  console.log('==================');
  console.log(`📄 ID: ${product.id}`);
  
  fields.forEach(field => {
    console.log(`${field.emoji} ${field.displayName}: ${displayFieldValue(field.key, field.value, field.exists)}`);
  });
  
  // Mostrar campos de solo lectura
  if (product.createdAt) {
    console.log(`📅 Creado: ${product.createdAt?.toDate?.() || product.createdAt}`);
  }
  if (product.updatedAt) {
    console.log(`🔄 Actualizado: ${product.updatedAt?.toDate?.() || product.updatedAt}`);
  }
}

// 🎯 FUNCIÓN DINÁMICA: Modificar campo específico (actualizada)
async function modifyField(product, field) {
  console.log(`\n${field.emoji} Modificando: ${field.displayName}`);
  console.log('='.repeat(30));
  console.log(`Valor actual: ${displayFieldValue(field.key, field.value, field.exists)}`);
  
  let newValue;
  
  switch (field.key) {
    case 'price':
      const priceInput = await askQuestion('💰 Nuevo precio: $');
      newValue = parseFloat(priceInput);
      if (isNaN(newValue) || newValue < 0) {
        console.log('❌ Precio inválido');
        return null;
      }
      break;
      
    case 'stock':
      const stockInput = await askQuestion('📦 Nuevo stock: ');
      newValue = parseInt(stockInput);
      if (isNaN(newValue) || newValue < 0) {
        console.log('❌ Stock inválido');
        return null;
      }
      break;
      
    case 'active':
      const activeInput = await askQuestion('🔄 ¿Activo? (y/n): ');
      newValue = activeInput.toLowerCase() === 'y' || activeInput.toLowerCase() === 'yes';
      break;

    case 'category':
      // ⭐ NUEVO: Manejar categoría existente o no existente
      if (!field.exists) {
        console.log('\n⚠️  EL PARÁMETRO CATEGORY NO EXISTE');
        console.log('====================================');
        const createCategory = await askQuestion('¿Querés crearlo? (y/n): ');
        
        if (createCategory.toLowerCase() !== 'y' && createCategory.toLowerCase() !== 'yes') {
          console.log('❌ Creación de categoría cancelada');
          return null;
        }
        
        console.log('\n📂 Creando parámetro CATEGORY...');
      }
      
      console.log('\n📂 CATEGORÍAS DISPONIBLES:');
      console.log('==========================');
      console.log('1. cumpleaños');
      console.log('2. despedida');
      console.log('3. baby shower');
      console.log('4. religión');
      console.log('5. fiestas patrias');
      
      const categoryChoice = await askQuestion('\n🔢 Elegí el número de la categoría: ');
      const categoryIndex = parseInt(categoryChoice) - 1;
      
      const categories = ['cumpleaños', 'despedida', 'baby shower', 'religión', 'fiestas patrias'];
      
      if (categoryIndex < 0 || categoryIndex >= categories.length) {
        console.log('❌ Número de categoría inválido');
        return null;
      }
      
      newValue = categories[categoryIndex];
      
      if (!field.exists) {
        console.log(`✅ Parámetro CATEGORY creado con valor: ${newValue}`);
      } else {
        console.log(`✅ Categoría actualizada: ${newValue}`);
      }
      break;
      
    case 'tags':
    case 'images':
    case 'descriptionImages':
      console.log('💡 Separar elementos con comas (ejemplo: "fiesta, cumpleanos, safari")');
      const arrayInput = await askQuestion(`${field.emoji} Nuevos valores: `);
      if (arrayInput.trim()) {
        newValue = arrayInput.split(',').map(item => item.trim()).filter(item => item);
      } else {
        newValue = [];
      }
      break;
      
    default:
      newValue = await askQuestion(`${field.emoji} Nuevo valor: `);
      if (!newValue.trim()) {
        console.log('❌ Valor vacío');
        return null;
      }
      break;
  }
  
  console.log(`✅ ${field.displayName} actualizado`);
  return newValue;
}

async function modifyProduct() {
  console.log('🔧 MODIFICADOR DE PRODUCTOS FIESTUKI (DINÁMICO)');
  console.log('===============================================\n');

  try {
    // 1. Obtener todos los productos
    console.log('🔍 Obteniendo productos de Firebase...');
    const products = await getAllProducts();

    if (products.length === 0) {
      console.log('❌ No se encontraron productos en la base de datos.');
      return;
    }

    // 2. Mostrar productos disponibles
    console.log('\n📦 PRODUCTOS DISPONIBLES:');
    console.log('=========================');
    products.forEach((product, index) => {
      const activeStatus = product.active ? '✅' : '❌';
      const price = product.price ? `$${product.price}` : 'Sin precio';
      const category = product.category ? `(${product.category})` : '(sin categoría)';
      console.log(`${index + 1}. ${product.name || 'Sin nombre'} ${category} ${activeStatus} - ${price}`);
    });

    // 3. Elegir producto
    const productChoice = await askQuestion('\n🔢 Elegí el número del producto a modificar: ');
    const selectedIndex = parseInt(productChoice) - 1;

    if (selectedIndex < 0 || selectedIndex >= products.length) {
      console.log('❌ Número inválido');
      return;
    }

    let selectedProduct = { ...products[selectedIndex] };
    const originalProduct = { ...products[selectedIndex] };
    let hasChanges = false;

    console.log(`\n✅ Seleccionaste: ${selectedProduct.name || selectedProduct.id}`);
    
    // 4. Menú de modificación dinámico
    let continueModifying = true;
    
    while (continueModifying) {
      showCurrentProduct(selectedProduct);
      const availableFields = showModificationMenu(selectedProduct);
      
      const choice = await askQuestion('\n🔢 Elegí una opción: ');
      const choiceNum = parseInt(choice);
      
      if (choiceNum >= 1 && choiceNum <= availableFields.length) {
        // Modificar campo específico
        const fieldToModify = availableFields[choiceNum - 1];
        const newValue = await modifyField(selectedProduct, fieldToModify);
        
        if (newValue !== null) {
          selectedProduct[fieldToModify.key] = newValue;
          hasChanges = true;
        }
        
      } else if (choiceNum === availableFields.length + 1) {
        // Ver producto completo
        showCurrentProduct(selectedProduct);
        await askQuestion('\n📄 Presiona Enter para continuar...');
        
      } else if (choiceNum === availableFields.length + 2) {
        // Guardar cambios
        if (!hasChanges) {
          console.log('⚠️  No hay cambios para guardar.');
          continue;
        }

        console.log('\n💾 GUARDANDO CAMBIOS...');
        console.log('=======================');
        
        // Mostrar resumen de cambios
        console.log('\n📋 RESUMEN DE CAMBIOS:');
        console.log('=====================');
        
        let changeCount = 0;
        availableFields.forEach(field => {
          if (JSON.stringify(originalProduct[field.key]) !== JSON.stringify(selectedProduct[field.key])) {
            const originalValue = originalProduct[field.key] !== undefined ? 
              displayFieldValue(field.key, originalProduct[field.key], true) : '❌ No existía';
            const newValue = displayFieldValue(field.key, selectedProduct[field.key], true);
            console.log(`${field.emoji} ${field.displayName}: ${originalValue} → ${newValue}`);
            changeCount++;
          }
        });
        
        if (changeCount === 0) {
          console.log('⚠️  No se detectaron cambios.');
          continue;
        }

        const confirmSave = await askQuestion('\n✅ ¿Confirmar cambios? (y/n): ');
        
        if (confirmSave.toLowerCase() === 'y' || confirmSave.toLowerCase() === 'yes') {
          // Actualizar en Firebase
          selectedProduct.updatedAt = new Date();
          const productRef = doc(db, 'products', originalProduct.id);
          
          const updateData = { ...selectedProduct };
          delete updateData.id; // No actualizar el ID
          
          await updateDoc(productRef, updateData);
          
          console.log('\n🎉 ¡PRODUCTO ACTUALIZADO EXITOSAMENTE!');
          console.log('====================================');
          console.log(`📄 Producto: ${selectedProduct.name || selectedProduct.id}`);
          console.log(`🔄 Actualizado: ${new Date().toLocaleString()}`);
          
          continueModifying = false;
        } else {
          console.log('❌ Cambios no guardados');
        }
        
      } else if (choice === '0') {
        // Cancelar
        if (hasChanges) {
          const confirmCancel = await askQuestion('\n⚠️  Hay cambios sin guardar. ¿Salir sin guardar? (y/n): ');
          if (confirmCancel.toLowerCase() === 'y' || confirmCancel.toLowerCase() === 'yes') {
            console.log('❌ Modificación cancelada');
            continueModifying = false;
          }
        } else {
          console.log('❌ Modificación cancelada');
          continueModifying = false;
        }
      } else {
        console.log('❌ Opción inválida');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

modifyProduct();