import { UserData, Video } from '../Commons/userData';
import {Channel, User, Comment, Notification } from '../types';


export const mockVideos: Video[] = [
  {
    id: 100,
    title: 'Building a Modern React App with TypeScript',
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channel: {
      name: 'Tech Tutorials',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: true,
    },
    views: '1.2M',
    timestamp: '2 hours ago',
    duration: '15:30',
    description: 'Learn how to build a modern React application with TypeScript from scratch.',
  },
  {
    id: 102,
    title: 'The Future of Web Development',
    thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channel: {
      name: 'Code Masters',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: true,
    },
    views: '890K',
    timestamp: '5 hours ago',
    duration: '22:45',
    description: 'Exploring the latest trends and technologies in web development.',
  },
  {
    id: 103,
    title: 'CSS Grid vs Flexbox - Complete Guide',
    thumbnail: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channel: {
      name: 'Design Pro',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: false,
    },
    views: '450K',
    timestamp: '1 day ago',
    duration: '18:12',
    description: 'Understanding when to use CSS Grid vs Flexbox for modern layouts.',
  },
  {
    id: 104,
    title: 'JavaScript Performance Optimization',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channel: {
      name: 'JS Ninja',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: true,
    },
    views: '2.1M',
    timestamp: '3 days ago',
    duration: '25:30',
    description: 'Advanced techniques for optimizing JavaScript performance.',
  },
  {
    id: 105,
    title: 'Node.js Backend Development',
    thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channel: {
      name: 'Backend Guru',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: true,
    },
    views: '1.8M',
    timestamp: '1 week ago',
    duration: '45:20',
    description: 'Complete guide to building scalable Node.js applications.',
  },
  {
    id: 106,
    title: 'Database Design Best Practices',
    thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    channel: {
      name: 'Data Science Hub',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: false,
    },
    views: 107,
    timestamp: '2 weeks ago',
    duration: '32:15',
    description: 'Essential principles for designing efficient database schemas.',
  },
];

export const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'Tech Tutorials',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    verified: true,
    subscribers: '1.2M',
    videos: 234,
  },
  {
    id: '2',
    name: 'Code Masters',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    verified: true,
    subscribers: '890K',
    videos: 156,
  },
];

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
  subscribers: '12.5K',
  subscriptions: ['1', '2'],
};

export const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      name: 'Alice Johnson',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    },
    text: 'Great tutorial! Really helped me understand the concepts.',
    timestamp: '2 hours ago',
    likes: 24,
  },
  {
    id: '2',
    user: {
      name: 'Bob Smith',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    },
    text: 'Could you make a follow-up video on advanced topics?',
    timestamp: '1 hour ago',
    likes: 12,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    message: 'Tech Tutorials liked your comment',
    timestamp: '2 hours ago',
    read: false,
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
  },
  {
    id: '2',
    type: 'subscribe',
    message: 'Code Masters subscribed to your channel',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '3',
    type: 'upload',
    message: 'JS Ninja uploaded a new video',
    timestamp: '2 days ago',
    read: true,
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
  },
];

export const categories = [
  'All',
  'Gaming',
  'Music',
  'Technology',
  'Education',
  'Sports',
  'Entertainment',
  'News',
  'Movies',
  'Science',
  'Cooking',
  'Travel',
];