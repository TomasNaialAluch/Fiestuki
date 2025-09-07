// scripts/checkStructure.js
import { db } from '../src/services/firebase.js';
import { getDocs, collection } from 'firebase/firestore';

async function checkCollections() {
  console.log('🔍 Iniciando consulta a Firebase...');
  
  try {
    const collectionNames = ['products', 'productos', 'items', 'categorias'];
    
    console.log('📋 Probando colecciones:', collectionNames);
    
    for (const name of collectionNames) {
      console.log(`\n🔄 Consultando colección: ${name}`);
      
      try {
        const ref = collection(db, name);
        console.log('✅ Referencia creada');
        
        const snapshot = await getDocs(ref);
        console.log('✅ Snapshot obtenido');
        
        if (!snapshot.empty) {
          console.log(`🎉 Colección '${name}' encontrada!`);
          console.log('📊 Documentos:', snapshot.size);
          
          snapshot.docs.slice(0, 2).forEach((doc, index) => {
            console.log(`\n📄 Documento ${index + 1} (ID: ${doc.id}):`);
            console.log(JSON.stringify(doc.data(), null, 2));
          });
        } else {
          console.log(`❌ Colección '${name}' está vacía`);
        }
      } catch (error) {
        console.log(`❌ Error con colección '${name}':`, error.message);
      }
    }
  } catch (error) {
    console.error('💥 Error general:', error);
  }
  
  console.log('\n✨ Consulta finalizada');
}

checkCollections();