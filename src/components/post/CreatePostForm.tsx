import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import type { Post } from '../../types';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase';
import type { Timestamp } from 'firebase/firestore';

interface CreatePostFormProps {
  onPostCreated?: () => void;
  placeholder?: string;
  parentId?: string;
}

export const CreatePostForm = ({ 
  onPostCreated, 
  placeholder = '¿Qué está pasando?',
  parentId
}: CreatePostFormProps) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { addDocument, loading } = useFirestore<Post>('posts');
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limitar a máximo 4 imágenes
      const selectedFiles = filesArray.slice(0, 4 - images.length);
      
      setImages(prev => [...prev, ...selectedFiles]);
      
      // Crear URLs para previsualización
      selectedFiles.forEach(file => {
        const fileUrl = URL.createObjectURL(file);
        setImageUrls(prev => [...prev, fileUrl]);
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    // Revocar URL para limpiar memoria
    URL.revokeObjectURL(imageUrls[index]);
    
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadPromises = images.map(async (image) => {
      const storageRef = ref(storage, `posts/${currentUser?.uid}/${Date.now()}_${image.name}`);
      
      const uploadTask = uploadBytesResumable(storageRef, image);
      
      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (error) => {
            console.error('Error al subir imagen:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    });
    
    try {
      const uploadedImageUrls = await Promise.all(uploadPromises);
      setIsUploading(false);
      return uploadedImageUrls;
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      setIsUploading(false);
      return [];
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !content.trim()) return;
    
    try {
      const uploadedImageUrls = await uploadImages();
      
      const newPost: Omit<Post, 'id'> = {
        content: content.trim(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        authorUsername: currentUser.username || `user_${currentUser.uid.substring(0, 8)}`,
        authorPhotoURL: currentUser.photoURL,
        likes: [],
        comments: 0,
        reposts: 0,
        images: uploadedImageUrls,
        createdAt: null as unknown as Timestamp, // Firebase serverTimestamp lo establecerá
        updatedAt: null as unknown as Timestamp, // Firebase serverTimestamp lo establecerá
      };
      
      // Si es un comentario/respuesta, agregar el parentId
      if (parentId) {
        newPost.parentId = parentId;
      }
      
      await addDocument(newPost);
      
      // Limpiar el formulario
      setContent('');
      setImages([]);
      setImageUrls([]);
      
      // Notificar que se ha creado el post
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error al crear post:', error);
    }
  };
  
  const isSubmitDisabled = !content.trim() || loading || isUploading;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
      {currentUser && (
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <Avatar src={currentUser.photoURL} alt={currentUser.displayName} />
            
            <div className="flex-1">
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                maxLength={280}
              />
              
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-gray-900 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-100"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full transition-all" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Subiendo imágenes... {uploadProgress}%
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={images.length >= 4 || isUploading}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none disabled:opacity-50"
                  >
                    <PhotoIcon className="w-6 h-6" />
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={images.length >= 4}
                  />
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {280 - content.length} caracteres restantes
                  </span>
                </div>
                
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitDisabled}
                    isLoading={loading || isUploading}
                  >
                    Publicar
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}; 