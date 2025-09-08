// scripts/generateImageNames.js
import { storage } from '../src/services/firebase.js';
import { ref, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para limpiar nombres (IGUAL que uploadImages)
function cleanFileName(name) {
  return name
    .replace(/\s+/g, '') // Quitar espacios
    .replace(/[^a-zA-Z0-9.-]/g, '') // Quitar caracteres especiales excepto . y -
    .toLowerCase();
}

// Función para verificar si una imagen existe en Firebase
async function checkIfImageExists(path) {
  try {
    const imageRef = ref(storage, path);
    const url = await getDownloadURL(imageRef);
    return url; // Si no da error, la imagen existe
  } catch (error) {
    return null; // La imagen no existe
  }
}

// Función principal que verifica si las imágenes existen
async function generateImageNames(categoryName) {
  const categoryPath = path.join(__dirname, 'data', categoryName);
  
  if (!fs.existsSync(categoryPath)) {
    return { success: false, error: `La carpeta ${categoryPath} no existe` };
  }
  
  const files = fs.readdirSync(categoryPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );
  
  if (imageFiles.length === 0) {
    return { success: false, error: `No se encontraron imágenes en ${categoryPath}` };
  }
  
  let mainImage = null;
  const otherImages = [];
  let counter = 1;
  
  // Limpiar nombre de categoría para Firebase (IGUAL que uploadImages)
  const cleanCategoryName = cleanFileName(categoryName);
  
  // MISMA LÓGICA que uploadImages
  for (const file of imageFiles) {
    // Determinar el nombre del archivo en Firebase (IGUAL que uploadImages)
    let fileName;
    if (file.toLowerCase().includes('mainimage')) {
      fileName = `${cleanCategoryName}MainImage`;
    } else {
      fileName = `${cleanCategoryName}${counter}`;
      counter++;
    }
    
    // Obtener extensión original (IGUAL que uploadImages)
    const extension = path.extname(file);
    const fullFileName = `${fileName}${extension}`;
    
    // Crear referencia en Firebase Storage (IGUAL que uploadImages)
    const storagePath = `images/${cleanCategoryName}/${fullFileName}`;
    
    // 🔍 Verificar si existe en Firebase
    const existingUrl = await checkIfImageExists(storagePath);
    
    if (!existingUrl) {
      // Si alguna imagen no existe, retornar false
      return false;
    }
    
    // Clasificar la imagen (IGUAL que uploadImages)
    if (file.toLowerCase().includes('mainimage')) {
      mainImage = existingUrl;
    } else {
      otherImages.push(existingUrl);
    }
  }
  
  // ✅ Todas las imágenes existen
  // Crear array con mainImage en posición 0
  const resultArray = [];
  
  if (mainImage) {
    resultArray.push(mainImage); // Posición 0: mainImage
  }
  
  // Agregar las otras imágenes
  resultArray.push(...otherImages);
  
  return resultArray;
}

// Exportar para usar en otros scripts
export { generateImageNames };

// Si se ejecuta directamente desde consola
if (process.argv[2]) {
  const categoryName = process.argv[2];
  
  try {
    const result = await generateImageNames(categoryName);
    
    if (result === false) {
      console.log('❌ FALSE - Algunas imágenes no existen en Firebase');
    } else if (Array.isArray(result)) {
      console.log('✅ TRUE - Todas las imágenes existen');
      console.log('==========================================');
      console.log(`📂 Categoría: ${categoryName}`);
      console.log(`📸 Total imágenes: ${result.length}`);
      console.log('\n📋 ARRAY RESULTANTE:');
      console.log('📌 [0] MainImage:', result[0] || 'No hay mainImage');
      
      if (result.length > 1) {
        console.log('\n📷 Otras imágenes:');
        result.slice(1).forEach((url, index) => {
          console.log(`📌 [${index + 1}] ${url}`);
        });
      }
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}
