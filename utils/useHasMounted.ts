import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si un componente ya ha sido montado en el cliente.
 * Útil para evitar problemas de hidratación SSR/CSR.
 * 
 * @returns {boolean} - Verdadero si el componente está montado en el cliente, falso durante SSR o hidratación inicial.
 */
export default function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    // Esta función solo se ejecuta en el cliente, después del primer renderizado
    setHasMounted(true);
    
    return () => setHasMounted(false);
  }, []);
  
  return hasMounted;
} 