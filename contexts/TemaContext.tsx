import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ThemeProvider, createGlobalStyle, DefaultTheme } from 'styled-components';
import { useAuth } from './AuthContext';
import { actualizarPreferencias } from '../utils/services/cookies';

// Temas definidos igual que en _app.tsx
const temaClaro: DefaultTheme = {
  background: "#ffffff",
  backgroundSecondary: "#f5f8fa",
  text: "#333333",
  textSecondary: "#536471",
  primary: "#2563eb",
  border: "#e5e7eb",
  hover: "#f0f2f5",
  shadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  
  // Propiedades para la página de perfil
  fondo: "#ffffff",
  borde: "#e5e7eb",
  texto: "#333333",
  textoSecundario: "#536471",
  primario: "#2563eb",
  error: "#ef4444",
  
  // Propiedades requeridas por styled-components
  colors: {
    primary: "#2563eb",
    secondary: "#536471",
    fondo: "#ffffff",
    borde: "#e5e7eb",
    texto: "#333333",
    textoSecundario: "#536471",
    primario: "#2563eb",
    error: "#ef4444"
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px"
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "18px"
  }
};

const temaOscuro: DefaultTheme = {
  background: "#15202b",
  backgroundSecondary: "#1e2732",
  text: "#ffffff",
  textSecondary: "#8899a6",
  primary: "#3b82f6",
  border: "#38444d",
  hover: "#202e3a",
  shadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  
  // Propiedades para la página de perfil
  fondo: "#15202b",
  borde: "#38444d",
  texto: "#ffffff",
  textoSecundario: "#8899a6",
  primario: "#3b82f6",
  error: "#f87171",
  
  // Propiedades requeridas por styled-components
  colors: {
    primary: "#3b82f6",
    secondary: "#8899a6",
    fondo: "#15202b",
    borde: "#38444d",
    texto: "#ffffff",
    textoSecundario: "#8899a6",
    primario: "#3b82f6",
    error: "#f87171"
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px"
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "18px"
  }
};

// Estilos globales
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  * {
    box-sizing: border-box;
  }
  
  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
  }
`;

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
  const { usuarioActual } = useAuth();

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
  const cambiarTema = async () => {
    const nuevoTema = tema === 'claro' ? 'oscuro' : 'claro';
    setTema(nuevoTema);
    setStyledTheme(nuevoTema === 'claro' ? temaClaro : temaOscuro);
    document.documentElement.classList.toggle('dark', nuevoTema === 'oscuro');
    localStorage.setItem('tema', nuevoTema);
    
    // Si el usuario está autenticado, guardar preferencia en Firebase
    if (usuarioActual) {
      try {
        await actualizarPreferencias(usuarioActual.id, {
          tema: nuevoTema
        });
      } catch (error) {
        console.error('Error al guardar preferencia de tema:', error);
      }
    }
  };

  const value = { tema, cambiarTema, styledTheme };

  return (
    <TemaContext.Provider value={value}>
      <ThemeProvider theme={styledTheme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </TemaContext.Provider>
  );
} 