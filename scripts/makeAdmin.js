// scripts/makeAdmin.js
import { db } from '../src/services/firebase.js';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
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

async function findUserByEmail(email) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error buscando usuario:', error);
    return null;
  }
}

async function makeUserAdmin(userId) {
  try {
    await setDoc(doc(db, 'users', userId), {
      role: 'admin'
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error haciendo admin al usuario:', error);
    return false;
  }
}

async function listUsers() {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    console.log('\n📋 Usuarios registrados:');
    console.log('='.repeat(80));
    
    querySnapshot.docs.forEach((doc, index) => {
      const userData = doc.data();
      console.log(`${index + 1}. ID: ${doc.id}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Nombre: ${userData.displayName || 'N/A'}`);
      console.log(`   Rol: ${userData.role || 'user'}`);
      console.log(`   Creado: ${userData.createdAt ? userData.createdAt.toDate().toLocaleDateString() : 'N/A'}`);
      console.log('-'.repeat(80));
    });
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error listando usuarios:', error);
    return [];
  }
}

async function main() {
  console.log('🛠️  Script para hacer Admin a un usuario');
  console.log('='.repeat(50));
  
  const action = await askQuestion('\n¿Qué quieres hacer?\n1. Listar usuarios\n2. Hacer admin por email\n3. Hacer admin por ID\n4. Salir\n\nOpción (1-4): ');
  
  switch (action) {
    case '1':
      await listUsers();
      break;
      
    case '2':
      const email = await askQuestion('\n📧 Ingresa el email del usuario: ');
      
      if (!email || !email.includes('@')) {
        console.log('❌ Email inválido');
        break;
      }
      
      console.log('🔍 Buscando usuario...');
      const user = await findUserByEmail(email);
      
      if (!user) {
        console.log('❌ Usuario no encontrado');
        break;
      }
      
      console.log(`✅ Usuario encontrado: ${user.displayName || user.email}`);
      console.log(`   Rol actual: ${user.role || 'user'}`);
      
      if (user.role === 'admin') {
        console.log('ℹ️  Este usuario ya es admin');
        break;
      }
      
      const confirm = await askQuestion('\n¿Hacer admin a este usuario? (s/n): ');
      
      if (confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'si') {
        const success = await makeUserAdmin(user.id);
        
        if (success) {
          console.log('✅ Usuario promovido a admin exitosamente');
        } else {
          console.log('❌ Error al hacer admin al usuario');
        }
      } else {
        console.log('❌ Operación cancelada');
      }
      break;
      
    case '3':
      const userId = await askQuestion('\n🆔 Ingresa el ID del usuario: ');
      
      if (!userId) {
        console.log('❌ ID inválido');
        break;
      }
      
      const confirmId = await askQuestion('\n¿Hacer admin a este usuario? (s/n): ');
      
      if (confirmId.toLowerCase() === 's' || confirmId.toLowerCase() === 'si') {
        const success = await makeUserAdmin(userId);
        
        if (success) {
          console.log('✅ Usuario promovido a admin exitosamente');
        } else {
          console.log('❌ Error al hacer admin al usuario');
        }
      } else {
        console.log('❌ Operación cancelada');
      }
      break;
      
    case '4':
      console.log('👋 ¡Hasta luego!');
      break;
      
    default:
      console.log('❌ Opción inválida');
  }
  
  rl.close();
}

main().catch(console.error);



