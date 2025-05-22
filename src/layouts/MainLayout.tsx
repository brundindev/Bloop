import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  SunIcon,
  MoonIcon,
  PencilSquareIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Inicio', path: '/', icon: HomeIcon },
    { name: 'Explorar', path: '/explore', icon: MagnifyingGlassIcon },
    { name: 'Notificaciones', path: '/notifications', icon: BellIcon },
    { name: 'Perfil', path: `/profile/${currentUser?.uid || ''}`, icon: UserIcon },
    { name: 'Quiénes Somos', path: '/about', icon: UserGroupIcon },
    { name: 'Configuración', path: '/settings', icon: Cog6ToothIcon },
  ];
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  const openCompose = () => {
    navigate('/compose');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header para móviles */}
      <header className="md:hidden sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Bloop Logo" className="h-8" />
          </div>
          
          {currentUser && (
            <Avatar 
              src={currentUser.photoURL} 
              alt={currentUser.displayName} 
              size="sm"
            />
          )}
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar para tablet/desktop */}
        <aside className="hidden md:flex flex-col w-1/5 h-screen sticky top-0 p-4 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6 pl-2">
            <img src="/logo.svg" alt="Bloop Logo" className="h-8" />
            <h1 className="text-xl font-bold ml-2">Bloop</h1>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-3 py-2 px-4 rounded-full transition-colors
                      ${isActive(item.path) 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                    `}
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-4">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<PencilSquareIcon className="w-5 h-5" />}
              onClick={openCompose}
            >
              Publicar
            </Button>
            
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
              >
                {darkMode ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                aria-label="Cerrar sesión"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
        
        {/* Contenido principal */}
        <main className="flex-1">
          {/* Renderizado condicional para el caso de que esté autenticado */}
          {currentUser ? (
            <div className="max-w-2xl mx-auto pb-16">
              {children}
            </div>
          ) : (
            <div>{children}</div>
          )}
        </main>
        
        {/* Footer para navegación móvil */}
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
          <div className="flex justify-around py-3">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  p-2 rounded-full
                  ${isActive(item.path) 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400'}
                `}
                aria-label={item.name}
              >
                <item.icon className="w-6 h-6" />
              </Link>
            ))}
          </div>
        </footer>
        
        {/* Botón flotante para componer en móvil */}
        <div className="md:hidden fixed right-4 bottom-20 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCompose}
            className="bg-primary-600 text-white p-4 rounded-full shadow-lg"
          >
            <PencilSquareIcon className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}; 