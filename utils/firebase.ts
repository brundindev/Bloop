import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getDatabase, Database } from 'firebase/database';

// Configuración de Firebase con variables de entorno para compatibilidad con Vercel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBDB_k4f4_Wi7IPBjth_C1XnBDtfIOThWc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bloop-socialnetwork.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://bloop-socialnetwork-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bloop-socialnetwork",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bloop-socialnetwork.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "81347795005",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:81347795005:web:237d472644716cbf31f254",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HMDHTPX4M9"
};

// Detectar si estamos en el servidor
const isServer = typeof window === 'undefined';

// Variables para almacenar las instancias
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
let database: Database;
let analytics: Analytics | null = null;
let proveedorGoogle: GoogleAuthProvider;

// Inicializar Firebase de manera segura solo en el cliente o con condiciones específicas en SSR
if (!isServer) {
  // Inicializar en el cliente
  try {
    // Solo inicializar una vez
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    // Inicializar servicios
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    database = getDatabase(app);
    proveedorGoogle = new GoogleAuthProvider();
    
    // Analytics solo en el cliente
    analytics = getAnalytics(app);
    
    // Habilitar persistencia offline para Firestore (solo en cliente)
    enableIndexedDbPersistence(db).catch((err) => {
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
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
  }
} else {
  // En el servidor, inicializar lo mínimo necesario para SSR
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  database = getDatabase(app);
  proveedorGoogle = new GoogleAuthProvider();
  // No inicializar analytics en el servidor
}

export { db, auth, storage, proveedorGoogle, analytics, database }; 