// scripts/createProduct.js
import { db } from '../src/services/firebase.js';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { generateImageNames } from './generateImageNames.js';
import { checkProduct } from './checkProduct.js';
import { storage } from '../src/services/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Función para limpiar nombres (copiada de uploadImages)
function cleanFileName(name) {
  return name
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '')
    .toLowerCase();
}

// Función para subir imágenes (solo si no existen)
async function uploadCategoryImages(categoryName) {
  console.log(`🚀 Subiendo imágenes para: ${categoryName}`);
  
  const categoryPath = path.join(__dirname, 'data', categoryName);
  
  if (!fs.existsSync(categoryPath)) {
    throw new Error(`La carpeta ${categoryPath} no existe`);
  }
  
  const files = fs.readdirSync(categoryPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );
  
  if (imageFiles.length === 0) {
    throw new Error(`No se encontraron imágenes en ${categoryPath}`);
  }
  
  console.log(`📸 Encontradas ${imageFiles.length} imágenes`);
  
  let mainImage = null;
  const otherImages = [];
  let counter = 1;
  
  const cleanCategoryName = cleanFileName(categoryName);
  
  for (const file of imageFiles) {
    console.log(`📤 Subiendo: ${file}`);
    
    const filePath = path.join(categoryPath, file);
    const fileBuffer = fs.readFileSync(filePath);
    
    let fileName;
    if (file.toLowerCase().includes('mainimage')) {
      fileName = `${cleanCategoryName}MainImage`;
    } else {
      fileName = `${cleanCategoryName}${counter}`;
      counter++;
    }
    
    const extension = path.extname(file);
    const fullFileName = `${fileName}${extension}`;
    
    const storageRef = ref(storage, `images/${cleanCategoryName}/${fullFileName}`);
    
    await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(storageRef);
    
    if (file.toLowerCase().includes('mainimage')) {
      mainImage = downloadURL;
      console.log(`✅ Imagen principal subida`);
    } else {
      otherImages.push(downloadURL);
      console.log(`✅ Imagen ${counter - 1} subida`);
    }
  }
  
  return { mainImage, otherImages };
}

