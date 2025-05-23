import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { useAuth } from './hooks/useAuth';
import { ReactNode } from 'react';

// Estilos CSS en línea para el loader
const loaderStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb'
  },
  darkContainer: {
    backgroundColor: '#111827'
  },
  textCenter: {
    textAlign: 'center' as const
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
    borderRadius: '9999px',
    height: '2rem',
    width: '2rem',
    borderWidth: '0',
    borderBottomWidth: '2px',
    borderColor: '#6366f1'
  },
  loadingText: {
    marginTop: '0.5rem',
    color: '#6b7280'
  },
  darkLoadingText: {
    color: '#9ca3af'
  }
};

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  if (loading) {
    return (
      <div style={{
        ...loaderStyles.container,
        ...(isDarkMode ? loaderStyles.darkContainer : {})
      }}>
        <div style={loaderStyles.textCenter}>
          <div style={loaderStyles.spinner}></div>
          <p style={{
            ...loaderStyles.loadingText,
            ...(isDarkMode ? loaderStyles.darkLoadingText : {})
          }}>Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Envoltorio para los providers
const AppProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </ThemeProvider>
);

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <AboutUsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta para redirigir rutas desconocidas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
