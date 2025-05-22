import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackInitial?: string;
}

export const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  fallbackInitial
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false);
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-14 h-14 text-xl'
  };
  
  const handleError = () => {
    setImgError(true);
  };
  
  const initial = fallbackInitial || alt.charAt(0).toUpperCase();
  
  return (
    <div className={`relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {!imgError && src ? (
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleError}
        />
      ) : (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {initial}
        </span>
      )}
    </div>
  );
}; 