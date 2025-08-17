import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreVertical, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface Short {
  id: string;
  title: string;
  video: string;
  thumbnail: string;
  channel: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  likes: string;
  comments: string;
  description: string;
}

const mockShorts: Short[] = [
  {
    id: '1',
    title: 'Amazing React Animation Tutorial',
    video: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=1',
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=1',
    channel: {
      name: 'Tech Tutorials',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: true,
    },
    likes: '12.5K',
    comments: '234',
    description: 'Learn how to create smooth animations in React with Framer Motion! #React #Animation #WebDev',
  },
  {
    id: '2',
    title: 'CSS Grid in 60 Seconds',
    video: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=1',
    thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=1',
    channel: {
      name: 'Code Masters',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: true,
    },
    likes: '8.9K',
    comments: '156',
    description: 'Master CSS Grid layout in just one minute! Perfect for beginners 🚀 #CSS #WebDesign #Tutorial',
  },
  {
    id: '3',
    title: 'JavaScript Tips & Tricks',
    video: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=1',
    thumbnail: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=1',
    channel: {
      name: 'JS Ninja',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      verified: false,
    },
    likes: '15.2K',
    comments: '89',
    description: 'Mind-blowing JavaScript tricks that will make you a better developer! 🔥 #JavaScript #Programming',
  },
];

const Shorts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedShorts, setLikedShorts] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentShort = mockShorts[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockShorts.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mockShorts.length) % mockShorts.length);
  };

  const toggleLike = (shortId: string) => {
    setLikedShorts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shortId)) {
        newSet.delete(shortId);
      } else {
        newSet.add(shortId);
      }
      return newSet;
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handlePrevious();
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleNext();
        break;
      case ' ':
        e.preventDefault();
        setIsPlaying(!isPlaying);
        break;
      case 'm':
        e.preventDefault();
        setIsMuted(!isMuted);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ paddingTop: '64px' }}>
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Main Short Video */}
        <div className="relative w-full max-w-md h-full bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentShort.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              {/* Video/Image */}
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat cursor-pointer"
                style={{ backgroundImage: `url(${currentShort.thumbnail})` }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {/* Play/Pause Overlay */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                    >
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play size={32} className="text-white ml-1" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Volume Control */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  {isMuted ? (
                    <VolumeX size={20} className="text-white" />
                  ) : (
                    <Volume2 size={20} className="text-white" />
                  )}
                </motion.button>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="flex items-end space-x-4">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src={currentShort.channel.avatar}
                        alt={currentShort.channel.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white font-medium text-sm">
                        {currentShort.channel.name}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-white text-black text-xs font-medium rounded-full"
                      >
                        Subscribe
                      </motion.button>
                    </div>
                    
                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                      {currentShort.title}
                    </h3>
                    
                    <p className="text-gray-300 text-xs line-clamp-2">
                      {currentShort.description}
                    </p>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col items-center space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleLike(currentShort.id)}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Heart 
                          size={24} 
                          className={`${
                            likedShorts.has(currentShort.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-white'
                          }`} 
                        />
                      </div>
                      <span className="text-white text-xs mt-1">{currentShort.likes}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <span className="text-white text-xs mt-1">{currentShort.comments}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Share size={24} className="text-white" />
                      </div>
                      <span className="text-white text-xs mt-1">Share</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm"
                    >
                      <MoreVertical size={24} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm"
              disabled={currentIndex === 0}
            >
              <ChevronUp size={24} className="text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm"
              disabled={currentIndex === mockShorts.length - 1}
            >
              <ChevronDown size={24} className="text-white" />
            </motion.button>
          </div>

          {/* Progress Indicator */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="flex flex-col space-y-2">
              {mockShorts.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-8 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shorts;