import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaHome, FaBell, FaSearch, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { RiQuillPenFill } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const router = useRouter();
  const { usuarioActual, cerrarSesion } = useAuth();
  
  const navegacion = [
    { nombre: 'Inicio', icono: <FaHome />, ruta: '/' },
    { nombre: 'Explorar', icono: <FaSearch />, ruta: '/explorar' },
    { nombre: 'Notificaciones', icono: <FaBell />, ruta: '/notificaciones' },
    { nombre: 'Perfil', icono: <FaUser />, ruta: `/perfil/${usuarioActual?.id}` },
    { nombre: 'Configuración', icono: <FaCog />, ruta: '/configuracion' },
  ];

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="sidebar-container">
      <div style={{ flex: 1 }}>
        {/* Logo */}
        <Link href="/" legacyBehavior>
          <a className="logo-container">
            <span className="logo-icon">B</span>
            <span className="logo-text">Bloop</span>
          </a>
        </Link>

        {/* Navegación */}
        <nav className="navigation">
          {navegacion.map((item) => (
            <Link href={item.ruta} key={item.nombre} legacyBehavior>
              <a className={`nav-link ${router.pathname === item.ruta ? 'active' : ''}`}>
                <span>{item.icono}</span>
                <span>{item.nombre}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* Botón de publicar */}
        <motion.button
          className="publish-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/nueva-publicacion')}
        >
          <RiQuillPenFill style={{ fontSize: '1.25rem' }} />
          <span>Publicar</span>
        </motion.button>
      </div>

      {/* Perfil del usuario */}
      {usuarioActual && (
        <div className="profile-container">
          <div className="profile-content">
            <img 
              className="profile-image"
              src={usuarioActual.fotoURL} 
              alt={usuarioActual.nombre} 
            />
            <div className="profile-info">
              <p className="profile-name">{usuarioActual.nombre}</p>
              <p className="profile-username">{usuarioActual.nombreUsuario}</p>
            </div>
            <button 
              className="logout-button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 