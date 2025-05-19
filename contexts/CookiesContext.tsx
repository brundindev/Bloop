import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';
import { 
  obtenerCookies, 
  aceptarCookies, 
  actualizarPreferencias, 
  registrarVisitaPerfil,
  registrarBusqueda,
  actualizarTiempoSesion,
  borrarCookies,
  UserCookies
} from '../utils/services/cookies';

interface CookiesContextProps {
  cookies: UserCookies | null;
  cargandoCookies: boolean;
  cookiesAceptadas: boolean;
  aceptarCookiesUsuario: () => Promise<void>;
  rechazarCookies: () => Promise<void>;
  actualizarPreferenciasUsuario: (preferencias: Partial<UserCookies['preferencias']>) => Promise<void>;
  eliminarCookies: () => Promise<void>;
}

const CookiesContext = createContext<CookiesContextProps | undefined>(undefined);

export function useCookies() {
  const context = useContext(CookiesContext);
  if (context === undefined) {
    throw new Error('useCookies debe ser usado dentro de un CookiesProvider');
  }
  return context;
}

interface CookiesProviderProps {
  children: ReactNode;
}

export function CookiesProvider({ children }: CookiesProviderProps) {
  const { usuarioActual } = useAuth();
  const router = useRouter();
  
  const [cookies, setCookies] = useState<UserCookies | null>(null);
  const [cargandoCookies, setCargandoCookies] = useState(true);
  const [cookiesAceptadas, setCookiesAceptadas] = useState(false);
  const [ultimaRutaVisitada, setUltimaRutaVisitada] = useState('');
  const [tiempoSesion, setTiempoSesion] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Cargar cookies cuando cambia el usuario
  useEffect(() => {
    async function cargarCookies() {
      if (!usuarioActual) {
        setCookies(null);
        setCargandoCookies(false);
        setCookiesAceptadas(false);
        return;
      }
      
      setCargandoCookies(true);
      try {
        const userCookies = await obtenerCookies(usuarioActual.id);
        setCookies(userCookies);
        setCookiesAceptadas(userCookies?.aceptado || false);
      } catch (error) {
        console.error('Error al cargar cookies:', error);
      } finally {
        setCargandoCookies(false);
      }
    }
    
    cargarCookies();
    
    // Limpiar al desmontar
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [usuarioActual]);
  
  // Iniciar contador de tiempo de sesión
  useEffect(() => {
    if (usuarioActual && cookiesAceptadas) {
      // Limpiar intervalo existente si hay
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // Incrementar contador cada 30 segundos
      const id = setInterval(() => {
        setTiempoSesion(prev => prev + 30);
      }, 30000);
      
      setIntervalId(id);
      
      // Limpiar al desmontar
      return () => {
        clearInterval(id);
      };
    }
  }, [usuarioActual, cookiesAceptadas]);
  
  // Sincronizar tiempo de sesión con Firebase
  useEffect(() => {
    if (usuarioActual && cookiesAceptadas && tiempoSesion > 0) {
      // Actualizar en Firebase cada 2 minutos (120 segundos)
      if (tiempoSesion % 120 === 0) {
        actualizarTiempoSesion(usuarioActual.id, 120).catch(console.error);
      }
    }
  }, [usuarioActual, cookiesAceptadas, tiempoSesion]);
  
  // Registrar cambios de ruta para analíticas
  useEffect(() => {
    if (!usuarioActual || !cookiesAceptadas) return;
    
    const ruta = router.asPath;
    
    // Evitar registrar la misma ruta repetida
    if (ruta === ultimaRutaVisitada) return;
    
    setUltimaRutaVisitada(ruta);
    
    // Comprobar si es una visita a un perfil
    const perfilMatch = ruta.match(/\/perfil\/([^\/\?]+)/);
    if (perfilMatch && perfilMatch[1]) {
      const perfilId = perfilMatch[1];
      registrarVisitaPerfil(usuarioActual.id, perfilId).catch(console.error);
    }
    
    // Comprobar si es una búsqueda
    const params = new URLSearchParams(router.asPath.split('?')[1]);
    const terminoBusqueda = params.get('q');
    if (terminoBusqueda) {
      registrarBusqueda(usuarioActual.id, terminoBusqueda).catch(console.error);
    }
    
  }, [router.asPath, usuarioActual, cookiesAceptadas, ultimaRutaVisitada]);
  
  // Función para aceptar cookies
  const aceptarCookiesUsuario = async () => {
    if (!usuarioActual) return;
    
    try {
      await aceptarCookies(usuarioActual.id);
      setCookiesAceptadas(true);
      
      // Actualizar estado local
      if (cookies) {
        setCookies({
          ...cookies,
          aceptado: true
        });
      }
    } catch (error) {
      console.error('Error al aceptar cookies:', error);
    }
  };
  
  // Función para rechazar cookies
  const rechazarCookies = async () => {
    if (!usuarioActual) return;
    
    try {
      // En este caso, mantenemos las cookies básicas pero marcamos como rechazadas
      await actualizarPreferencias(usuarioActual.id, {
        notificaciones: false
      });
      
      // Actualizar estado local
      if (cookies) {
        setCookies({
          ...cookies,
          aceptado: false,
          preferencias: {
            ...cookies.preferencias,
            notificaciones: false
          }
        });
      }
      
      setCookiesAceptadas(false);
    } catch (error) {
      console.error('Error al rechazar cookies:', error);
    }
  };
  
  // Función para actualizar preferencias
  const actualizarPreferenciasUsuario = async (preferencias: Partial<UserCookies['preferencias']>) => {
    if (!usuarioActual) return;
    
    try {
      await actualizarPreferencias(usuarioActual.id, preferencias);
      
      // Actualizar estado local
      if (cookies) {
        setCookies({
          ...cookies,
          preferencias: {
            ...cookies.preferencias,
            ...preferencias
          }
        });
      }
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
    }
  };
  
  // Función para eliminar cookies
  const eliminarCookies = async () => {
    if (!usuarioActual) return;
    
    try {
      await borrarCookies(usuarioActual.id);
      
      // Actualizar estado local
      const userCookies = await obtenerCookies(usuarioActual.id);
      setCookies(userCookies);
      setCookiesAceptadas(false);
    } catch (error) {
      console.error('Error al eliminar cookies:', error);
    }
  };
  
  const value = {
    cookies,
    cargandoCookies,
    cookiesAceptadas,
    aceptarCookiesUsuario,
    rechazarCookies,
    actualizarPreferenciasUsuario,
    eliminarCookies
  };
  
  return (
    <CookiesContext.Provider value={value}>
      {children}
    </CookiesContext.Provider>
  );
} 