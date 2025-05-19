// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

// Interfaces para nuestra Red Social en Español
import { FieldValue } from 'firebase/firestore';

// Tipo para roles de usuario
export type RolUsuario = 'usuario' | 'moderador' | 'administrador';

// Interfaz para Usuario
export interface Usuario {
  id: string;
  nombre: string;
  nombreUsuario: string;
  nombreNormalizado?: string; // Versión normalizada del nombre para búsquedas
  email: string;
  fotoURL: string;
  bannerURL?: string; // URL de la imagen de banner del perfil
  biografia?: string;
  fechaRegistro: Date | string | number | FieldValue;
  ultimoAcceso?: Date | string | number | FieldValue;
  rol: RolUsuario;
  seguidores: string[];
  siguiendo: string[];
  favoritos: string[]; // IDs de publicaciones favoritas
  publicacionesCount: number; // Contador de publicaciones
  // La contraseña no se almacena en el documento del usuario
  // Firebase Auth maneja la autenticación y el almacenamiento seguro de contraseñas
}

// Interfaz para Publicación (Tweet)
export interface Publicacion {
  id: string;
  texto: string;
  imagenURL?: string;
  autorId: string;
  autorNombre: string;
  autorNombreUsuario: string;
  autorFotoURL: string;
  fechaCreacion: Date | string | number | FieldValue;
  likes: string[]; // Array de IDs de usuarios
  retweets: string[]; // Array de IDs de usuarios
  comentarios: number; // Contador de comentarios
  esRespuesta?: boolean;
  publicacionOriginalId?: string; // Si es respuesta o retweet
}

// Interfaz para Comentario
export interface Comentario {
  id: string;
  texto: string;
  autorId: string;
  autorNombre: string;
  autorNombreUsuario: string;
  autorFotoURL: string;
  fechaCreacion: Date | string | number | FieldValue;
  publicacionId: string;
  likes: string[];
}

// Interfaz para Notificación
export interface Notificacion {
  id: string;
  tipo: 'like' | 'retweet' | 'comentario' | 'seguidor';
  emisorId: string;
  emisorNombre: string;
  emisorFotoURL: string;
  receptorId: string;
  publicacionId?: string;
  fechaCreacion: Date | string | number | FieldValue;
  leida: boolean;
}
