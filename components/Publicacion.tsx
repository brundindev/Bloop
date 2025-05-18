import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaRegHeart, FaHeart, FaRetweet, FaRegComment, FaShare, FaEllipsisH } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Publicacion as PublicacionType } from '../interfaces';
import { useAuth } from '../contexts/AuthContext';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../utils/firebase';

interface PublicacionProps {
  publicacion: PublicacionType;
  esPerfil?: boolean;
}

const Publicacion: React.FC<PublicacionProps> = ({ publicacion, esPerfil = false }) => {
  const router = useRouter();
  const { usuarioActual } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  
  // Verificar si el usuario actual dio like
  const dioLike = usuarioActual ? publicacion.likes.includes(usuarioActual.id) : false;
  
  // Verificar si el usuario actual hizo retweet
  const hizoRetweet = usuarioActual ? publicacion.retweets.includes(usuarioActual.id) : false;
  
  // Formatear fecha
  const formatearFecha = (fecha: Date | string | number | Timestamp) => {
    let fechaObj: Date;
    
    if (fecha instanceof Timestamp) {
      fechaObj = fecha.toDate();
    } else if (fecha instanceof Date) {
      fechaObj = fecha;
    } else if (typeof fecha === 'number' || typeof fecha === 'string') {
      fechaObj = new Date(fecha);
    } else {
      return 'Fecha desconocida';
    }
    
    return formatDistanceToNow(fechaObj, { addSuffix: true, locale: es });
  };

  // Manejar click en la publicación (ir a detalle)
  const irADetalle = () => {
    router.push(`/publicacion/${publicacion.id}`);
  };

  // Manejar like
  const manejarLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir navegación a detalle
    
    if (!usuarioActual) {
      router.push('/login');
      return;
    }
    
    try {
      const publicacionRef = doc(db, 'publicaciones', publicacion.id);
      
      if (dioLike) {
        // Quitar like
        await updateDoc(publicacionRef, {
          likes: arrayRemove(usuarioActual.id)
        });
      } else {
        // Dar like
        await updateDoc(publicacionRef, {
          likes: arrayUnion(usuarioActual.id)
        });
        
        // Si no es el autor, crear notificación
        if (usuarioActual.id !== publicacion.autorId) {
          await createNotification('like', publicacion.id, publicacion.autorId);
        }
      }
    } catch (error) {
      console.error('Error al dar/quitar like:', error);
    }
  };

  // Manejar retweet
  const manejarRetweet = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir navegación a detalle
    
    if (!usuarioActual) {
      router.push('/login');
      return;
    }
    
    try {
      const publicacionRef = doc(db, 'publicaciones', publicacion.id);
      
      if (hizoRetweet) {
        // Quitar retweet
        await updateDoc(publicacionRef, {
          retweets: arrayRemove(usuarioActual.id)
        });
      } else {
        // Hacer retweet
        await updateDoc(publicacionRef, {
          retweets: arrayUnion(usuarioActual.id)
        });
        
        // Si no es el autor, crear notificación
        if (usuarioActual.id !== publicacion.autorId) {
          await createNotification('retweet', publicacion.id, publicacion.autorId);
        }
      }
    } catch (error) {
      console.error('Error al hacer/quitar retweet:', error);
    }
  };

  // Manejar comentario (ir a detalle con enfoque en comentarios)
  const manejarComentario = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir navegación simple a detalle
    router.push(`/publicacion/${publicacion.id}?comentar=true`);
  };

  // Eliminar publicación
  const eliminarPublicacion = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir navegación a detalle
    
    if (!usuarioActual || usuarioActual.id !== publicacion.autorId) {
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        setEliminando(true);
        await deleteDoc(doc(db, 'publicaciones', publicacion.id));
        // No necesitamos redirigir porque el cambio se reflejará automáticamente
        // en la consulta de Firestore que alimenta la lista
      } catch (error) {
        console.error('Error al eliminar publicación:', error);
        alert('No se pudo eliminar la publicación. Inténtalo nuevamente.');
      } finally {
        setEliminando(false);
        setMenuAbierto(false);
      }
    }
  };

  // Crear notificación
  const createNotification = async (tipo: 'like' | 'retweet' | 'comentario', publicacionId: string, receptorId: string) => {
    // Implementación básica - expandir según necesidades
    try {
      // Aquí añadiríamos la lógica para crear una notificación en Firestore
    } catch (error) {
      console.error('Error al crear notificación:', error);
    }
  };

  return (
    <motion.div 
      className={`border-b border-gray-200 dark:border-gray-800 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${eliminando ? 'opacity-50' : ''}`}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
      onClick={irADetalle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-3">
        {/* Avatar del autor */}
        <Link href={`/perfil/${publicacion.autorId}`} onClick={(e) => e.stopPropagation()}>
          <img 
            src={publicacion.autorFotoURL} 
            alt={publicacion.autorNombre} 
            className="w-10 h-10 rounded-full"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          {/* Cabecera: autor y fecha */}
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/perfil/${publicacion.autorId}`} onClick={(e) => e.stopPropagation()}>
                <span className="font-bold hover:underline mr-2">{publicacion.autorNombre}</span>
                <span className="text-gray-500 dark:text-gray-400">{publicacion.autorNombreUsuario}</span>
              </Link>
              <span className="mx-1 text-gray-500 dark:text-gray-400">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatearFecha(publicacion.fechaCreacion)}
              </span>
            </div>
            
            {/* Menú de opciones (solo para el autor) */}
            {usuarioActual && usuarioActual.id === publicacion.autorId && (
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuAbierto(!menuAbierto);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <FaEllipsisH />
                </button>
                
                {menuAbierto && (
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1">
                    <button 
                      onClick={eliminarPublicacion}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={eliminando}
                    >
                      {eliminando ? 'Eliminando...' : 'Eliminar publicación'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Contenido del tweet */}
          <div className="mt-1">
            <p className="whitespace-pre-wrap text-base">{publicacion.texto}</p>
            
            {/* Imagen (si existe) */}
            {publicacion.imagenURL && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img 
                  src={publicacion.imagenURL} 
                  alt="Imagen de publicación" 
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Botones de interacción */}
          <div className="flex justify-between mt-3 max-w-md">
            {/* Comentarios */}
            <button 
              onClick={manejarComentario}
              className="flex items-center space-x-1 text-gray-500 hover:text-primario-500 group"
            >
              <div className="p-2 group-hover:bg-primario-100 dark:group-hover:bg-primario-900/20 rounded-full transition-colors">
                <FaRegComment />
              </div>
              <span>{publicacion.comentarios > 0 ? publicacion.comentarios : ''}</span>
            </button>
            
            {/* Retweets */}
            <button 
              onClick={manejarRetweet}
              className={`flex items-center space-x-1 ${
                hizoRetweet ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
              } group`}
            >
              <div className={`p-2 ${
                hizoRetweet 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'group-hover:bg-green-100 dark:group-hover:bg-green-900/20'
              } rounded-full transition-colors`}>
                <FaRetweet />
              </div>
              <span>{publicacion.retweets.length > 0 ? publicacion.retweets.length : ''}</span>
            </button>
            
            {/* Likes */}
            <button 
              onClick={manejarLike}
              className={`flex items-center space-x-1 ${
                dioLike ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              } group`}
            >
              <div className={`p-2 ${
                dioLike 
                  ? 'bg-red-100 dark:bg-red-900/20' 
                  : 'group-hover:bg-red-100 dark:group-hover:bg-red-900/20'
              } rounded-full transition-colors`}>
                {dioLike ? <FaHeart /> : <FaRegHeart />}
              </div>
              <span>{publicacion.likes.length > 0 ? publicacion.likes.length : ''}</span>
            </button>
            
            {/* Compartir */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(`${window.location.origin}/publicacion/${publicacion.id}`);
                alert('Enlace copiado al portapapeles');
              }}
              className="flex items-center space-x-1 text-gray-500 hover:text-primario-500 group"
            >
              <div className="p-2 group-hover:bg-primario-100 dark:group-hover:bg-primario-900/20 rounded-full transition-colors">
                <FaShare />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Publicacion; 