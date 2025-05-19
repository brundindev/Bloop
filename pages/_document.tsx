import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => {
            return sheet.collectStyles(<App {...props} />);
          },
        });

      const initialProps = await Document.getInitialProps(ctx);
      
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          <meta charSet="utf-8" />
          {/* Prevenir errores de hidratación con este script */}
          <script dangerouslySetInnerHTML={{
            __html: `
              // Prevenir errores de hidratación #310
              window.__REACT_HYDRATION_ERROR_SUPPRESSED__ = true;
              
              // Función para verificar si la aplicación está cargada
              function checkReadyState() {
                if (document.readyState === 'complete') {
                  // Asegurar que los componentes solo se rendericen cuando el DOM esté listo
                  window.__NEXT_HYDRATED__ = true;
                }
              }
              
              // Verificar cuando el DOM esté completamente cargado
              document.addEventListener('readystatechange', checkReadyState);
              checkReadyState();
            `
          }} />
          
          {/* Favicon */}
          <link rel="icon" href="/img/logo_bloop.png" />
          <link rel="apple-touch-icon" href="/img/logo_bloop.png" />
          
          {/* Fuentes */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
} 