async function createProduct() {
  console.log('🎉 CREADOR DE PRODUCTOS FIESTUKI');
  console.log('=================================\n');

  try {
    // 1. Mostrar carpetas de imágenes disponibles
    const dataPath = path.join(__dirname, 'data');
    const folders = fs.readdirSync(dataPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (folders.length === 0) {
      console.log('❌ No se encontraron carpetas en scripts/data/');
      return;
    }

    console.log('📁 CARPETAS DE IMÁGENES DISPONIBLES:');
    console.log('===================================');
    folders.forEach((folder, index) => {
      console.log(`${index + 1}. ${folder}`);
    });

    // 2. Elegir carpeta de imágenes
    const folderChoice = await askQuestion('\n🔢 Elegí el número de la carpeta de imágenes: ');
    const selectedIndex = parseInt(folderChoice) - 1;

    if (selectedIndex < 0 || selectedIndex >= folders.length) {
      console.log('❌ Número inválido');
      return;
    }

    const selectedFolder = folders[selectedIndex];
    console.log(`\n✅ Carpeta de imágenes seleccionada: ${selectedFolder}`);

    // ⭐ NUEVO: SELECCIÓN DE CATEGORÍA PARA FIREBASE
    console.log('\n📂 CATEGORÍA DEL PRODUCTO:');
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
      return;
    }

    const selectedCategory = categories[categoryIndex];
    console.log(`\n✅ Categoría seleccionada: ${selectedCategory}`);

    // 3. Pedir el nombre del producto
    console.log('\n📝 DATOS DEL PRODUCTO:');
    console.log('=====================');
    
    const name = await askQuestion('📝 Nombre del producto: ');

    // 4. 🔍 VERIFICAR SI EL PRODUCTO YA EXISTE
    console.log('\n🔍 VERIFICANDO SI EL PRODUCTO YA EXISTE...');
    const productExists = await checkProduct(name);

    if (productExists) {
      console.log('\n⚠️  EL PRODUCTO YA EXISTE');
      console.log('===========================');
      const overwrite = await askQuestion('¿Querés crearlo de todas formas? (y/n): ');
      
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Creación cancelada');
        return;
      }
      
      console.log('\n⚠️  Continuando con la creación...');
    } else {
      console.log('✅ El producto no existe. Continuando...');
    }

    // 5. 🔍 VERIFICAR SI LAS IMÁGENES YA EXISTEN USANDO generateImageNames
    console.log('\n🔍 VERIFICANDO IMÁGENES EN FIREBASE...');
    const existingImages = await generateImageNames(selectedFolder);

    let imageResults;

    if (existingImages === false) {
      // ❌ Las imágenes no existen, hay que subirlas
      console.log('❌ Las imágenes no existen. Subiendo...');
      imageResults = await uploadCategoryImages(selectedFolder);
    } else {
      // ✅ Las imágenes ya existen, usar las URLs existentes
      console.log('✅ ¡Las imágenes ya existen en Firebase!');
      
      const mainImage = existingImages[0] || null; // Primera posición = mainImage
      const otherImages = existingImages.slice(1); // Resto = otras imágenes
      
      imageResults = { mainImage, otherImages };
      
      console.log(`📌 Imagen principal: ${mainImage ? 'SÍ' : 'NO'}`);
      console.log(`📷 Otras imágenes: ${otherImages.length}`);
    }

    // 6. 📝 PEDIR TODOS LOS DATOS POR CONSOLA
    console.log('\n📝 COMPLETÁ LOS DATOS DEL PRODUCTO:');
    console.log('==================================');
    
    const price = parseFloat(await askQuestion('💰 Precio: $'));
    const stock = parseInt(await askQuestion('📦 Stock disponible: '));
    const slug = await askQuestion(`🔗 Slug (por defecto: ${cleanFileName(name)}): `) || cleanFileName(name);
    
    // 🔧 DESCRIPCIÓN DEL PRODUCTO (texto largo)
    console.log('\n📋 DESCRIPCIÓN DEL PRODUCTO:');
    console.log('============================');
    console.log('💡 Podés escribir párrafos completos con espacios y saltos de línea');
    const description = await askQuestion('📝 Descripción: ');

    // 🔧 TAGS (separados por comas)
    console.log('\n🏷️  TAGS DEL PRODUCTO:');
    console.log('=====================');
    console.log('💡 Separalos con comas (ejemplo: "fiesta, cumpleanos, safari, niños")');
    const tagsInput = await askQuestion('🏷️  Tags: ');
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    // Estado activo
    const activeInput = await askQuestion('🔄 ¿Producto activo? (y/n, por defecto: y): ') || 'y';
    const active = activeInput.toLowerCase() === 'y' || activeInput.toLowerCase() === 'yes';

    console.log('\n✅ DATOS INGRESADOS:');
    console.log('===================');
    console.log(`📁 Carpeta de imágenes: ${selectedFolder}`);
    console.log(`📂 Categoría: ${selectedCategory}`);
    console.log(`📝 Nombre: ${name}`);
    console.log(`💰 Precio: $${price}`);
    console.log(`📦 Stock: ${stock}`);
    console.log(`🔗 Slug: ${slug}`);
    console.log(`📋 Descripción: ${description}`);
    console.log(`🏷️  Tags: ${tags.join(', ')}`);
    console.log(`🔄 Activo: ${active ? 'SÍ' : 'NO'}`);

    // 7. Crear objeto del producto
    const productData = {
      name: name,
      price: price,
      stock: stock,
      slug: slug,
      description: description,
      category: selectedCategory, // ⭐ CATEGORÍA SELECCIONADA (no la carpeta)
      mainImage: imageResults.mainImage || "",
      images: imageResults.otherImages,
      tags: tags,
      active: active,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('\n🔍 VISTA PREVIA DEL PRODUCTO:');
    console.log('============================');
    console.log(JSON.stringify(productData, null, 2));
    
    const confirm = await askQuestion('\n✅ ¿Crear este producto? (y/n): ');
    
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      // 8. 🎯 CREAR PRODUCTO CON SLUG COMO ID
      const docRef = doc(db, 'products', slug);
      await setDoc(docRef, productData);
      
      console.log('\n🎉 ¡PRODUCTO CREADO EXITOSAMENTE!');
      console.log('================================');
      console.log(`📄 ID del documento: ${slug}`);
      console.log(`📝 Nombre: ${productData.name}`);
      console.log(`📂 Categoría: ${productData.category}`);
      console.log(`💰 Precio: $${productData.price}`);
      console.log(`📦 Stock: ${productData.stock}`);
      console.log(`🖼️  Imagen principal: ${imageResults.mainImage ? 'SÍ' : 'NO'}`);
      console.log(`📷 Otras imágenes: ${productData.images.length}`);
      console.log(`🏷️  Tags: ${productData.tags.join(', ')}`);
      console.log(`🔄 Activo: ${productData.active ? 'SÍ' : 'NO'}`);
    } else {
      console.log('❌ Creación cancelada');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

createProduct();