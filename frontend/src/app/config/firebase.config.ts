import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBKrJfQTUhYQEd76i4f6gq8--iU1vrlaSk",
  authDomain: "unamconnect-portal-2026.firebaseapp.com",
  projectId: "unamconnect-portal-2026",
  storageBucket: "unamconnect-portal-2026.firebasestorage.app",
  messagingSenderId: "873256585000",
  appId: "1:873256585000:web:f0038b60d2eee7eeb1321d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Autenticación y exportarla
export const auth = getAuth(app);

// Inicializar Storage y exportarlo
export const storage = getStorage(app);
