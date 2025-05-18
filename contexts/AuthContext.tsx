import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { auth, db, proveedorGoogle } from '../utils/firebase';
import { Usuario, RolUsuario } from '../interfaces';
import { obtenerUsuarioPorNombreUsuario } from '../utils/services/usuarios';

interface AuthContextProps {
  usuarioActual: Usuario | null;
  cargando: boolean;
  iniciarSesionConGoogle: () => Promise<void>;
  iniciarSesionConEmail: (email: string, password: string) => Promise<void>;
  iniciarSesionConNombreUsuario: (nombreUsuario: string, password: string) => Promise<void>;
  registrarConEmail: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCargando(true);
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Usuario existente - actualizar último acceso
          const userData = docSnap.data() as Usuario;
          
          // Actualizar campo de último acceso
          await updateDoc(docRef, {
            ultimoAcceso: serverTimestamp()
          });
          
          setUsuarioActual(userData);
        } else {
          // Nuevo usuario - crear perfil
          const nuevoUsuario: Usuario = {
            id: user.uid,
            nombre: user.displayName || 'Usuario',
            nombreUsuario: `@${user.displayName?.replace(/\s+/g, '').toLowerCase() || 'usuario'}${Math.floor(Math.random() * 1000)}`,
            email: user.email || '',
            fotoURL: user.photoURL || '/imagenes/usuario-default.png',
            biografia: '',
            fechaRegistro: serverTimestamp(),
            ultimoAcceso: serverTimestamp(),
            rol: 'usuario', // Rol por defecto
            seguidores: [],
            siguiendo: [],
            favoritos: [],
            publicacionesCount: 0
          };
          
          await setDoc(docRef, nuevoUsuario);
          setUsuarioActual(nuevoUsuario);
        }
      } else {
        setUsuarioActual(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  async function iniciarSesionConGoogle() {
    setCargando(true);
    try {
      await signInWithPopup(auth, proveedorGoogle);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  }

  async function iniciarSesionConEmail(email: string, password: string) {
    setCargando(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error al iniciar sesión con email:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  }

  async function iniciarSesionConNombreUsuario(nombreUsuario: string, password: string) {
    setCargando(true);
    try {
      // Buscar usuario por nombre de usuario
      const usuario = await obtenerUsuarioPorNombreUsuario(nombreUsuario);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      
      // Iniciar sesión con el email asociado a ese nombre de usuario
      await signInWithEmailAndPassword(auth, usuario.email, password);
    } catch (error) {
      console.error('Error al iniciar sesión con nombre de usuario:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  }

  async function registrarConEmail(email: string, password: string) {
    setCargando(true);
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, password);
      const user = credencial.user;
      
      // Crear perfil de usuario en Firestore
      const nuevoUsuario: Usuario = {
        id: user.uid,
        nombre: 'Usuario', // Nombre por defecto, se puede actualizar luego
        nombreUsuario: `@usuario${Math.floor(Math.random() * 10000)}`,
        email: user.email || '',
        fotoURL: '/imagenes/usuario-default.png',
        biografia: '',
        fechaRegistro: serverTimestamp(),
        ultimoAcceso: serverTimestamp(),
        rol: 'usuario', // Rol por defecto para nuevos registros
        seguidores: [],
        siguiendo: [],
        favoritos: [],
        publicacionesCount: 0
      };
      
      const docRef = doc(db, 'usuarios', user.uid);
      await setDoc(docRef, nuevoUsuario);
    } catch (error) {
      console.error('Error al registrarse con email:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  }

  async function cerrarSesion() {
    setCargando(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  }

  const value = {
    usuarioActual,
    cargando,
    iniciarSesionConGoogle,
    iniciarSesionConEmail,
    iniciarSesionConNombreUsuario,
    registrarConEmail,
    cerrarSesion
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 