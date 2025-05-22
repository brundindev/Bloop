import { useState, useEffect } from 'react';
import { orderBy, limit, where, type QueryConstraint } from 'firebase/firestore';
import { MainLayout } from '../layouts/MainLayout';
import { CreatePostForm } from '../components/post/CreatePostForm';
import { PostCard } from '../components/post/PostCard';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../hooks/useAuth';
import type { Post } from '../types';

export const HomePage = () => {
  const { currentUser } = useAuth();
  const { queryDocuments, loading, error } = useFirestore<Post>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  
  // Cargar posts cuando se monte el componente
  useEffect(() => {
    fetchPosts();
  }, [currentUser, activeTab]);
  
  const fetchPosts = async () => {
    if (!currentUser) return;
    
    try {
      let constraints: QueryConstraint[] = [
        orderBy('createdAt', 'desc'),
        limit(20)
      ];
      
      // Si el tab es "following", filtrar solo posts de usuarios seguidos
      if (activeTab === 'following' && currentUser.following && currentUser.following.length > 0) {
        constraints = [
          where('authorId', 'in', currentUser.following),
          ...constraints
        ];
      }
      
      const fetchedPosts = await queryDocuments(...constraints);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error al obtener posts:', error);
    }
  };
  
  const handlePostCreated = () => {
    fetchPosts();
  };
  
  const handleLike = () => {
    // El like ya se maneja en el componente PostCard
    // Solo actualizamos el estado local si es necesario
    fetchPosts();
  };
  
  return (
    <MainLayout>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('forYou')}
            className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 flex-1 text-center ${
              activeTab === 'forYou'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            Para ti
          </button>
          
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 flex-1 text-center ${
              activeTab === 'following'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            Siguiendo
          </button>
        </nav>
      </div>
      
      <CreatePostForm onPostCreated={handlePostCreated} />
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Cargando posts...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            Error al cargar los posts. Por favor, intenta de nuevo.
          </div>
        ) : posts.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            {activeTab === 'following' 
              ? 'No hay posts de usuarios que sigues. ¡Comienza a seguir usuarios para ver su contenido!' 
              : 'No hay posts disponibles. ¡Sé el primero en publicar algo!'}
          </div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={handleLike}
              onComment={() => {}} // Implementar al crear la página de detalle del post
              onRepost={() => {}} // Implementar funcionalidad de repost
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}; 