import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { TemaProvider } from '../contexts/TemaContext';
import { CookiesProvider } from '../contexts/CookiesContext';
import CookieBanner from '../components/ui/CookieBanner';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import NoSSR from '../utils/NoSSR';
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bloop - Red Social</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Usar NoSSR para todo el contenido con providers */}
      <NoSSR fallback={<Loading />}>
        <TemaProvider>
          <AuthProvider>
            <CookiesProvider>
              <Component {...pageProps} />
              <CookieBanner />
            </CookiesProvider>
          </AuthProvider>
        </TemaProvider>
      </NoSSR>
    </>
  );
}

export default MyApp; 