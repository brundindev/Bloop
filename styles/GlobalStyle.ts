import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Importar fuente Inter desde Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  /* Reset básico */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    width: 100%;
    height: 100%;
    scroll-behavior: smooth;
    transition: all 0.3s ease;
  }

  body.dark-mode {
    background-color: ${({ theme }) => theme.colors.backgroundDark};
    color: ${({ theme }) => theme.colors.textDark};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  button {
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    border: none;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Estilos para scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.gray700};
    border-radius: 20px;
  }

  /* Clases de utilidad */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Animaciones */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }
`;

export default GlobalStyle; 