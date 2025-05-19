import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  where,
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Publicacion from '../components/Publicacion';
import PublicacionForm from '../components/PublicacionForm';
import { Publicacion as PublicacionType } from '../interfaces';

const IndexPage = () => {
  const { usuarioActual, cargando: cargandoAuth } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionType[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (cargandoAuth) return;
    
    if (!usuarioActual) {
      // Si no hay usuario, redirigir a welcome
      router.push('/welcome');
      return;
    }
    
    // Obtener feed de publicaciones
    const obtenerPublicaciones = async (): Promise<Unsubscribe | (() => void)> => {
      try {
        setCargando(true);
        
        // En una aplicación real, primero buscaríamos a quién sigue el usuario
        // y luego filtraríamos por esos usuarios + el propio usuario
        
        // Para simplificar, mostramos todas las publicaciones (en orden cronológico inverso)
        const publicacionesQuery = query(
          collection(db, 'publicaciones'),
          orderBy('fechaCreacion', 'desc'),
          limit(50)
        );
        
        const unsubscribe = onSnapshot(publicacionesQuery, (snapshot) => {
          const nuevasPublicaciones = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as PublicacionType[];
          
          setPublicaciones(nuevasPublicaciones);
          setCargando(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        setCargando(false);
        return () => {};
      }
    };
    
    // Inicializamos unsubscribe con una función vacía por defecto
    let unsubscribe: Unsubscribe | (() => void) = () => {};
    
    obtenerPublicaciones().then(unsub => {
      unsubscribe = unsub;
    });
    
    return () => {
      unsubscribe();
    };
  }, [usuarioActual, cargandoAuth, router]);

  // Redirigir a welcome
  useEffect(() => {
    router.replace('/welcome');
  }, [router]);

  return null;
};

export default IndexPage;
