import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Configurar proveedor de Google para solicitar más permisos
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
googleProvider.setCustomParameters({
  'login_hint': 'user@example.com'
});

export { app, analytics, auth, db, storage, googleProvider }; 