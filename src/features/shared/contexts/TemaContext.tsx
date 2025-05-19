import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider, DefaultTheme } from 'styled-components';

// Temas definidos igual que en _app.tsx
const temaClaro: DefaultTheme = {
  background: "#ffffff",
  backgroundSecondary: "#f5f8fa",
  text: "#333333",
  textSecondary: "#536471",
  primary: "#2563eb",
  border: "#e5e7eb",
  hover: "#f0f2f5",
  shadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
};

const temaOscuro: DefaultTheme = {
  background: "#15202b",
  backgroundSecondary: "#1e2732",
  text: "#ffffff",
  textSecondary: "#8899a6",
  primary: "#3b82f6",
  border: "#38444d",
  hover: "#202e3a",
  shadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
};

interface TemaContextProps {
  tema: 'claro' | 'oscuro';
  cambiarTema: () => void;
  styledTheme: DefaultTheme;
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
  const [styledTheme, setStyledTheme] = useState<DefaultTheme>(temaClaro);

  // Al iniciar, verificamos si hay una preferencia guardada
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      const temaGuardado = localStorage.getItem('tema');
      
      if (temaGuardado === 'oscuro') {
        setTema('oscuro');
        setStyledTheme(temaOscuro);
        document.documentElement.classList.add('dark');
      } else if (temaGuardado === 'claro') {
        setTema('claro');
        setStyledTheme(temaClaro);
        document.documentElement.classList.remove('dark');
      } else {
        // Si no hay preferencia guardada, detectamos la del sistema
        const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTema(prefiereOscuro ? 'oscuro' : 'claro');
        setStyledTheme(prefiereOscuro ? temaOscuro : temaClaro);
        document.documentElement.classList.toggle('dark', prefiereOscuro);
        localStorage.setItem('tema', prefiereOscuro ? 'oscuro' : 'claro');
      }
    }
  }, []);

  // Función para cambiar entre temas
  const cambiarTema = () => {
    const nuevoTema = tema === 'claro' ? 'oscuro' : 'claro';
    setTema(nuevoTema);
    setStyledTheme(nuevoTema === 'claro' ? temaClaro : temaOscuro);
    document.documentElement.classList.toggle('dark', nuevoTema === 'oscuro');
    localStorage.setItem('tema', nuevoTema);
  };

  const value = { tema, cambiarTema, styledTheme };

  return (
    <TemaContext.Provider value={value}>
      <StyledThemeProvider theme={styledTheme}>
        {children}
      </StyledThemeProvider>
    </TemaContext.Provider>
  );
} 