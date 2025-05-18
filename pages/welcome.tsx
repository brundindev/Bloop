import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaMoon, FaSun, FaArrowLeft, FaUser, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { useTema } from '../contexts/TemaContext';

const WelcomePage = () => {
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'register' | 'email-login' | 'email-register'>('welcome');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { iniciarSesionConGoogle, iniciarSesionConEmail, iniciarSesionConNombreUsuario, registrarConEmail } = useAuth();
  const { tema, cambiarTema } = useTema();

  // Iniciar sesión con Google
  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await iniciarSesionConGoogle();
      router.push('/home');
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      setError('Hubo un problema al iniciar sesión con Google. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión con email o nombre de usuario
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrUsername || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    setError(''); // Limpiar error anterior
    setLoading(true);
    
    try {
      // Si contiene @ se trata como email, sino como nombre de usuario
      const isEmail = emailOrUsername.includes('@');
      
      if (isEmail) {
        await iniciarSesionConEmail(emailOrUsername, password);
      } else {
        // Si no hay @, intentamos iniciar sesión con nombre de usuario
        await iniciarSesionConNombreUsuario(emailOrUsername, password);
      }
      
      router.push('/home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo usuario
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrUsername || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    // Para registro, requerimos un email válido
    if (!emailOrUsername.includes('@')) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setError(''); // Limpiar error anterior
    setLoading(true);
    
    try {
      await registrarConEmail(emailOrUsername, password);
      router.push('/home');
    } catch (error) {
      console.error('Error al registrar:', error);
      setError('No se pudo crear la cuenta. El correo electrónico podría estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bienvenido a Bloop</title>
        <meta name="description" content="Únete a Bloop, la red social moderna y minimalista" />
      </Head>

      <div className={`welcome-container ${tema === 'oscuro' ? 'tema-oscuro' : ''}`}>
        <header className="welcome-header">
          <div className="welcome-logo-container">
            <span className="welcome-logo-icon">B</span>
            <span className="welcome-logo-text">Bloop</span>
          </div>
          <button 
            className="welcome-theme-button"
            onClick={cambiarTema} 
            aria-label={tema === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro'}
          >
            {tema === 'claro' ? <FaMoon /> : <FaSun />}
          </button>
        </header>

        <main className="welcome-main">
          <motion.div
            className="welcome-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {authMode === 'welcome' ? (
              <>
                <div className="welcome-card-header">
                  <h1 className="welcome-card-title">Bienvenido a Bloop</h1>
                  <p className="welcome-card-subtitle">
                    La red social donde encontrarás conversaciones que importan
                  </p>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<FaUser />}
                  onClick={() => setAuthMode('login')}
                  size="large"
                >
                  Iniciar sesión
                </Button>

                <div className="welcome-divider">
                  <span>o</span>
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<FaUserPlus />}
                  onClick={() => setAuthMode('register')}
                  size="large"
                >
                  Registrarse
                </Button>
              </>
            ) : authMode === 'login' ? (
              <>
                <button 
                  className="welcome-back-button"
                  onClick={() => setAuthMode('welcome')}
                >
                  <FaArrowLeft /> Volver
                </button>
                
                <div className="welcome-card-header">
                  <h1 className="welcome-card-title">Iniciar sesión</h1>
                  <p className="welcome-card-subtitle">
                    Elige cómo quieres acceder a tu cuenta
                  </p>
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<FaEnvelope />}
                  onClick={() => setAuthMode('email-login')}
                  size="large"
                >
                  Correo o nombre de usuario
                </Button>

                <div className="welcome-divider">
                  <span>o</span>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<FaGoogle />}
                  onClick={handleGoogleLogin}
                  isLoading={loading}
                  size="large"
                >
                  Continuar con Google
                </Button>
              </>
            ) : authMode === 'register' ? (
              <>
                <button 
                  className="welcome-back-button"
                  onClick={() => setAuthMode('welcome')}
                >
                  <FaArrowLeft /> Volver
                </button>
                
                <div className="welcome-card-header">
                  <h1 className="welcome-card-title">Crear cuenta</h1>
                  <p className="welcome-card-subtitle">
                    Elige cómo quieres registrarte
                  </p>
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<FaEnvelope />}
                  onClick={() => setAuthMode('email-register')}
                  size="large"
                >
                  Registrarse con correo
                </Button>

                <div className="welcome-divider">
                  <span>o</span>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<FaGoogle />}
                  onClick={handleGoogleLogin}
                  isLoading={loading}
                  size="large"
                >
                  Registrarse con Google
                </Button>
              </>
            ) : authMode === 'email-login' ? (
              <>
                <button 
                  className="welcome-back-button"
                  onClick={() => setAuthMode('login')}
                >
                  <FaArrowLeft /> Volver
                </button>
                
                <div className="welcome-card-header">
                  <h1 className="welcome-card-title">Iniciar sesión</h1>
                  <p className="welcome-card-subtitle">
                    Accede a tu cuenta de Bloop
                  </p>
                </div>

                {error && <div className="welcome-error-message">{error}</div>}

                <form onSubmit={handleEmailLogin}>
                  <div className="welcome-forms">
                    <div className="welcome-input-group">
                      <label htmlFor="emailOrUsername" className="welcome-label">Correo o nombre de usuario</label>
                      <input
                        id="emailOrUsername"
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="tu@ejemplo.com o @usuario"
                        required
                        className="welcome-input"
                      />
                    </div>

                    <div className="welcome-input-group">
                      <label htmlFor="password" className="welcome-label">Contraseña</label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        required
                        className="welcome-input"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isLoading={loading}
                      size="large"
                    >
                      Iniciar sesión
                    </Button>
                  </div>
                </form>

                <div className="welcome-form-toggle">
                  ¿No tienes una cuenta?{' '}
                  <span className="welcome-link-text" onClick={() => setAuthMode('email-register')}>
                    Regístrate
                  </span>
                </div>
              </>
            ) : (
              <>
                <button 
                  className="welcome-back-button"
                  onClick={() => setAuthMode('register')}
                >
                  <FaArrowLeft /> Volver
                </button>
                
                <div className="welcome-card-header">
                  <h1 className="welcome-card-title">Crear cuenta</h1>
                  <p className="welcome-card-subtitle">
                    Únete a Bloop y conéctate con personas de todo el mundo
                  </p>
                </div>

                {error && <div className="welcome-error-message">{error}</div>}

                <form onSubmit={handleEmailRegister}>
                  <div className="welcome-forms">
                    <div className="welcome-input-group">
                      <label htmlFor="reg-email" className="welcome-label">Correo electrónico</label>
                      <input
                        id="reg-email"
                        type="email"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="tu@ejemplo.com"
                        required
                        className="welcome-input"
                      />
                    </div>

                    <div className="welcome-input-group">
                      <label htmlFor="reg-password" className="welcome-label">Contraseña</label>
                      <input
                        id="reg-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Al menos 6 caracteres"
                        required
                        minLength={6}
                        className="welcome-input"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isLoading={loading}
                      size="large"
                    >
                      Crear cuenta
                    </Button>
                  </div>
                </form>

                <div className="welcome-form-toggle">
                  ¿Ya tienes una cuenta?{' '}
                  <span className="welcome-link-text" onClick={() => setAuthMode('email-login')}>
                    Inicia sesión
                  </span>
                </div>
              </>
            )}
          </motion.div>
        </main>

        <footer className="welcome-footer">
          <p>© {new Date().getFullYear()} Bloop. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  );
};

export default WelcomePage; 