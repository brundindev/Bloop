import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

// Interfaz para las tendencias
interface Tendencia {
  id: string;
  nombre: string;
  publicaciones: number;
}

// Interfaz para los usuarios sugeridos
interface UsuarioSugerido {
  id: string;
  nombre: string;
  nombreUsuario: string;
  fotoURL: string;
}

const BarraLateral = () => {
  const { usuarioActual } = useAuth();
  const [tendencias, setTendencias] = useState<Tendencia[]>([]);
  const [usuariosSugeridos, setUsuariosSugeridos] = useState<UsuarioSugerido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerTendencias = async () => {
      try {
        const tendenciasData: Tendencia[] = [
          { id: '1', nombre: '#JavaScript', publicaciones: 1250 },
          { id: '2', nombre: '#ReactJS', publicaciones: 850 },
          { id: '3', nombre: '#TailwindCSS', publicaciones: 540 },
          { id: '4', nombre: '#TypeScript', publicaciones: 320 },
          { id: '5', nombre: '#Firebase', publicaciones: 280 },
        ];
        
        setTendencias(tendenciasData);
      } catch (error) {
        console.error('Error al obtener tendencias:', error);
      }
    };

    const obtenerUsuariosSugeridos = async () => {
      try {
        if (!usuarioActual) return;
        
        const usuariosRef = collection(db, 'usuarios');
        const usuariosQuery = query(usuariosRef, limit(3));
        const snapshot = await getDocs(usuariosQuery);
        
        const sugerencias: UsuarioSugerido[] = [];
        
        snapshot.forEach((doc) => {
          const userData = doc.data();
          if (
            doc.id !== usuarioActual.id && 
            !usuarioActual.siguiendo.includes(doc.id)
          ) {
            sugerencias.push({
              id: doc.id,
              nombre: userData.nombre,
              nombreUsuario: userData.nombreUsuario,
              fotoURL: userData.fotoURL
            });
          }
        });
        
        if (sugerencias.length < 3) {
          const ejemplos = [
            { id: 'user1', nombre: 'María González', nombreUsuario: '@mariagonzalez', fotoURL: 'https://randomuser.me/api/portraits/women/12.jpg' },
            { id: 'user2', nombre: 'Carlos Ruiz', nombreUsuario: '@carlosruiz', fotoURL: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { id: 'user3', nombre: 'Laura Díaz', nombreUsuario: '@lauradiaz', fotoURL: 'https://randomuser.me/api/portraits/women/33.jpg' },
          ];
          
          for (let i = 0; i < ejemplos.length && sugerencias.length < 3; i++) {
            if (!sugerencias.some(s => s.id === ejemplos[i].id)) {
              sugerencias.push(ejemplos[i]);
            }
          }
        }
        
        setUsuariosSugeridos(sugerencias);
      } catch (error) {
        console.error('Error al obtener usuarios sugeridos:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerTendencias();
    obtenerUsuariosSugeridos();
  }, [usuarioActual]);

  return (
    <div className="barra-lateral">
      {/* Buscador */}
      <div className="search-container">
        <div className="search-icon">
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Buscar en Bloop"
          className="search-input"
        />
      </div>
      
      {/* Tendencias */}
      <div className="lateral-card">
        <h2 className="card-title">Tendencias</h2>
        {cargando ? (
          <div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="loading-item" />
            ))}
          </div>
        ) : (
          <div>
            {tendencias.map((tendencia) => (
              <motion.div
                key={tendencia.id}
                className="trend-item"
                whileHover={{ x: 5 }}
              >
                <Link href={`/tendencia/${tendencia.nombre.substring(1)}`} legacyBehavior>
                  <a>
                    <p className="trend-name">{tendencia.nombre}</p>
                    <p className="trend-count">
                      {tendencia.publicaciones} publicaciones
                    </p>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Sugerencias */}
      {usuarioActual && (
        <div className="lateral-card">
          <h2 className="card-title">A quién seguir</h2>
          {cargando ? (
            <div>
              {[1, 2, 3].map(i => (
                <div key={i} className="loading-user">
                  <div className="loading-avatar" />
                  <div className="loading-user-info">
                    <div className="loading-name" />
                    <div className="loading-username" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {usuariosSugeridos.map((usuario) => (
                <div key={usuario.id} className="user-container">
                  <img 
                    src={usuario.fotoURL} 
                    alt={usuario.nombre}
                    className="user-avatar" 
                  />
                  <div className="user-info">
                    <Link href={`/perfil/${usuario.id}`} legacyBehavior>
                      <a>
                        <p className="user-name">{usuario.nombre}</p>
                        <p className="user-username">
                          {usuario.nombreUsuario}
                        </p>
                      </a>
                    </Link>
                  </div>
                  <button className="follow-button">
                    Seguir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BarraLateral; 