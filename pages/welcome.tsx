import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaArrowLeft, FaSignInAlt, FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';
import Image from 'next/image';
import { verificarDisponibilidadNombreUsuario } from '../utils/services/usuarios';

// Componente que garantiza que todas las fuentes y estilos se carguen antes de mostrar el contenido
const StylesLoaded = ({ children }: { children: React.ReactNode }) => {
  const [loaded, setLoaded] = useState(false);
  
  // Useeffect para prevenir el parpadeo de estilos
  React.useEffect(() => {
    // Verificar si document está disponible (lado del cliente)
    if (typeof document !== 'undefined') {
      setLoaded(true);
    }
  }, []);
  
  // Solo muestra el contenido cuando estamos en el cliente
  return loaded ? <>{children}</> : null;
};

// Estilos con styled-components
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0a1c3b 0%, #132e5d 50%, #1e3b7d 100%);
  position: relative;
  overflow: hidden;
  padding: 0 20px;
`;

const BackgroundShape = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(72, 102, 180, 0.1);
  z-index: 0;
  
  &.shape1 {
    width: 700px;
    height: 700px;
    top: -200px;
    left: -100px;
  }
  
  &.shape2 {
    width: 500px;
    height: 500px;
    bottom: -100px;
    right: -100px;
  }
  
  &.shape3 {
    width: 300px;
    height: 300px;
    bottom: 100px;
    left: 150px;
    background: rgba(72, 102, 180, 0.07);
  }
`;

const Header = styled.header`
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 10;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
`;

const LogoText = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
`;

const Card = styled(motion.div)`
  max-width: 450px;
  width: 100%;
  padding: 40px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1;
  overflow: hidden;
  
  @media (max-width: 600px) {
    padding: 30px 20px;
  }
`;

const CardHeader = styled.div`
  text-align: left;
  margin-bottom: 32px;
`;

const WelcomeCardHeader = styled(CardHeader)`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a202c;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 16px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 16px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #2563eb;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  color: #2563eb;
  border: 1px solid #2563eb;
  
  &:hover:not(:disabled) {
    background-color: rgba(37, 99, 235, 0.05);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
  }
  
  span {
    padding: 0 16px;
    color: #718096;
    font-size: 14px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #718096;
  font-size: 14px;
  margin-bottom: 24px;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #2563eb;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const LinkRow = styled.div`
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #718096;
  
  span {
    color: #2563eb;
    cursor: pointer;
    margin-left: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

const AnimatedInput = styled(motion.div)`
  width: 100%;
`;

const AnimatedButton = styled(motion.div)`
  width: 100%;
`;

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { y: -20, opacity: 0, transition: { duration: 0.2 } }
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.2 } }
};

