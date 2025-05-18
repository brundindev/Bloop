import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

interface TemaContextProps {
  tema: 'claro' | 'oscuro';
  cambiarTema: () => void;
}

const TemaContext = createContext<TemaContextProps | undefined>(undefined);

export function useTema() {
  const context = useContext(TemaContext);
  if (context === undefined) {
    throw new Error('useTema debe ser usado dentro de un TemaProvider');
  }
  return context;
}

interface TemaProviderProps {
  children: ReactNode;
}

export function TemaProvider({ children }: TemaProviderProps) {
  const [tema, setTema] = useState<'claro' | 'oscuro'>('claro');

  // Al iniciar, verificamos si hay una preferencia guardada
  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema');
    
    // Si hay preferencia guardada, la usamos
    if (temaGuardado === 'oscuro' || temaGuardado === 'claro') {
      setTema(temaGuardado);
      document.documentElement.classList.toggle('dark', temaGuardado === 'oscuro');
    } 
    // Si no hay preferencia guardada, detectamos la del sistema
    else {
      const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTema(prefiereOscuro ? 'oscuro' : 'claro');
      document.documentElement.classList.toggle('dark', prefiereOscuro);
    }
  }, []);

  // Función para cambiar entre temas
  const cambiarTema = () => {
    const nuevoTema = tema === 'claro' ? 'oscuro' : 'claro';
    setTema(nuevoTema);
    document.documentElement.classList.toggle('dark', nuevoTema === 'oscuro');
    localStorage.setItem('tema', nuevoTema);
  };

  return (
    <TemaContext.Provider value={{ tema, cambiarTema }}>
      {children}
    </TemaContext.Provider>
  );
} 