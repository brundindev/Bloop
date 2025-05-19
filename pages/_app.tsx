import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { TemaProvider } from '../contexts/TemaContext';
import { CookiesProvider } from '../contexts/CookiesContext';
import CookieBanner from '../components/ui/CookieBanner';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import '../styles/globals.css';
import '../styles/PerfilPage.css';

// Función para detectar si estamos en el servidor
const isServer = typeof window === 'undefined';

// Componente de carga mientras se carga el contenido
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#fafafa',
    color: '#333'
  }}>
    Cargando Bloop...
  </div>
);

// Envolver nuestra aplicación en un componente que no se renderiza en el servidor
const NoSSRApp = ({ Component, pageProps }: AppProps) => {
  // Estado para rastrear si el componente está completamente montado
  const [fullMounted, setFullMounted] = useState(false);
  
  useEffect(() => {
    // Usar un retraso mayor para asegurar que todos los providers estén inicializados
    const timer = setTimeout(() => {
      setFullMounted(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Renderizado controlado
  return (
    <TemaProvider>
      <AuthProvider>
        <CookiesProvider>
          {fullMounted ? (
            <>
              <Component {...pageProps} />
              <CookieBanner />
            </>
          ) : (
            <Loading />
          )}
        </CookiesProvider>
      </AuthProvider>
    </TemaProvider>
  );
};

// Deshabilitar completamente SSR para la aplicación
const NoSSRWrapper = dynamic(() => Promise.resolve(NoSSRApp), {
  ssr: false,
  loading: () => <Loading />
});

function MyApp(props: AppProps) {
  return (
    <>
      <Head>
        <title>Bloop - Red Social</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NoSSRWrapper {...props} />
    </>
  );
}

export default MyApp; 