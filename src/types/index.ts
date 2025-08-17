export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  views: string;
  timestamp: string;
  duration: string;
  description?: string;
}

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  subscribers: string;
  videos: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscribers: string;
  subscriptions: string[];
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'subscribe' | 'upload';
  message: string;
  timestamp: string;
  read: boolean;
  thumbnail?: string;
}