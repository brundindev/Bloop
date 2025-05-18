import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { TemaProvider } from '../contexts/TemaContext';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <TemaProvider>
        <AuthProvider>
          <Head>
            <title>Bloop - Red Social</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </AuthProvider>
      </TemaProvider>
    </>
  );
}

export default MyApp; 