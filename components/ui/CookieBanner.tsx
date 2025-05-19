import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookieBite, FaShieldAlt, FaTimes, FaCog } from 'react-icons/fa';
import { useCookies } from '../../contexts/CookiesContext';
import { useAuth } from '../../contexts/AuthContext';

const BannerContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 420px;
  background-color: ${props => props.theme.colors.fondo};
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  padding: 20px;
  
  @media (max-width: 520px) {
    width: 95%;
    bottom: 10px;
    max-width: none;
  }
`;

const BannerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const BannerTitle = styled.h3`
  margin: 0 0 0 10px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.texto};
`;

const BannerText = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.5;
  color: ${props => props.theme.colors.textoSecundario};
`;

const BannerActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Button = styled(motion.button)`
  padding: 10px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.primario};
  color: white;
  border: none;
  flex: 1;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.texto};
  border: 1px solid ${props => props.theme.colors.borde};
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textoSecundario};
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const PreferenciasContainer = styled(motion.div)`
  margin-top: 15px;
  border-top: 1px solid ${props => props.theme.colors.borde};
  padding-top: 15px;
`;

const PreferenciaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PreferenciaLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

const PreferenciaTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.texto};
`;

const PreferenciaDescription = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textoSecundario};
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .3s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: ${props => props.theme.colors.primario};
  }
  
  input:checked + span:before {
    transform: translateX(24px);
  }
`;

const IconContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primario};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    y: 50,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// Tipo para las preferencias de cookies
type TipoPreferenciaCookie = 'necesarias' | 'preferencias' | 'analiticas';

const CookieBanner: React.FC = () => {
  const { usuarioActual } = useAuth();
  const { 
    cookiesAceptadas, 
    aceptarCookiesUsuario, 
    rechazarCookies, 
    actualizarPreferenciasUsuario,
    cookies
  } = useCookies();
  
  const [mostrarBanner, setMostrarBanner] = useState(true);
  const [mostrarPreferencias, setMostrarPreferencias] = useState(false);
  const [preferencias, setPreferencias] = useState({
    necesarias: true, // Siempre true, no se puede desactivar
    preferencias: true,
    analiticas: true
  });
  
  // No mostrar banner si las cookies ya fueron aceptadas
  if (cookiesAceptadas || !usuarioActual) {
    return null;
  }
  
  // Manejar la acción de aceptar todas las cookies
  const handleAceptar = async () => {
    await aceptarCookiesUsuario();
    setMostrarBanner(false);
  };
  
  // Manejar la acción de rechazar cookies
  const handleRechazar = async () => {
    await rechazarCookies();
    setMostrarBanner(false);
  };
  
  // Manejar cambios en las preferencias de cookies
  const handleTogglePreferencia = (tipo: TipoPreferenciaCookie) => {
    setPreferencias(prev => ({
      ...prev,
      [tipo]: !prev[tipo]
    }));
  };
  
  // Manejar guardar preferencias
  const handleGuardarPreferencias = async () => {
    // Si todas las preferencias están activadas, aceptar todas las cookies
    if (preferencias.preferencias && preferencias.analiticas) {
      await aceptarCookiesUsuario();
    } else {
      // Si no, actualizar las preferencias específicas
      await actualizarPreferenciasUsuario({
        notificaciones: preferencias.preferencias
      });
      
      // Si las analíticas están desactivadas, rechazar cookies
      if (!preferencias.analiticas) {
        await rechazarCookies();
      } else {
        await aceptarCookiesUsuario();
      }
    }
    
    setMostrarBanner(false);
  };
  
  return (
    <AnimatePresence>
      {mostrarBanner && (
        <BannerContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CloseButton 
            onClick={() => setMostrarBanner(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </CloseButton>
          
          <BannerHeader>
            <IconContainer>
              <FaCookieBite size={18} />
            </IconContainer>
            <BannerTitle>Política de Cookies</BannerTitle>
          </BannerHeader>
          
          <BannerText>
            Utilizamos cookies para personalizar tu experiencia, recordar tus preferencias
            y mejorar nuestros servicios. Tus datos estarán seguros y nunca serán compartidos.
          </BannerText>
          
          {mostrarPreferencias ? (
            <>
              <PreferenciasContainer
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <PreferenciaItem>
                  <PreferenciaLabel>
                    <PreferenciaTitle>Cookies necesarias</PreferenciaTitle>
                    <PreferenciaDescription>Esenciales para el funcionamiento</PreferenciaDescription>
                  </PreferenciaLabel>
                  <Toggle>
                    <input 
                      type="checkbox" 
                      checked={true} 
                      disabled={true}
                    />
                    <span />
                  </Toggle>
                </PreferenciaItem>
                
                <PreferenciaItem>
                  <PreferenciaLabel>
                    <PreferenciaTitle>Cookies de preferencias</PreferenciaTitle>
                    <PreferenciaDescription>Recuerdan tus ajustes y personalización</PreferenciaDescription>
                  </PreferenciaLabel>
                  <Toggle>
                    <input 
                      type="checkbox" 
                      checked={preferencias.preferencias} 
                      onChange={() => handleTogglePreferencia('preferencias')}
                    />
                    <span />
                  </Toggle>
                </PreferenciaItem>
                
                <PreferenciaItem>
                  <PreferenciaLabel>
                    <PreferenciaTitle>Cookies de analítica</PreferenciaTitle>
                    <PreferenciaDescription>Nos ayudan a mejorar el servicio</PreferenciaDescription>
                  </PreferenciaLabel>
                  <Toggle>
                    <input 
                      type="checkbox" 
                      checked={preferencias.analiticas} 
                      onChange={() => handleTogglePreferencia('analiticas')}
                    />
                    <span />
                  </Toggle>
                </PreferenciaItem>
              </PreferenciasContainer>
              
              <BannerActions style={{ marginTop: '15px' }}>
                <SecondaryButton
                  onClick={() => setMostrarPreferencias(false)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Volver
                </SecondaryButton>
                <PrimaryButton 
                  onClick={handleGuardarPreferencias}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaShieldAlt size={14} />
                  Guardar preferencias
                </PrimaryButton>
              </BannerActions>
            </>
          ) : (
            <BannerActions>
              <SecondaryButton 
                onClick={() => setMostrarPreferencias(true)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaCog size={14} />
                Personalizar
              </SecondaryButton>
              <SecondaryButton 
                onClick={handleRechazar}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Rechazar
              </SecondaryButton>
              <PrimaryButton 
                onClick={handleAceptar}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Aceptar todas
              </PrimaryButton>
            </BannerActions>
          )}
        </BannerContainer>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner; 