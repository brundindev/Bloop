import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTema } from '../contexts/TemaContext';

interface NavbarProps {
  titulo: string;
}

const Navbar = ({ titulo }: NavbarProps) => {
  const { tema, cambiarTema } = useTema();

  return (
    <div className={`navbar ${tema === 'oscuro' ? 'tema-oscuro' : ''}`}>
      <div className="navbar-content">
        <h1 className="navbar-title">{titulo}</h1>
        
        <button 
          className="theme-button"
          onClick={cambiarTema}
          aria-label={tema === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
          {tema === 'claro' ? (
            <FaMoon className="moon-icon" />
          ) : (
            <FaSun className="sun-icon" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar; 