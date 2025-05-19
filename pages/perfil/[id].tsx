import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useCookies } from '../../contexts/CookiesContext';
import { registrarVisitaPerfil } from '../../utils/services/cookies';
import Layout from '../../components/Layout';
import Publicacion from '../../components/Publicacion';
import { Usuario, Publicacion as PublicacionType } from '../../interfaces';
import { FaCalendarAlt, FaUserPlus, FaUserCheck, FaArrowLeft, FaHeart, FaHistory } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { seguirUsuario, dejarDeSeguirUsuario, obtenerUsuarioPorId } from '../../utils/services/usuarios';

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren", 
      staggerChildren: 0.1 
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const PerfilPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { usuarioActual } = useAuth();
  const { cookies, cookiesAceptadas } = useCookies();
  
  const [perfilUsuario, setPerfilUsuario] = useState<Usuario | null>(null);
  const [publicaciones, setPublicaciones] = useState<PublicacionType[]>([]);
  const [publicacionesFavoritas, setPublicacionesFavoritas] = useState<PublicacionType[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoFavoritos, setCargandoFavoritos] = useState(true);
  const [siguiendo, setSiguiendo] = useState(false);
  const [activeTab, setActiveTab] = useState<'publicaciones' | 'megusta'>('publicaciones');
  const [siguiendoHover, setSiguiendoHover] = useState(false);
  const [perfilesVisitados, setPerfilesVisitados] = useState<Usuario[]>([]);
  const [cargandoPerfilesVisitados, setCargandoPerfilesVisitados] = useState(false);

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
            
            // Registrar visita en cookies si es un perfil diferente al propio
            if (cookiesAceptadas && id !== usuarioActual.id) {
              registrarVisitaPerfil(usuarioActual.id, id as string).catch(console.error);
            }
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
  }, [id, usuarioActual, router, cookiesAceptadas]);

  // Cargar publicaciones favoritas cuando se selecciona esa pestaña
  useEffect(() => {
    if (!perfilUsuario || activeTab !== 'megusta') return;
    
    // Evitar cargar nuevamente si ya tenemos datos
    if (!cargandoFavoritos && publicacionesFavoritas.length > 0) return;
    
    const cargarFavoritos = async () => {
      if (!perfilUsuario.favoritos.length) {
        setCargandoFavoritos(false);
        return;
      }
      
      try {
        setCargandoFavoritos(true);
        
        // Obtener las publicaciones favoritas
        const favoritosQuery = query(
          collection(db, 'publicaciones'),
          where('id', 'in', perfilUsuario.favoritos.slice(0, 10)), // Limitamos a 10 para evitar problemas con la consulta
          orderBy('fechaCreacion', 'desc')
        );
        
        const unsubscribe = onSnapshot(favoritosQuery, (snapshot) => {
          const favoritosData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as PublicacionType[];
          
          setPublicacionesFavoritas(favoritosData);
          setCargandoFavoritos(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error al cargar publicaciones favoritas:', error);
        setCargandoFavoritos(false);
      }
    };
    
    cargarFavoritos();
  }, [perfilUsuario, activeTab, cargandoFavoritos, publicacionesFavoritas.length]);

  // Cargar perfiles visitados desde las cookies
  useEffect(() => {
    async function cargarPerfilesVisitados() {
      if (!usuarioActual || !cookies || !cookiesAceptadas) return;
      
      try {
        setCargandoPerfilesVisitados(true);
        const historialVisitas = cookies.historial.ultimasVisitas || [];
        
        if (historialVisitas.length === 0) {
          setCargandoPerfilesVisitados(false);
          return;
        }
        
        // Obtener información de los perfiles visitados
        const perfiles: Usuario[] = [];
        
        for (const perfilId of historialVisitas) {
          try {
            const perfil = await obtenerUsuarioPorId(perfilId);
            if (perfil && perfil.id !== usuarioActual.id) {
              perfiles.push(perfil);
            }
          } catch (error) {
            console.error(`Error al obtener perfil ${perfilId}:`, error);
          }
        }
        
        setPerfilesVisitados(perfiles);
      } catch (error) {
        console.error('Error al cargar perfiles visitados:', error);
      } finally {
        setCargandoPerfilesVisitados(false);
      }
    }
    
    cargarPerfilesVisitados();
  }, [usuarioActual, cookies, cookiesAceptadas]);

  // Función para seguir/dejar de seguir
  const toggleSeguir = async () => {
    if (!usuarioActual || !perfilUsuario) return;
    
    try {
      if (siguiendo) {
        await dejarDeSeguirUsuario(usuarioActual.id, perfilUsuario.id);
      } else {
        await seguirUsuario(usuarioActual.id, perfilUsuario.id);
      }
      
      setSiguiendo(!siguiendo);
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error);
    }
  };

  // Formatear fecha de registro
  const formatearFechaRegistro = (fecha: any) => {
    if (!fecha) return 'Fecha desconocida';
    
    let fechaObj: Date;
    
    try {
      if (fecha.toDate) {
        fechaObj = fecha.toDate();
      } else if (fecha instanceof Date) {
        fechaObj = fecha;
      } else if (typeof fecha === 'number' || typeof fecha === 'string') {
        fechaObj = new Date(fecha);
      } else {
        // Si es FieldValue u otro tipo incompatible
        return 'Fecha desconocida';
      }
      
      return format(fechaObj, 'MMMM yyyy', { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha de registro:', error);
      return 'Fecha desconocida';
    }
  };

  // Volver a la página anterior
  const handleBack = () => {
    router.back();
  };

  // Navegar a un perfil visitado
  const irAPerfil = (perfilId: string) => {
    router.push(`/perfil/${perfilId}`);
  };

  if (!perfilUsuario) {
    return (
      <Layout titulo="Cargando perfil...">
        <div className="loading-container">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primario"></div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout titulo={perfilUsuario.nombre}>
      {/* Header fijo */}
      <div className="perfil-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <div className="header-title">
          <h2>{perfilUsuario.nombre}</h2>
          <span>{perfilUsuario.publicacionesCount} publicaciones</span>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Banner de perfil */}
        {perfilUsuario.bannerURL ? (
          <motion.div 
            className="banner"
            variants={itemVariants}
            style={{ backgroundImage: `url(${perfilUsuario.bannerURL})` }}
          />
        ) : (
          <motion.div className="banner default-banner" variants={itemVariants} />
        )}
        
        {/* Imagen de perfil */}
        <motion.div className="profile-image-container" variants={itemVariants}>
          <img
            className="profile-image"
            src={perfilUsuario.fotoURL}
            alt={perfilUsuario.nombre}
          />
        </motion.div>
        
        {/* Botón de seguir/dejar de seguir */}
        {usuarioActual && usuarioActual.id !== perfilUsuario.id && (
          <motion.div className="profile-actions" variants={itemVariants}>
            <motion.button
              className={`follow-button ${siguiendo ? 'following' : 'not-following'}`}
              onClick={toggleSeguir}
              onMouseEnter={() => setSiguiendoHover(true)}
              onMouseLeave={() => setSiguiendoHover(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {siguiendo ? (
                <>
                  <FaUserCheck />
                  <span>Siguiendo</span>
                </>
              ) : (
                <>
                  <FaUserPlus />
                  <span>Seguir</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
        
        {/* Información del perfil */}
        <motion.div className="profile-info" variants={itemVariants}>
          <div className="user-name-display">
            <h1>{perfilUsuario.nombre}</h1>
            <p>{perfilUsuario.nombreUsuario}</p>
          </div>
          
          {perfilUsuario.biografia && (
            <p className="biography">{perfilUsuario.biografia}</p>
          )}
          
          <div className="join-date">
            <FaCalendarAlt /> 
            <span>Se unió en {formatearFechaRegistro(perfilUsuario.fechaRegistro)}</span>
          </div>
          
          <div className="follow-stats">
            <div>
              <span className="count">{perfilUsuario.siguiendo.length}</span>{' '}
              <span className="label">Siguiendo</span>
            </div>
            <div>
              <span className="count">{perfilUsuario.seguidores.length}</span>{' '}
              <span className="label">Seguidores</span>
            </div>
          </div>
        </motion.div>
        
        {/* Pestañas */}
        <motion.div className="tabs-container" variants={itemVariants}>
          <button 
            className={`tab ${activeTab === 'publicaciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('publicaciones')}
          >
            Publicaciones
          </button>
          <button 
            className={`tab ${activeTab === 'megusta' ? 'active' : ''}`} 
            onClick={() => setActiveTab('megusta')}
          >
            Me gusta
          </button>
        </motion.div>
        
        {/* Contenido basado en la pestaña seleccionada */}
        <AnimatePresence mode="wait">
          {activeTab === 'publicaciones' && (
            <motion.div
              className="content-container"
              key="publicaciones"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {cargando ? (
                <div className="loading-container">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primario"></div>
                  </motion.div>
                </div>
              ) : publicaciones.length > 0 ? (
                <motion.div variants={containerVariants}>
                  {publicaciones.map(publicacion => (
                    <motion.div key={publicacion.id} variants={itemVariants}>
                      <Publicacion publicacion={publicacion} esPerfil />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="empty-state">
                  <p>No hay publicaciones para mostrar.</p>
                  {usuarioActual && usuarioActual.id === perfilUsuario.id && (
                    <p>¡Comparte tu primer publicación!</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'megusta' && (
            <motion.div
              className="content-container"
              key="megusta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {cargandoFavoritos ? (
                <div className="loading-container">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primario"></div>
                  </motion.div>
                </div>
              ) : publicacionesFavoritas.length > 0 ? (
                <motion.div variants={containerVariants}>
                  {publicacionesFavoritas.map(publicacion => (
                    <motion.div key={publicacion.id} variants={itemVariants}>
                      <Publicacion publicacion={publicacion} esPerfil />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="empty-state">
                  <FaHeart size={30} style={{ margin: '0 auto 15px' }} />
                  <p>No hay publicaciones con "Me gusta" para mostrar.</p>
                  {usuarioActual && usuarioActual.id === perfilUsuario.id && (
                    <p>¡Dale like a contenido que te interese!</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Historial de perfiles visitados (mostrar solo en el propio perfil) */}
        {usuarioActual && perfilUsuario && usuarioActual.id === perfilUsuario.id && cookies && perfilesVisitados.length > 0 && (
          <motion.div className="historial-visitas-container" variants={itemVariants}>
            <h3 className="historial-titulo">
              <FaHistory />
              Perfiles visitados recientemente
            </h3>
            
            <div className="perfiles-visitados">
              {perfilesVisitados.map(perfil => (
                <motion.div 
                  className="perfil-visitado-item"
                  key={perfil.id}
                  onClick={() => irAPerfil(perfil.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    className="perfil-visitado-imagen"
                    src={perfil.fotoURL} 
                    alt={perfil.nombre} 
                  />
                  <span className="perfil-visitado-nombre">
                    {perfil.nombre}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default PerfilPage; 