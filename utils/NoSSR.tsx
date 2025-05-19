import React, { useEffect, useState, ReactNode, memo } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
  onlyClient?: boolean;
  delay?: number;
}

/**
 * Componente que garantiza que el contenido solo se renderice en el cliente,
 * evitando problemas de hidratación y errores #310 de React.
 * 
 * @param children - Contenido que solo se renderizará en el cliente
 * @param fallback - Contenido alternativo durante SSR (opcional)
 * @param onlyClient - Si es true, no renderiazará nada durante SSR
 * @param delay - Tiempo de espera para asegurar que los proveedores de contexto estén completamente inicializados
 */
const NoSSR = memo(({ 
  children, 
  fallback = null, 
  onlyClient = false,
  delay = 50
}: NoSSRProps) => {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Usar setTimeout para asegurar que los proveedores de contexto estén completamente inicializados
      const timer = setTimeout(() => {
        setMounted(true);
      }, delay);

      return () => {
        clearTimeout(timer);
        setMounted(false);
      };
    } catch (err) {
      console.error('Error en NoSSR:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido en NoSSR'));
      return () => {};
    }
  }, [delay]);

  // Si hay un error en el componente
  if (error) {
    console.error('Error en NoSSR:', error);
    
    // En producción, mostrar fallback; en desarrollo, mostrar error para depuración
    if (process.env.NODE_ENV === 'production') {
      return <>{fallback}</>;
    } else {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          backgroundColor: '#fff0f0', 
          color: '#ff0000',
          border: '1px solid #ff0000',
          borderRadius: '4px'
        }}>
          <h3>Error en NoSSR</h3>
          <p>{error.message}</p>
        </div>
      );
    }
  }

  // Durante SSR o durante la hidratación inicial
  if (!mounted) {
    // Si onlyClient es true, no renderizar nada en el servidor
    if (onlyClient && typeof window === 'undefined') {
      return null;
    }
    return <>{fallback}</>;
  }

  // Una vez montado en el cliente
  try {
    return <>{children}</>;
  } catch (err) {
    console.error('Error al renderizar contenido en NoSSR:', err);
    return <>{fallback}</>;
  }
});

NoSSR.displayName = 'NoSSR';

export default NoSSR; 