import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import type { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Manejar el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Comprobar si el usuario existe en Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // El usuario ya existe, actualizar lastLogin
            const userData = userDoc.data() as User;
            setCurrentUser(userData);
            
            await updateDoc(userDocRef, {
              updatedAt: serverTimestamp()
            });
          } else {
            // Es un nuevo usuario, crear documento en Firestore
            const newUser: User = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Usuario',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              username: `user_${firebaseUser.uid.substring(0, 8)}`,
              followers: [],
              following: [],
              createdAt: serverTimestamp() as unknown as Timestamp,
              updatedAt: serverTimestamp() as unknown as Timestamp,
            };
            
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
          }
        } catch (err) {
          console.error('Error al gestionar usuario:', err);
          setError(err instanceof Error ? err : new Error('Error desconocido'));
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  // Iniciar sesión con Google
  const login = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err instanceof Error ? err : new Error('Error al iniciar sesión'));
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError(err instanceof Error ? err : new Error('Error al cerrar sesión'));
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil del usuario
  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }
    
    try {
      setError(null);
      setLoading(true);
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // Actualizar el estado local
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err instanceof Error ? err : new Error('Error al actualizar perfil'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}; 