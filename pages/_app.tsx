import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { TemaProvider } from '../contexts/TemaContext';
import { CookiesProvider } from '../contexts/CookiesContext';
import CookieBanner from '../components/ui/CookieBanner';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
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
            <Component {...pageProps} />
            <CookieBanner />
          </CookiesProvider>
        </AuthProvider>
      </TemaProvider>
    </>
  );
}

export default MyApp; 