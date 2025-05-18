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
  getDocs
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Publicacion from '../components/Publicacion';
import PublicacionForm from '../components/PublicacionForm';
import { Publicacion as PublicacionType } from '../interfaces';

const HomePage = () => {
  const { usuarioActual, cargando: cargandoAuth } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionType[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (cargandoAuth) return;
    
    if (!usuarioActual) {
      // Si no hay usuario, redirigir a login
      router.push('/welcome');
      return;
    }
    
    // Obtener feed de publicaciones
    const obtenerPublicaciones = async () => {
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
    
    const unsubscribe = obtenerPublicaciones();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [usuarioActual, cargandoAuth, router]);

  return (
    <Layout titulo="Inicio">
      {/* Formulario para crear publicación */}
      <PublicacionForm />
      
      {/* Lista de publicaciones */}
      {cargando ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10rem' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            borderRadius: '50%', 
            border: '2px solid transparent',
            borderTopColor: 'var(--color-primary)',
            borderBottomColor: 'var(--color-primary)',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : publicaciones.length > 0 ? (
        <div>
          {publicaciones.map(publicacion => (
            <Publicacion key={publicacion.id} publicacion={publicacion} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray700)' }}>
          <p>No hay publicaciones para mostrar.</p>
          <p>¡Sé el primero en publicar!</p>
        </div>
      )}
    </Layout>
  );
};

export default HomePage; 