const WelcomePage = () => {
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'register' | 'email-login' | 'email-register'>('welcome');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [nombreDisponible, setNombreDisponible] = useState<boolean | null>(null);
  const [verificandoNombre, setVerificandoNombre] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { iniciarSesionConGoogle, iniciarSesionConEmail, iniciarSesionConNombreUsuario, registrarConEmail } = useAuth();

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

  // Verificar disponibilidad del nombre de usuario
  const verificarDisponibilidad = async () => {
    if (!nombreUsuario || nombreUsuario.length < 3) {
      setNombreDisponible(null);
      return;
    }
    
    setVerificandoNombre(true);
    try {
      // Asegurarse que el nombre tenga formato @usuario
      const nombreAVerificar = nombreUsuario.startsWith('@') 
        ? nombreUsuario 
        : `@${nombreUsuario}`;
      
      const disponible = await verificarDisponibilidadNombreUsuario(nombreAVerificar);
      setNombreDisponible(disponible);
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      setNombreDisponible(null);
    } finally {
      setVerificandoNombre(false);
    }
  };

  // Manejar cambio en el campo de nombre de usuario
  const handleNombreUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNombreUsuario(valor);
    
    // Reiniciar el estado de disponibilidad
    if (nombreDisponible !== null) {
      setNombreDisponible(null);
    }
  };

  // Registrar nuevo usuario
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrUsername || !password || !nombreUsuario) {
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

    if (nombreUsuario.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (nombreDisponible === false) {
      setError('Este nombre de usuario ya está en uso. Por favor, elige otro.');
      return;
    }

    if (nombreDisponible === null) {
      // Verificar disponibilidad antes de continuar
      await verificarDisponibilidad();
      if (nombreDisponible === false) {
        setError('Este nombre de usuario ya está en uso. Por favor, elige otro.');
        return;
      }
    }
    
    setError(''); // Limpiar error anterior
    setLoading(true);
    
    try {
      await registrarConEmail(emailOrUsername, password, nombreUsuario);
      router.push('/home');
    } catch (error) {
      console.error('Error al registrar:', error);
      setError('No se pudo crear la cuenta. El correo electrónico podría estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StylesLoaded>
      <Head>
        <title>Bloop - Bienvenido</title>
        <meta name="description" content="Únete a Bloop, la red social moderna" />
      </Head>

      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <BackgroundShape className="shape1" />
          <BackgroundShape className="shape2" />
          <BackgroundShape className="shape3" />
        </motion.div>
        
        <Header>
          <Logo>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.3 
              }}
            >
              <Image 
                src="/img/logo_bloop.png" 
                alt="Bloop Logo" 
                width={50} 
                height={50} 
                style={{ borderRadius: '50%' }} 
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <LogoText>bloop</LogoText>
            </motion.div>
          </Logo>
        </Header>
        
        <AnimatePresence mode="wait">
          <Card
            key={authMode}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {authMode === 'welcome' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <WelcomeCardHeader>
                  <motion.div variants={itemVariants}>
                    <Title>Bienvenido a Bloop</Title>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Subtitle>La red social donde encontrarás conversaciones que importan</Subtitle>
                  </motion.div>
                </WelcomeCardHeader>
                
                <AnimatedButton variants={itemVariants}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <PrimaryButton 
                      onClick={() => setAuthMode('login')}
                    >
                      <FaSignInAlt /> Iniciar sesión
                    </PrimaryButton>
                  </motion.div>
                </AnimatedButton>
                
                <AnimatedButton variants={itemVariants}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <OutlineButton 
                      onClick={() => setAuthMode('register')}
                    >
                      <FaUserPlus /> Registrarse
                    </OutlineButton>
                  </motion.div>
                </AnimatedButton>
              </motion.div>
            )}
            
            {authMode === 'login' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <BackButton onClick={() => setAuthMode('welcome')}>
                    <FaArrowLeft /> Volver
                  </BackButton>
                </motion.div>
              
                <CardHeader>
                  <motion.div variants={itemVariants}>
                    <Title>Inicia sesión en tu cuenta</Title>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Subtitle>¡Hagamos el círculo más grande!</Subtitle>
                  </motion.div>
                </CardHeader>
                
                {error && (
                  <motion.div 
                    variants={itemVariants}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ErrorMessage>{error}</ErrorMessage>
                  </motion.div>
                )}
                
                <Form onSubmit={handleEmailLogin}>
                  <AnimatedInput variants={itemVariants}>
                    <InputGroup>
                      <InputLabel>Email</InputLabel>
                      <Input 
                        type="text" 
                        placeholder="nombre@ejemplo.com" 
                        value={emailOrUsername} 
                        onChange={(e) => setEmailOrUsername(e.target.value)} 
                      />
                    </InputGroup>
                  </AnimatedInput>
                  
                  <AnimatedInput variants={itemVariants}>
                    <InputGroup>
                      <InputLabel>Contraseña</InputLabel>
                      <Input 
                        type="password" 
                        placeholder="Tu contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                    </InputGroup>
                  </AnimatedInput>
                  
                  <AnimatedButton variants={itemVariants}>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <PrimaryButton 
                        type="submit" 
                        disabled={loading}
                      >
                        Iniciar sesión
                      </PrimaryButton>
                    </motion.div>
                  </AnimatedButton>
                </Form>
                
                <motion.div variants={itemVariants}>
                  <Divider><span>o</span></Divider>
                </motion.div>
                
                <AnimatedButton variants={itemVariants}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <OutlineButton 
                      onClick={handleGoogleLogin} 
                      disabled={loading}
                    >
                      <FaGoogle /> Continuar con Google
                    </OutlineButton>
                  </motion.div>
                </AnimatedButton>
                
                <motion.div variants={itemVariants}>
                  <LinkRow>
                    ¿No tienes una cuenta?
                    <span onClick={() => { setAuthMode('register'); setError(''); }}>
                      Regístrate
                    </span>
                  </LinkRow>
                </motion.div>
              </motion.div>
            )}
            
            {authMode === 'register' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <BackButton onClick={() => setAuthMode('welcome')}>
                    <FaArrowLeft /> Volver
                  </BackButton>
                </motion.div>
                
                <CardHeader>
                  <motion.div variants={itemVariants}>
                    <Title>Crea tu cuenta</Title>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Subtitle>¡Únete a nuestro círculo hoy!</Subtitle>
                  </motion.div>
                </CardHeader>
                
                {error && (
                  <motion.div 
                    variants={itemVariants}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ErrorMessage>{error}</ErrorMessage>
                  </motion.div>
                )}
                
                <Form onSubmit={handleEmailRegister}>
                  <AnimatedInput variants={itemVariants}>
                    <InputGroup>
                      <InputLabel>Email</InputLabel>
                      <Input 
                        type="email" 
                        placeholder="nombre@ejemplo.com" 
                        value={emailOrUsername} 
                        onChange={(e) => setEmailOrUsername(e.target.value)} 
                      />
                    </InputGroup>
                  </AnimatedInput>

                  <AnimatedInput variants={itemVariants}>
                    <InputGroup>
                      <InputLabel>Nombre de usuario</InputLabel>
                      <div style={{ position: 'relative' }}>
                        <Input 
                          type="text" 
                          placeholder="@usuario" 
                          value={nombreUsuario} 
                          onChange={handleNombreUsuarioChange}
                          onBlur={verificarDisponibilidad}
                          style={{ 
                            paddingRight: '40px',
                            borderColor: nombreDisponible === true ? '#10b981' : 
                                        nombreDisponible === false ? '#ef4444' : 
                                        '#e2e8f0'
                          }}
                        />
                        {verificandoNombre && (
                          <motion.div 
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <span>...</span>
                          </motion.div>
                        )}
                        {!verificandoNombre && nombreDisponible === true && (
                          <motion.div 
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <FaCheck />
                          </motion.div>
                        )}
                        {!verificandoNombre && nombreDisponible === false && (
                          <motion.div 
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <FaTimes />
                          </motion.div>
                        )}
                      </div>
                      {nombreDisponible === false && (
                        <motion.span 
                          style={{ fontSize: '12px', color: '#ef4444' }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          Este nombre de usuario ya está en uso
                        </motion.span>
                      )}
                      {nombreDisponible === true && (
                        <motion.span 
                          style={{ fontSize: '12px', color: '#10b981' }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          ¡Nombre de usuario disponible!
                        </motion.span>
                      )}
                    </InputGroup>
                  </AnimatedInput>
                  
                  <AnimatedInput variants={itemVariants}>
                    <InputGroup>
                      <InputLabel>Contraseña</InputLabel>
                      <Input 
                        type="password" 
                        placeholder="Elige una contraseña (mín. 6 caracteres)" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                    </InputGroup>
                  </AnimatedInput>
                  
                  <AnimatedButton variants={itemVariants}>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <PrimaryButton 
                        type="submit" 
                        disabled={loading || nombreDisponible === false}
                      >
                        Registrarse
                      </PrimaryButton>
                    </motion.div>
                  </AnimatedButton>
                </Form>
                
                <motion.div variants={itemVariants}>
                  <Divider><span>o</span></Divider>
                </motion.div>
                
                <AnimatedButton variants={itemVariants}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <OutlineButton 
                      onClick={handleGoogleLogin} 
                      disabled={loading}
                    >
                      <FaGoogle /> Registrarse con Google
                    </OutlineButton>
                  </motion.div>
                </AnimatedButton>
              </motion.div>
            )}
          </Card>
        </AnimatePresence>
        
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Footer>© 2025 Bloop. Todos los derechos reservados.</Footer>
        </motion.footer>
      </Container>
    </StylesLoaded>
  );
};

// Esta función se ejecuta en el servidor
export async function getServerSideProps() {
  return {
    props: {}, // props vacíos, pero fuerza que esta página siempre use SSR
  };
}

export default WelcomePage; 