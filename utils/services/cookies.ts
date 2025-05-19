import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  FieldValue, 
  deleteField
} from 'firebase/firestore';
import { db } from '../firebase';
import { Usuario } from '../../interfaces';

// Colección para almacenar cookies de usuario
const COOKIES_COLLECTION = 'cookies';

export interface UserCookies {
  userId: string;
  aceptado: boolean;
  preferencias: {
    tema: 'claro' | 'oscuro';
    notificaciones: boolean;
    idioma: string;
    ultimaVisita: Date | string | number | FieldValue;
  };
  historial: {
    ultimasVisitas: string[]; // IDs de perfiles visitados
    ultimasBusquedas: string[]; // Términos de búsqueda
  };
  analytics: {
    tiempoSesion: number;
    paginasVistas: number;
    interacciones: number;
  };
  fechaCreacion: Date | string | number | FieldValue;
  fechaActualizacion: Date | string | number | FieldValue;
}

/**
 * Inicializa o recupera las cookies del usuario
 */
export async function obtenerCookies(userId: string): Promise<UserCookies | null> {
  try {
    const docRef = doc(db, COOKIES_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserCookies;
    }
    
    // Si no existen cookies, las creamos con valores por defecto
    const nuevasCookies: UserCookies = {
      userId,
      aceptado: false,
      preferencias: {
        tema: 'claro',
        notificaciones: true,
        idioma: 'es',
        ultimaVisita: serverTimestamp()
      },
      historial: {
        ultimasVisitas: [],
        ultimasBusquedas: []
      },
      analytics: {
        tiempoSesion: 0,
        paginasVistas: 0,
        interacciones: 0
      },
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    };
    
    // Guardar cookies iniciales
    await setDoc(docRef, nuevasCookies);
    return nuevasCookies;
  } catch (error) {
    console.error('Error al obtener cookies:', error);
    return null;
  }
}

/**
 * Acepta las cookies y almacena la preferencia en Firebase
 */
export async function aceptarCookies(userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, COOKIES_COLLECTION, userId);
    
    await updateDoc(docRef, {
      aceptado: true,
      fechaActualizacion: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error al aceptar cookies:', error);
    return false;
  }
}

/**
 * Actualiza las preferencias de usuario en las cookies
 */
export async function actualizarPreferencias(
  userId: string, 
  preferencias: Partial<UserCookies['preferencias']>
): Promise<boolean> {
  try {
    const docRef = doc(db, COOKIES_COLLECTION, userId);
    const actualizaciones: Record<string, any> = {};
    
    // Construir objeto de actualización
    Object.entries(preferencias).forEach(([key, value]) => {
      actualizaciones[`preferencias.${key}`] = value;
    });
    
    actualizaciones.fechaActualizacion = serverTimestamp();
    
    await updateDoc(docRef, actualizaciones);
    return true;
  } catch (error) {
    console.error('Error al actualizar preferencias:', error);
    return false;
  }
}

/**
 * Registra una visita a un perfil de usuario
 */
export async function registrarVisitaPerfil(
  userId: string,
  perfilVisitadoId: string,
  maxHistorial: number = 10
): Promise<boolean> {
  try {
    if (userId === perfilVisitadoId) return true; // No registrar visitas al propio perfil
    
    const docRef = doc(db, COOKIES_COLLECTION, userId);
    const cookiesSnap = await getDoc(docRef);
    
    if (!cookiesSnap.exists()) {
      await obtenerCookies(userId);
      return registrarVisitaPerfil(userId, perfilVisitadoId, maxHistorial);
    }
    
    const cookies = cookiesSnap.data() as UserCookies;
    let ultimasVisitas = cookies.historial?.ultimasVisitas || [];
    
    // Eliminar el ID si ya existe para evitar duplicados
    ultimasVisitas = ultimasVisitas.filter(id => id !== perfilVisitadoId);
    
    // Añadir al principio
    ultimasVisitas.unshift(perfilVisitadoId);
    
    // Limitar tamaño del historial
    if (ultimasVisitas.length > maxHistorial) {
      ultimasVisitas = ultimasVisitas.slice(0, maxHistorial);
    }
    
    await updateDoc(docRef, {
      'historial.ultimasVisitas': ultimasVisitas,
      'analytics.paginasVistas': (cookies.analytics?.paginasVistas || 0) + 1,
      fechaActualizacion: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error al registrar visita a perfil:', error);
    return false;
  }
}

/**
 * Registra un término de búsqueda
 */
export async function registrarBusqueda(
  userId: string,
  termino: string,
  maxHistorial: number = 10
): Promise<boolean> {
  try {
    const docRef = doc(db, COOKIES_COLLECTION, userId);
    const cookiesSnap = await getDoc(docRef);
    
    if (!cookiesSnap.exists()) {
      await obtenerCookies(userId);
      return registrarBusqueda(userId, termino, maxHistorial);
    }
    
    const cookies = cookiesSnap.data() as UserCookies;
    let ultimasBusquedas = cookies.historial?.ultimasBusquedas || [];
    
    // Eliminar el término si ya existe para evitar duplicados
    ultimasBusquedas = ultimasBusquedas.filter(t => t !== termino);
    
    // Añadir al principio
    ultimasBusquedas.unshift(termino);
    
    // Limitar tamaño del historial
    if (ultimasBusquedas.length > maxHistorial) {
      ultimasBusquedas = ultimasBusquedas.slice(0, maxHistorial);
    }
    
    await updateDoc(docRef, {
      'historial.ultimasBusquedas': ultimasBusquedas,
      'analytics.interacciones': (cookies.analytics?.interacciones || 0) + 1,
      fechaActualizacion: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error al registrar búsqueda:', error);
    return false;
  }
}

/**
 * Incrementa el contador de tiempo de sesión
 */
export async function actualizarTiempoSesion(
  userId: string,
  segundos: number
): Promise<boolean> {
  try {
    const docRef = doc(db, COOKIES_COLLECTION, userId);
    const cookiesSnap = await getDoc(docRef);
    
    if (!cookiesSnap.exists()) {
      await obtenerCookies(userId);
      return actualizarTiempoSesion(userId, segundos);
    }
    
    const cookies = cookiesSnap.data() as UserCookies;
    
    await updateDoc(docRef, {
      'analytics.tiempoSesion': (cookies.analytics?.tiempoSesion || 0) + segundos,
      fechaActualizacion: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error al actualizar tiempo de sesión:', error);
    return false;
  }
}

/**
 * Borra todas las cookies del usuario
 */
export async function borrarCookies(userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, COOKIES_COLLECTION, userId);
    
    await setDoc(docRef, {
      userId,
      aceptado: false,
      preferencias: {
        tema: 'claro',
        notificaciones: false,
        idioma: 'es',
        ultimaVisita: serverTimestamp()
      },
      historial: {
        ultimasVisitas: [],
        ultimasBusquedas: []
      },
      analytics: {
        tiempoSesion: 0,
        paginasVistas: 0,
        interacciones: 0
      },
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error al borrar cookies:', error);
    return false;
  }
} 