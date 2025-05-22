import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Verificar si el usuario ya ha establecido una preferencia de tema
  const storedDarkMode = localStorage.getItem('darkMode');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const [darkMode, setDarkMode] = useState<boolean>(
    storedDarkMode !== null 
      ? JSON.parse(storedDarkMode) 
      : prefersDarkMode
  );

  // Actualizar la clase del HTML cuando cambia el modo
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Guardar la preferencia en localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar si el usuario no ha establecido una preferencia
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}; 