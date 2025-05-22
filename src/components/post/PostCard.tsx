import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ArrowPathRoundedSquareIcon, 
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import type { Post } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export const PostCard = ({ post, onLike, onRepost, onComment }: PostCardProps) => {
  const { currentUser } = useAuth();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const { loading, updateDocument, deleteDocument } = useFirestore<Post>('posts');
  
  const isLiked = currentUser ? post.likes.includes(currentUser.uid) : false;
  
  const formattedDate = post.createdAt 
    ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: es })
    : '';
  
  const handleLikeClick = async () => {
    if (!currentUser || loading) return;
    
    try {
      let updatedLikes = [...post.likes];
      
      if (isLiked) {
        updatedLikes = updatedLikes.filter(id => id !== currentUser.uid);
      } else {
        updatedLikes.push(currentUser.uid);
      }
      
      await updateDocument(post.id, { likes: updatedLikes });
      
      if (onLike) {
        onLike(post.id);
      }
    } catch (error) {
      console.error('Error al dar like al post:', error);
    }
  };
  
  const handleRepostClick = () => {
    if (onRepost) {
      onRepost(post.id);
    }
  };
  
  const handleCommentClick = () => {
    if (onComment) {
      onComment(post.id);
    }
  };
  
  const handleDeletePost = async () => {
    if (!currentUser || loading || currentUser.uid !== post.authorId) return;
    
    try {
      await deleteDocument(post.id);
      setIsOptionsOpen(false);
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700"
    >
      {post.isRepost && (
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <ArrowPathRoundedSquareIcon className="w-4 h-4 mr-2" />
          <span>Reposteado por {post.authorName}</span>
        </div>
      )}
      
      <div className="flex space-x-3">
        <Link to={`/profile/${post.authorId}`}>
          <Avatar src={post.authorPhotoURL} alt={post.authorName} />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to={`/profile/${post.authorId}`} className="text-sm font-medium text-gray-900 dark:text-white hover:underline">
                {post.authorName}
              </Link>
              <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
              <Link to={`/profile/${post.authorId}`} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
                @{post.authorUsername}
              </Link>
              <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formattedDate}
              </span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {isOptionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {currentUser && currentUser.uid === post.authorId && (
                      <button
                        onClick={handleDeletePost}
                        disabled={loading}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Eliminar post
                      </button>
                    )}
                    <button
                      onClick={() => setIsOptionsOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Reportar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <Link to={`/post/${post.id}`} className="block mt-2">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {post.content}
            </p>
            
            {post.images && post.images.length > 0 && (
              <div className={`mt-3 grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {post.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Post image ${index + 1}`}
                    className="rounded-lg w-full h-auto max-h-80 object-cover"
                  />
                ))}
              </div>
            )}
          </Link>
          
          <div className="mt-3 flex items-center justify-between max-w-md">
            <Button 
              variant="text" 
              size="sm"
              onClick={handleLikeClick}
              leftIcon={isLiked 
                ? <HeartIconSolid className="w-5 h-5 text-red-500" /> 
                : <HeartIcon className="w-5 h-5" />
              }
              className={isLiked ? 'text-red-500' : 'hover:text-red-500'}
            >
              {post.likes.length > 0 ? post.likes.length : ''}
            </Button>
            
            <Button 
              variant="text" 
              size="sm"
              onClick={handleCommentClick}
              leftIcon={<ChatBubbleLeftIcon className="w-5 h-5" />}
              className="hover:text-primary-500"
            >
              {post.comments > 0 ? post.comments : ''}
            </Button>
            
            <Button 
              variant="text" 
              size="sm"
              onClick={handleRepostClick}
              leftIcon={<ArrowPathRoundedSquareIcon className="w-5 h-5" />}
              className="hover:text-green-500"
            >
              {post.reposts > 0 ? post.reposts : ''}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 