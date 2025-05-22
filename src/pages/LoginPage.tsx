import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { currentUser, login, loading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      await login();
    } catch (err) {
      setAuthError('Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.');
      console.error('Error de inicio de sesión:', err);
    }
  };

  // Si el usuario ya está autenticado, redirigir a la página principal
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout 
      title="Bienvenido a Bloop" 
      subtitle="Tu nueva red social favorita"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
            Inicia sesión para compartir tus pensamientos con el mundo
          </p>

          <Button
            variant="primary"
            fullWidth
            isLoading={loading}
            onClick={handleLogin}
            className="flex justify-center py-3"
          >
            Iniciar sesión con Google
          </Button>
        </div>

        {(authError || error) && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
            {authError || (error && error.message)}
          </div>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300">
                Al iniciar sesión, aceptas nuestros términos y condiciones
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}; 