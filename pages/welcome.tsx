import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGoogle, FaArrowLeft, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';
import Image from 'next/image';

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

const WelcomePage = () => {
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'register' | 'email-login' | 'email-register'>('welcome');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <StylesLoaded>
      <Head>
        <title>Bloop - Bienvenido</title>
        <meta name="description" content="Únete a Bloop, la red social moderna" />
      </Head>

      <Container>
        <BackgroundShape className="shape1" />
        <BackgroundShape className="shape2" />
        <BackgroundShape className="shape3" />
        
        <Header>
          <Logo>
            <Image 
              src="/img/logo_bloop.png" 
              alt="Bloop Logo" 
              width={50} 
              height={50} 
              style={{ borderRadius: '50%' }} 
            />
            <LogoText>bloop</LogoText>
          </Logo>
        </Header>
        
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {authMode === 'welcome' && (
            <>
              <WelcomeCardHeader>
                <Title>Bienvenido a Bloop</Title>
                <Subtitle>La red social donde encontrarás conversaciones que importan</Subtitle>
              </WelcomeCardHeader>
              
              <PrimaryButton 
                onClick={() => setAuthMode('login')}
              >
                <FaSignInAlt /> Iniciar sesión
              </PrimaryButton>
              
              <OutlineButton 
                onClick={() => setAuthMode('register')}
              >
                <FaUserPlus /> Registrarse
              </OutlineButton>
            </>
          )}
          
          {authMode === 'login' && (
            <>
              <BackButton onClick={() => setAuthMode('welcome')}>
                <FaArrowLeft /> Volver
              </BackButton>
            
              <CardHeader>
                <Title>Inicia sesión en tu cuenta</Title>
                <Subtitle>¡Hagamos el círculo más grande!</Subtitle>
              </CardHeader>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <Form onSubmit={handleEmailLogin}>
                <InputGroup>
                  <InputLabel>Email</InputLabel>
                  <Input 
                    type="text" 
                    placeholder="nombre@ejemplo.com" 
                    value={emailOrUsername} 
                    onChange={(e) => setEmailOrUsername(e.target.value)} 
                  />
                </InputGroup>
                
                <InputGroup>
                  <InputLabel>Contraseña</InputLabel>
                  <Input 
                    type="password" 
                    placeholder="Tu contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </InputGroup>
                
                <PrimaryButton 
                  type="submit" 
                  disabled={loading}
                >
                  Iniciar sesión
                </PrimaryButton>
              </Form>
              
              <Divider><span>o</span></Divider>
              
              <OutlineButton 
                onClick={handleGoogleLogin} 
                disabled={loading}
              >
                <FaGoogle /> Continuar con Google
              </OutlineButton>
              
              <LinkRow>
                ¿No tienes una cuenta?
                <span onClick={() => { setAuthMode('register'); setError(''); }}>
                  Regístrate
                </span>
              </LinkRow>
            </>
          )}
          
          {authMode === 'register' && (
            <>
              <BackButton onClick={() => setAuthMode('welcome')}>
                <FaArrowLeft /> Volver
              </BackButton>
              
              <CardHeader>
                <Title>Crea tu cuenta</Title>
                <Subtitle>¡Únete a nuestro círculo hoy!</Subtitle>
              </CardHeader>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <Form onSubmit={handleEmailRegister}>
                <InputGroup>
                  <InputLabel>Email</InputLabel>
                  <Input 
                    type="email" 
                    placeholder="nombre@ejemplo.com" 
                    value={emailOrUsername} 
                    onChange={(e) => setEmailOrUsername(e.target.value)} 
                  />
                </InputGroup>
                
                <InputGroup>
                  <InputLabel>Contraseña</InputLabel>
                  <Input 
                    type="password" 
                    placeholder="Elige una contraseña (mín. 6 caracteres)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </InputGroup>
                
                <PrimaryButton 
                  type="submit" 
                  disabled={loading}
                >
                  Registrarse
                </PrimaryButton>
              </Form>
              
              <Divider><span>o</span></Divider>
              
              <OutlineButton 
                onClick={handleGoogleLogin} 
                disabled={loading}
              >
                <FaGoogle /> Registrarse con Google
              </OutlineButton>
            </>
          )}
        </Card>
        
        <Footer>© 2023 Bloop. Todos los derechos reservados.</Footer>
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