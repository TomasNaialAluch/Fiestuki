// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCozi9ym-H_nGJevsCiCP1pGTWUXAMc4WQ",
  authDomain: "fiestuki-db.firebaseapp.com",
  projectId: "fiestuki-db",
  storageBucket: "fiestuki-db.firebasestorage.app",
  messagingSenderId: "1055318696770",
  appId: "1:1055318696770:web:93168fb2e6f89919ccdedb",
  measurementId: "G-SJHM4RWRWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  const { getAnalytics } = await import("firebase/analytics");
  analytics = getAnalytics(app);
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);