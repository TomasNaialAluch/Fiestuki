// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);