import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaImage, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../utils/firebase';

const PublicacionForm: React.FC = () => {
  const { usuarioActual } = useAuth();
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagenClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImagenCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB máximo
        setError('La imagen no debe superar los 5MB');
        return;
      }
      
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVistaPrevia(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const eliminarImagen = () => {
    setImagen(null);
    setVistaPrevia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuarioActual) {
      router.push('/login');
      return;
    }
    
    if (!texto.trim() && !imagen) {
      setError('Por favor, escribe algo o añade una imagen');
      return;
    }
    
    try {
      setEnviando(true);
      setError('');
      
      // Crear objeto de publicación inicial
      const nuevaPublicacion = {
        texto: texto.trim(),
        autorId: usuarioActual.id,
        autorNombre: usuarioActual.nombre,
        autorNombreUsuario: usuarioActual.nombreUsuario,
        autorFotoURL: usuarioActual.fotoURL,
        fechaCreacion: serverTimestamp(),
        likes: [],
        retweets: [],
        comentarios: 0
      };
      
      // Añadir documento a Firestore
      const docRef = await addDoc(collection(db, 'publicaciones'), nuevaPublicacion);
      
      // Si hay imagen, subirla a Storage
      if (imagen) {
        const storageRef = ref(storage, `publicaciones/${docRef.id}/${imagen.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imagen);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Progreso de carga (opcional: implementar indicador de progreso)
            },
            (error) => {
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              // Actualizar documento con URL de imagen
              await updateDoc(doc(db, 'publicaciones', docRef.id), {
                imagenURL: downloadURL
              });
              resolve();
            }
          );
        });
      }
      
      // Limpiar el formulario
      setTexto('');
      setImagen(null);
      setVistaPrevia(null);
      
      // Redirigir al feed
      router.push('/');
    } catch (error) {
      console.error('Error al crear publicación:', error);
      setError('Ocurrió un error al crear la publicación. Inténtalo nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-200 dark:border-gray-800">
      {usuarioActual && (
        <div className="flex space-x-4">
          <img 
            src={usuarioActual.fotoURL} 
            alt={usuarioActual.nombre} 
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <textarea
              placeholder="¿Qué está pasando?"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full bg-transparent resize-none outline-none min-h-[80px] text-lg"
              maxLength={280}
              disabled={enviando}
            />
            
            {vistaPrevia && (
              <div className="relative mt-2 rounded-2xl overflow-hidden">
                <img 
                  src={vistaPrevia} 
                  alt="Vista previa" 
                  className="w-full max-h-80 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={eliminarImagen}
                  className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full hover:bg-black"
                >
                  <FaTimes />
                </button>
              </div>
            )}
            
            {error && (
              <p className="text-red-500 mt-2 text-sm">{error}</p>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleImagenClick}
                  className="text-primario-500 p-2 rounded-full hover:bg-primario-100 dark:hover:bg-primario-900/20"
                  disabled={enviando}
                >
                  <FaImage size={20} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImagenCambio}
                    disabled={enviando}
                  />
                </motion.button>
                <span className="text-sm text-gray-500 ml-auto">
                  {texto.length}/280
                </span>
              </div>
              
              <motion.button
                type="submit"
                className="boton-primario px-5"
                disabled={enviando || (!texto.trim() && !imagen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {enviando ? 'Publicando...' : 'Publicar'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default PublicacionForm; 