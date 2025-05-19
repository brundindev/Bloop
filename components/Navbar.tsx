import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import styled, { useTheme } from 'styled-components';

const NavbarContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background};
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const NavbarTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;

const ThemeButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

interface NavbarProps {
  titulo: string;
}

const Navbar = ({ titulo }: NavbarProps) => {
  const theme = useTheme();
  const [temaActual, setTemaActual] = useState<'claro' | 'oscuro'>('claro');

  // Determinar tema actual basado en el tema aplicado
  useEffect(() => {
    // Comprobar si es tema oscuro comparando con alguna propiedad distintiva
    if (theme.background === '#15202b') {
      setTemaActual('oscuro');
    } else {
      setTemaActual('claro');
    }
  }, [theme]);

  // Cambiar tema
  const cambiarTema = () => {
    const nuevoTema = temaActual === 'claro' ? 'oscuro' : 'claro';
    localStorage.setItem('tema', nuevoTema);
    // Forzar recarga para aplicar el nuevo tema
    window.location.reload();
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <NavbarTitle>{titulo}</NavbarTitle>
        
        <ThemeButton 
          onClick={cambiarTema}
          aria-label={temaActual === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
          {temaActual === 'claro' ? (
            <FaMoon size={20} />
          ) : (
            <FaSun size={20} />
          )}
        </ThemeButton>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar; 