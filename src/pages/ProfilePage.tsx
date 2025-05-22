import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, where, orderBy } from 'firebase/firestore';
import { MainLayout } from '../layouts/MainLayout';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { PostCard } from '../components/post/PostCard';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { db } from '../services/firebase';
import type { User, Post } from '../types';
import { CalendarIcon, MapPinIcon, LinkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { queryDocuments: queryPosts } = useFirestore<Post>('posts');
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media'>('posts');
  
  // Verificar si el perfil es del usuario actual
  const isCurrentUserProfile = currentUser && userId === currentUser.uid;
  
  // Obtener datos del usuario y sus posts
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (!userId) {
        navigate('/');
        return;
      }
      
      setLoading(true);
      
      try {
        // Obtener datos del usuario
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
        
        if (!userSnapshot.exists()) {
          navigate('/not-found');
          return;
        }
        
        const userData = userSnapshot.data() as User;
        setProfileUser(userData);
        
        // Verificar si el usuario actual sigue a este perfil
        if (currentUser && currentUser.following) {
          setIsFollowing(currentUser.following.includes(userId));
        }
        
        // Obtener posts del usuario según el tab activo
        let postsQuery;
        if (activeTab === 'posts') {
          postsQuery = await queryPosts(
            where('authorId', '==', userId),
            where('parentId', '==', null), // Solo posts principales, no respuestas
            orderBy('createdAt', 'desc')
          );
        } else if (activeTab === 'replies') {
          postsQuery = await queryPosts(
            where('authorId', '==', userId),
            where('parentId', '!=', null), // Solo respuestas
            orderBy('createdAt', 'desc')
          );
        } else if (activeTab === 'media') {
          postsQuery = await queryPosts(
            where('authorId', '==', userId),
            where('images', '!=', []), // Solo posts con imágenes
            orderBy('createdAt', 'desc')
          );
        }
        
        setPosts(postsQuery || []);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndPosts();
  }, [userId, currentUser, activeTab, navigate, queryPosts]);
  
  // Manejar acción de seguir/dejar de seguir
  const handleFollowToggle = async () => {
    if (!currentUser || !profileUser) return;
    
    try {
      // Actualizar la lista de usuarios seguidos del usuario actual
      const updatedFollowing = [...(currentUser.following || [])];
      
      if (isFollowing) {
        // Dejar de seguir
        const index = updatedFollowing.indexOf(userId!);
        if (index > -1) {
          updatedFollowing.splice(index, 1);
        }
      } else {
        // Seguir
        updatedFollowing.push(userId!);
      }
      
      // Actualizar en Firestore
      await updateProfile({ following: updatedFollowing });
      
      // Actualizar estado local
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error al actualizar estado de seguimiento:', error);
    }
  };
  
  // Formatear fecha para mostrarla en el perfil
  const formattedJoinDate = profileUser?.createdAt 
    ? format(profileUser.createdAt.toDate(), 'MMMM yyyy', { locale: es })
    : '';
  
  if (loading) {
    return (
      <MainLayout>
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-500">Cargando perfil...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!profileUser) {
    return (
      <MainLayout>
        <div className="py-8 text-center">
          <p className="text-red-500">No se pudo cargar el perfil. Por favor, intenta de nuevo.</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Portada y foto de perfil */}
      <div className="relative">
        <div className="h-48 bg-primary-100 dark:bg-primary-900/20">
          {profileUser.coverPhotoURL && (
            <img 
              src={profileUser.coverPhotoURL} 
              alt="Portada" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="absolute -bottom-16 left-4">
          <Avatar 
            src={profileUser.photoURL} 
            alt={profileUser.displayName} 
            size="xl"
            className="border-4 border-white dark:border-gray-900"
          />
        </div>
        
        <div className="absolute top-4 right-4">
          {isCurrentUserProfile ? (
            <Button
              variant="outline"
              onClick={() => navigate('/settings')}
            >
              Editar perfil
            </Button>
          ) : (
            <Button
              variant={isFollowing ? 'outline' : 'primary'}
              onClick={handleFollowToggle}
            >
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Información de perfil */}
      <div className="mt-20 px-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {profileUser.displayName}
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
          @{profileUser.username}
        </p>
        
        {profileUser.bio && (
          <p className="mt-3 text-gray-800 dark:text-gray-200">
            {profileUser.bio}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>Se unió en {formattedJoinDate}</span>
          </div>
          
          {profileUser && 'location' in profileUser && (profileUser.location as string) && (
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{profileUser.location as string}</span>
            </div>
          )}
          
          {profileUser && 'website' in profileUser && (profileUser.website as string) && (
            <div className="flex items-center">
              <LinkIcon className="w-4 h-4 mr-1" />
              <a 
                href={profileUser.website as string} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {(profileUser.website as string).replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-5 mt-4 text-sm">
          <div>
            <span className="font-bold text-gray-900 dark:text-white">{profileUser.following?.length || 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Siguiendo</span>
          </div>
          
          <div>
            <span className="font-bold text-gray-900 dark:text-white">{profileUser.followers?.length || 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Seguidores</span>
          </div>
        </div>
      </div>
      
      {/* Pestañas de contenido */}
      <div className="border-b border-gray-200 dark:border-gray-700 mt-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 flex-1 text-center ${
              activeTab === 'posts'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            Posts
          </button>
          
          <button
            onClick={() => setActiveTab('replies')}
            className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 flex-1 text-center ${
              activeTab === 'replies'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            Respuestas
          </button>
          
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 flex-1 text-center ${
              activeTab === 'media'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            Media
          </button>
        </nav>
      </div>
      
      {/* Lista de posts */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            {activeTab === 'posts' 
              ? 'Este usuario aún no ha publicado nada.'
              : activeTab === 'replies'
                ? 'Este usuario aún no ha respondido a ningún post.'
                : 'Este usuario aún no ha publicado contenido con imágenes.'}
          </div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={() => {}} 
              onComment={() => {}}
              onRepost={() => {}}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}; 