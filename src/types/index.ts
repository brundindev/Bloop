import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  username?: string;
  bio?: string;
  coverPhotoURL?: string;
  followers?: string[];
  following?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL: string;
  likes: string[];
  comments: number;
  reposts: number;
  images?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  parentId?: string; // Para respuestas/comentarios
  isRepost?: boolean;
  originalPostId?: string; // Para reposts
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL: string;
  likes: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderPhotoURL: string;
  type: 'like' | 'comment' | 'follow' | 'repost';
  postId?: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
} 