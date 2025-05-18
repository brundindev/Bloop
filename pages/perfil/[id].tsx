import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import Publicacion from '../../components/Publicacion';
import { Usuario, Publicacion as PublicacionType } from '../../interfaces';
import { FaCalendarAlt, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PerfilPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { usuarioActual } = useAuth();
  
  const [perfilUsuario, setPerfilUsuario] = useState<Usuario | null>(null);
  const [publicaciones, setPublicaciones] = useState<PublicacionType[]>([]);
  const [cargando, setCargando] = useState(true);
  const [siguiendo, setSiguiendo] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    // Obtener datos del usuario
    const obtenerDatosUsuario = async () => {
      try {
        const docRef = doc(db, 'usuarios', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data() as Usuario;
          setPerfilUsuario(userData);
          
          // Verificar si el usuario actual sigue a este perfil
          if (usuarioActual) {
            setSiguiendo(userData.seguidores.includes(usuarioActual.id));
          }
        } else {
          console.error('No se encontró el usuario');
          router.push('/404');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };
    
    // Obtener publicaciones del usuario
    const obtenerPublicacionesUsuario = () => {
      try {
        const publicacionesQuery = query(
          collection(db, 'publicaciones'),
          where('autorId', '==', id),
          orderBy('fechaCreacion', 'desc')
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
    
    obtenerDatosUsuario();
    const unsubscribe = obtenerPublicacionesUsuario();
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [id, usuarioActual, router]);

  // Función para seguir/dejar de seguir
  const toggleSeguir = async () => {
    if (!usuarioActual || !perfilUsuario) return;
    
    try {
      // Aquí implementaríamos la lógica para seguir/dejar de seguir
      // Esto incluye actualizar los arrays de seguidores/siguiendo en Firestore
      
      // Por ahora, solo actualizamos el estado local
      setSiguiendo(!siguiendo);
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error);
    }
  };

  // Formatear fecha de registro
  const formatearFechaRegistro = (fecha: any) => {
    if (!fecha) return 'Fecha desconocida';
    
    let fechaObj: Date;
    if (fecha.toDate) {
      fechaObj = fecha.toDate();
    } else {
      fechaObj = new Date(fecha);
    }
    
    return format(fechaObj, 'MMMM yyyy', { locale: es });
  };

  if (!perfilUsuario) {
    return (
      <Layout titulo="Cargando perfil...">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primario-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout titulo={perfilUsuario.nombre}>
      {/* Cabecera del perfil */}
      <div className="relative">
        {/* Fondo de perfil */}
        <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
        
        {/* Avatar e información */}
        <div className="px-4">
          <div className="relative -mt-16 flex justify-between">
            <img 
              src={perfilUsuario.fotoURL} 
              alt={perfilUsuario.nombre} 
              className="w-32 h-32 rounded-full border-4 border-white dark:border-fondo-oscuro"
            />
            
            {/* Botón de seguir (solo para otros usuarios) */}
            {usuarioActual && usuarioActual.id !== perfilUsuario.id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSeguir}
                className={siguiendo ? 'boton-secundario mt-4' : 'boton-primario mt-4'}
              >
                {siguiendo ? (
                  <>
                    <FaUserCheck className="mr-2" />
                    Siguiendo
                  </>
                ) : (
                  <>
                    <FaUserPlus className="mr-2" />
                    Seguir
                  </>
                )}
              </motion.button>
            )}
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{perfilUsuario.nombre}</h1>
            <p className="text-gray-500 dark:text-gray-400">{perfilUsuario.nombreUsuario}</p>
            
            {perfilUsuario.biografia && (
              <p className="mt-3">{perfilUsuario.biografia}</p>
            )}
            
            <div className="flex items-center mt-3 text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="mr-2" />
              <span>Se unió en {formatearFechaRegistro(perfilUsuario.fechaRegistro)}</span>
            </div>
            
            <div className="flex space-x-5 mt-3">
              <div>
                <span className="font-bold">{perfilUsuario.siguiendo.length}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">Siguiendo</span>
              </div>
              <div>
                <span className="font-bold">{perfilUsuario.seguidores.length}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">Seguidores</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pestañas (simple, sin funcionalidad completa) */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mt-4">
          <button className="flex-1 py-3 font-medium text-primario-500 border-b-2 border-primario-500">
            Publicaciones
          </button>
          <button className="flex-1 py-3 font-medium text-gray-500 dark:text-gray-400">
            Me gusta
          </button>
        </div>
      </div>
      
      {/* Publicaciones */}
      {cargando ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primario-500"></div>
        </div>
      ) : publicaciones.length > 0 ? (
        <div>
          {publicaciones.map(publicacion => (
            <Publicacion key={publicacion.id} publicacion={publicacion} esPerfil />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <p>No hay publicaciones para mostrar.</p>
        </div>
      )}
    </Layout>
  );
};

export default PerfilPage; 