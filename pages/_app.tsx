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
    setMounted(true);
  }, []);

  // Renderizado universal seguro (funciona en servidor y cliente)
  return (
    <>
      <TemaProvider>
        <AuthProvider>
          <CookiesProvider>
            <Head>
              <title>Bloop - Red Social</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            
            {/* 
              Durante la hidratación, en el primer renderizado del cliente,
              mostramos un contenido básico para evitar errores de hidratación 
            */}
            {!mounted && isServer ? null : <Component {...pageProps} />}
            
            {/* El banner de cookies solo se muestra una vez montado el componente */}
            {mounted ? <CookieBanner /> : null}
          </CookiesProvider>
        </AuthProvider>
      </TemaProvider>
    </>
  );
}

export default MyApp; 