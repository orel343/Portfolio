export interface User {
  id: string;
  email: string;
  name: string;
  photoURL: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  category: string;
  status: 'in-progress' | 'completed' | 'planned';
  startDate: number;
  endDate?: number;
  features: string[];
  views: number;
  likes: number;
  createdAt: number;
}



export interface BlogPostContent {
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'link' | 'button';
  content: string;
  href?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: BlogPostContent[] | string;
  imageUrl: string;
  authorId: string;
  views: number;
  likes: number;
  likeProgress: number[];
  createdAt: number;
}

export interface Feedback {
  id: string;
  userId: string;
  content: string;
  rating: number;
  createdAt: number;
}

