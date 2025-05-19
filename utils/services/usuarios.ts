import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  limit, 
  orderBy, 
  startAfter,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Usuario } from '../../interfaces';

const USUARIOS_COLLECTION = 'usuarios';

/**
 * Obtiene un usuario por su ID
 */
export async function obtenerUsuarioPorId(usuarioId: string): Promise<Usuario | null> {
  try {
    const docRef = doc(db, USUARIOS_COLLECTION, usuarioId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Usuario;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

/**
 * Obtiene un usuario por nombre de usuario
 */
export async function obtenerUsuarioPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
  try {
    // Eliminar @ si está presente
    if (nombreUsuario.startsWith('@')) {
      nombreUsuario = nombreUsuario.substring(1);
    }
    
    const nombreUsuarioCompleto = `@${nombreUsuario}`;
    const q = query(
      collection(db, USUARIOS_COLLECTION), 
      where('nombreUsuario', '==', nombreUsuarioCompleto),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Usuario;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener usuario por nombre de usuario:', error);
    throw error;
  }
}

/**
 * Actualiza el perfil de un usuario
 */
export async function actualizarPerfilUsuario(
  usuarioId: string, 
  datos: Partial<Omit<Usuario, 'id' | 'email' | 'fechaRegistro' | 'rol'>>
): Promise<void> {
  try {
    const docRef = doc(db, USUARIOS_COLLECTION, usuarioId);
    
    // Asegurarse de que no se puedan actualizar campos sensibles
    const datosActualizacion = { ...datos };
    delete (datosActualizacion as any).id;
    delete (datosActualizacion as any).email;
    delete (datosActualizacion as any).fechaRegistro;
    delete (datosActualizacion as any).rol;
    
    await updateDoc(docRef, {
      ...datosActualizacion,
      ultimoAcceso: serverTimestamp()
    });
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    throw error;
  }
}

/**
 * Busca usuarios por nombre o nombre de usuario (para búsquedas de usuarios)
 */
export async function buscarUsuarios(
  termino: string, 
  ultimoUsuario?: Usuario,
  limiteCantidad: number = 10
): Promise<Usuario[]> {
  try {
    // Normalizar término de búsqueda
    const terminoNormalizado = termino.toLowerCase().trim();
    
    // Construir consulta básica
    let q = query(
      collection(db, USUARIOS_COLLECTION),
      where('nombreNormalizado', '>=', terminoNormalizado),
      where('nombreNormalizado', '<=', terminoNormalizado + '\uf8ff'),
      orderBy('nombreNormalizado'),
      limit(limiteCantidad)
    );
    
    // Si hay un último usuario, empezar después
    if (ultimoUsuario) {
      q = query(q, startAfter(ultimoUsuario.nombreNormalizado));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Usuario);
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    throw error;
  }
}

/**
 * Obtiene los seguidores de un usuario
 */
export async function obtenerSeguidores(
  usuarioId: string,
  ultimoUsuario?: Usuario,
  limiteCantidad: number = 10
): Promise<Usuario[]> {
  try {
    const usuario = await obtenerUsuarioPorId(usuarioId);
    
    if (!usuario || usuario.seguidores.length === 0) {
      return [];
    }
    
    // Obtener los primeros seguidores
    const seguidoresIds = ultimoUsuario 
      ? usuario.seguidores.slice(
          usuario.seguidores.indexOf(ultimoUsuario.id) + 1, 
          usuario.seguidores.indexOf(ultimoUsuario.id) + 1 + limiteCantidad
        )
      : usuario.seguidores.slice(0, limiteCantidad);
    
    const seguidores: Usuario[] = [];
    
    // Obtener detalles de cada seguidor
    for (const seguidorId of seguidoresIds) {
      const seguidor = await obtenerUsuarioPorId(seguidorId);
      if (seguidor) {
        seguidores.push(seguidor);
      }
    }
    
    return seguidores;
  } catch (error) {
    console.error('Error al obtener seguidores:', error);
    throw error;
  }
}

/**
 * Obtiene los usuarios que sigue un usuario
 */
export async function obtenerSiguiendo(
  usuarioId: string,
  ultimoUsuario?: Usuario,
  limiteCantidad: number = 10
): Promise<Usuario[]> {
  try {
    const usuario = await obtenerUsuarioPorId(usuarioId);
    
    if (!usuario || usuario.siguiendo.length === 0) {
      return [];
    }
    
    // Obtener los primeros usuarios seguidos
    const siguiendoIds = ultimoUsuario
      ? usuario.siguiendo.slice(
          usuario.siguiendo.indexOf(ultimoUsuario.id) + 1,
          usuario.siguiendo.indexOf(ultimoUsuario.id) + 1 + limiteCantidad
        )
      : usuario.siguiendo.slice(0, limiteCantidad);
    
    const siguiendo: Usuario[] = [];
    
    // Obtener detalles de cada usuario seguido
    for (const seguidoId of siguiendoIds) {
      const seguido = await obtenerUsuarioPorId(seguidoId);
      if (seguido) {
        siguiendo.push(seguido);
      }
    }
    
    return siguiendo;
  } catch (error) {
    console.error('Error al obtener usuarios seguidos:', error);
    throw error;
  }
}

/**
 * Seguir a un usuario
 */
export async function seguirUsuario(
  usuarioId: string,
  usuarioASeguirId: string
): Promise<void> {
  try {
    // No se puede seguir a uno mismo
    if (usuarioId === usuarioASeguirId) {
      throw new Error('No puedes seguirte a ti mismo');
    }
    
    const usuarioRef = doc(db, USUARIOS_COLLECTION, usuarioId);
    const usuarioASeguirRef = doc(db, USUARIOS_COLLECTION, usuarioASeguirId);
    
    const usuarioDoc = await getDoc(usuarioRef);
    const usuarioASeguirDoc = await getDoc(usuarioASeguirRef);
    
    if (!usuarioDoc.exists() || !usuarioASeguirDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    
    const usuario = usuarioDoc.data() as Usuario;
    
    // Verificar si ya sigue al usuario
    if (usuario.siguiendo.includes(usuarioASeguirId)) {
      return; // Ya sigue a este usuario, no hacer nada
    }
    
    // Actualizar la lista de "siguiendo" del usuario
    await updateDoc(usuarioRef, {
      siguiendo: [...usuario.siguiendo, usuarioASeguirId]
    });
    
    // Actualizar la lista de "seguidores" del usuario a seguir
    const usuarioASeguir = usuarioASeguirDoc.data() as Usuario;
    await updateDoc(usuarioASeguirRef, {
      seguidores: [...usuarioASeguir.seguidores, usuarioId]
    });
  } catch (error) {
    console.error('Error al seguir usuario:', error);
    throw error;
  }
}

/**
 * Dejar de seguir a un usuario
 */
export async function dejarDeSeguirUsuario(
  usuarioId: string,
  usuarioADejarDeSeguirId: string
): Promise<void> {
  try {
    const usuarioRef = doc(db, USUARIOS_COLLECTION, usuarioId);
    const usuarioADejarDeSeguirRef = doc(db, USUARIOS_COLLECTION, usuarioADejarDeSeguirId);
    
    const usuarioDoc = await getDoc(usuarioRef);
    const usuarioADejarDeSeguirDoc = await getDoc(usuarioADejarDeSeguirRef);
    
    if (!usuarioDoc.exists() || !usuarioADejarDeSeguirDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    
    const usuario = usuarioDoc.data() as Usuario;
    
    // Verificar si sigue al usuario
    if (!usuario.siguiendo.includes(usuarioADejarDeSeguirId)) {
      return; // No sigue a este usuario, no hacer nada
    }
    
    // Actualizar la lista de "siguiendo" del usuario
    await updateDoc(usuarioRef, {
      siguiendo: usuario.siguiendo.filter(id => id !== usuarioADejarDeSeguirId)
    });
    
    // Actualizar la lista de "seguidores" del usuario que se deja de seguir
    const usuarioADejarDeSeguir = usuarioADejarDeSeguirDoc.data() as Usuario;
    await updateDoc(usuarioADejarDeSeguirRef, {
      seguidores: usuarioADejarDeSeguir.seguidores.filter(id => id !== usuarioId)
    });
  } catch (error) {
    console.error('Error al dejar de seguir usuario:', error);
    throw error;
  }
}

/**
 * Verifica si un nombre de usuario está disponible (no existe en la base de datos)
 */
export async function verificarDisponibilidadNombreUsuario(nombreUsuario: string): Promise<boolean> {
  try {
    // Asegurarse que el formato sea @usuario
    if (!nombreUsuario.startsWith('@')) {
      nombreUsuario = `@${nombreUsuario}`;
    }
    
    const q = query(
      collection(db, USUARIOS_COLLECTION), 
      where('nombreUsuario', '==', nombreUsuario),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Si la consulta está vacía, el nombre de usuario está disponible
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error al verificar disponibilidad de nombre de usuario:', error);
    throw error;
  }
} 