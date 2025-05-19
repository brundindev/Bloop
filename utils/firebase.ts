import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Configuración de Firebase proporcionada
const firebaseConfig = {
  apiKey: "AIzaSyBDB_k4f4_Wi7IPBjth_C1XnBDtfIOThWc",
  authDomain: "bloop-socialnetwork.firebaseapp.com",
  databaseURL: "https://bloop-socialnetwork-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bloop-socialnetwork",
  storageBucket: "bloop-socialnetwork.firebasestorage.app",
  messagingSenderId: "81347795005",
  appId: "1:81347795005:web:237d472644716cbf31f254",
  measurementId: "G-HMDHTPX4M9"
};

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar servicios con opciones para mejor rendimiento
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const proveedorGoogle = new GoogleAuthProvider();
const database = getDatabase(app);

// Habilitar persistencia offline para Firestore (solo en cliente)
// Configurada para funcionar con múltiples pestañas y manejar errores específicos
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db, {
    // Permitir sincronización multi-pestañas
    synchronizeTabs: true,
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Múltiples pestañas abiertas, se usará la persistencia de la primera
      console.warn('La persistencia de Firestore solo puede habilitarse en una pestaña a la vez.');
    } else if (err.code === 'unimplemented') {
      // El navegador actual no soporta persistencia
      console.warn('Este navegador no soporta la persistencia offline de Firestore.');
    } else {
      console.error('Error al habilitar persistencia offline:', err);
    }
  });
}

// Inicializar Analytics solo en el cliente (no en el servidor)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { db, auth, storage, proveedorGoogle, analytics, database }; 