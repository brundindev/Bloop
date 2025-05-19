import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { TemaProvider } from '../contexts/TemaContext';
import { CookiesProvider } from '../contexts/CookiesContext';
import CookieBanner from '../components/ui/CookieBanner';
import Head from 'next/head';
import '../styles/globals.css';
import '../styles/PerfilPage.css';

// Función para detectar si estamos en el servidor
const isServer = typeof window === 'undefined';

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  
  // Después del primer renderizado, marcamos que el componente está montado
  useEffect(() => {
    // Usar un pequeño retraso para asegurar que todos los providers estén listos
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // Renderizado universal seguro (funciona en servidor y cliente)
  return (
    <>
      <Head>
        <title>Bloop - Red Social</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <TemaProvider>
        <AuthProvider>
          <CookiesProvider>
            {/* 
              Solo renderizar el contenido cuando no estamos en el servidor
              o cuando ya está montado en el cliente
            */}
            {(!isServer || mounted) && <Component {...pageProps} />}
            
            {/* El banner de cookies solo se muestra una vez montado el componente */}
            {mounted && <CookieBanner />}
          </CookiesProvider>
        </AuthProvider>
      </TemaProvider>
    </>
  );
}

export default MyApp; 