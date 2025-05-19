import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getDatabase, Database, connectDatabaseEmulator } from 'firebase/database';

// Configuración de Firebase con valores por defecto si no hay variables de entorno
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
const isDev = process.env.NODE_ENV === 'development';

// Variables para almacenar las instancias
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
let database: Database;
let analytics: Analytics | null = null;
let proveedorGoogle: GoogleAuthProvider;

// Función para inicializar Firebase con manejo de errores
function initializeFirebase() {
  try {
    // Validar que la configuración de Firebase es válida
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
      console.error('API Key de Firebase no válida o no definida');
      return false;
    }

    // Solo inicializar una vez
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    // Inicializar servicios
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    database = getDatabase(app);
    proveedorGoogle = new GoogleAuthProvider();
    
    // Solo conectar a emuladores en desarrollo y cliente
    if (isDev && !isServer) {
      try {
        // Conectar a emuladores si están disponibles
        if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectAuthEmulator(auth, 'http://localhost:9099');
          connectStorageEmulator(storage, 'localhost', 9199);
          connectDatabaseEmulator(database, 'localhost', 9000);
        }
      } catch (error) {
        console.warn('Error al conectar a emuladores:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    return false;
  }
}

// Inicializar Analytics solo en el cliente
async function initializeAnalytics() {
  if (isServer) return null;
  
  try {
    if (!app) return null;
    
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      return getAnalytics(app);
    }
    return null;
  } catch (error) {
    console.warn('Analytics no soportado:', error);
    return null;
  }
}

// Inicializar persistencia en Firestore solo en el cliente
function initializePersistence() {
  if (isServer) return;
  
  try {
    if (!db) return;
    
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('La persistencia solo puede habilitarse en una pestaña a la vez');
      } else if (err.code === 'unimplemented') {
        console.warn('Este navegador no soporta persistencia offline');
      } else {
        console.error('Error al habilitar persistencia:', err);
      }
    });
  } catch (error) {
    console.warn('Error al inicializar persistencia:', error);
  }
}

// Inicializar Firebase
const isInitialized = initializeFirebase();

// Solo ejecutar operaciones adicionales si Firebase se inicializó correctamente
if (isInitialized) {
  if (!isServer) {
    // Inicializar Analytics en el cliente
    initializeAnalytics().then(result => {
      analytics = result;
    });
    
    // Inicializar persistencia en el cliente
    initializePersistence();
  }
}

export { db, auth, storage, proveedorGoogle, analytics, database }; 