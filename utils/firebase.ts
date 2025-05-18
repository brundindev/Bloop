import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
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

// Inicializar servicios
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const proveedorGoogle = new GoogleAuthProvider();
const database = getDatabase(app);

// Inicializar Analytics solo en el cliente (no en el servidor)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { db, auth, storage, proveedorGoogle, analytics, database }; 