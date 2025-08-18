import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoCard from '../components/video/VideoCard';
import { mockVideos, categories } from '../data/mockData';
import { cn } from '../utils/cn';
import { getAllVideos } from '../services/requestFunctions';
import { Video } from '../Commons/userData';
import { useAuth } from '../components/auth/AuthContext';

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState<Video[] | null>([]);


  useEffect(() => {
    // Simulate filtering videos by category
    if(selectedCategory === 'All') {
      const getData = async() =>{
        const response = await getAllVideos();
        // console.log(response)
        setVideos(response);
      }
      getData();
    } else {
      // In a real app, this would filter based on actual categories
      // setVideos(mockVideos.slice(0, 4));
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Category Pills */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 z-10">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                selectedCategory === category
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              )}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {videos && videos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </motion.div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors mb-4"
          >
            Load More Videos
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Home;