// scripts/uploadImages.js
import { storage } from '../src/services/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para limpiar nombres (quitar espacios, caracteres especiales)
function cleanFileName(name) {
  return name
    .replace(/\s+/g, '') // Quitar espacios
    .replace(/[^a-zA-Z0-9.-]/g, '') // Quitar caracteres especiales excepto . y -
    .toLowerCase();
}

async function uploadCategoryImages(categoryName) {
  console.log(`🚀 Iniciando subida de imágenes para categoría: ${categoryName}`);
  
  const categoryPath = path.join(__dirname, 'data', categoryName);
  
  if (!fs.existsSync(categoryPath)) {
    console.error(`❌ La carpeta ${categoryPath} no existe`);
    return;
  }
  
  const files = fs.readdirSync(categoryPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );
  
  if (imageFiles.length === 0) {
    console.error(`❌ No se encontraron imágenes en ${categoryPath}`);
    return;
  }
  
  console.log(`📸 Encontradas ${imageFiles.length} imágenes`);
  
  let mainImage = null;
  const otherImages = [];
  let counter = 1;
  
  // Limpiar nombre de categoría para Firebase
  const cleanCategoryName = cleanFileName(categoryName);
  
  for (const file of imageFiles) {
    console.log(`📤 Subiendo: ${file}`);
    
    try {
      const filePath = path.join(categoryPath, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      // Determinar el nombre del archivo en Firebase
      let fileName;
      if (file.toLowerCase().includes('mainimage')) {
        fileName = `${cleanCategoryName}MainImage`;
      } else {
        fileName = `${cleanCategoryName}${counter}`;
        counter++;
      }
      
      // Obtener extensión original
      const extension = path.extname(file);
      const fullFileName = `${fileName}${extension}`;
      
      // Crear referencia en Firebase Storage
      const storageRef = ref(storage, `images/${cleanCategoryName}/${fullFileName}`);
      
      // Subir archivo
      await uploadBytes(storageRef, fileBuffer);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      
      // Clasificar la imagen
      if (file.toLowerCase().includes('mainimage')) {
        mainImage = downloadURL;
        console.log(`✅ Imagen principal subida: ${fileName}`);
      } else {
        otherImages.push(downloadURL);
        console.log(`✅ Imagen ${counter - 1} subida: ${fileName}`);
      }
      
    } catch (error) {
      console.error(`❌ Error subiendo ${file}:`, error.message);
    }
  }
  
  // Mostrar resultados de manera prolija
  console.log('\n' + '='.repeat(60));
  console.log(`🎉 SUBIDA COMPLETADA PARA: ${categoryName.toUpperCase()}`);
  console.log('='.repeat(60));
  
  if (mainImage) {
    console.log('\n📌 IMAGEN PRINCIPAL:');
    console.log(mainImage);
  } else {
    console.log('\n⚠️  No se encontró imagen principal (mainImage)');
  }
  
  console.log('\n📸 OTRAS IMÁGENES:');
  if (otherImages.length > 0) {
    otherImages.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });
  } else {
    console.log('No hay otras imágenes');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Proceso finalizado');
  
  return { mainImage, otherImages };
}

// Obtener nombre de categoría desde argumentos de línea de comandos
const categoryName = process.argv[2];

if (!categoryName) {
  console.error('❌ Por favor proporciona el nombre de la categoría');
  console.log('📝 Uso: node scripts/uploadImages.js "Nombre De La Carpeta"');
  console.log('💡 Ejemplos:');
  console.log('   node scripts/uploadImages.js "Animales en la Selva"');
  console.log('   node scripts/uploadImages.js Cats');
  console.log('   node scripts/uploadImages.js "Happy B colorido"');
  process.exit(1);
}

uploadCategoryImages(categoryName);