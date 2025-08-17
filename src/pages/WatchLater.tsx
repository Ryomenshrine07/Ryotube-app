import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Trash2, Share, Download, MoreVertical, CheckCircle } from 'lucide-react';
import VideoCard from '../components/video/VideoCard';
import { mockVideos } from '../data/mockData';
import { Video } from '../Commons/userData';
import { getWatchLaterVideos } from '../services/requestFunctions';
import { useAuth } from '../components/auth/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const WatchLater: React.FC = () => {
  const [watchLaterVideos, setWatchLaterVideos] = useState<Video[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<Video[]>([]);
  const [sortBy, setSortBy] = useState('added');
  const {user} = useAuth();

  useEffect( () => {
    const getWatchLaterData = async() => {
      if(user && user.channel){
        const response = await getWatchLaterVideos(user.channel.id);
        setWatchLaterVideos(response);
      }
    }
    getWatchLaterData();
  },[])

  const removeFromWatchLater = (videoId: string) => {
    setWatchLaterVideos(prev => prev.filter(video => video.id !== +videoId));
    setSelectedVideos(prev => {
      const newArray: Video[] = [...prev];
      const updatedArray = newArray.filter(v => v.id !== +videoId);
      return updatedArray;
    });
  };

  const toggleVideoSelection = (video: Video) => {
    setSelectedVideos(prev => {
      const exists = prev.some(v => v.id === video.id);
      if(exists){
        return prev.filter(v => v.id !== video.id);
      }else{
        return [...prev, video];
      }
    });
  };

  const removeSelectedVideos = () => {
    setWatchLaterVideos(prev => 
      prev.filter(video => !selectedVideos.some(sel => sel.id === video.id))
    );
    setSelectedVideos([]);
  };

  const clearAllVideos = () => {
    if (window.confirm('Are you sure you want to remove all videos from Watch Later?')) {
      setWatchLaterVideos([]);
      setSelectedVideos([]); 
    }
  };
  const getVideoUploadDateTime = (uploadDateTime:string) => {
    dayjs.extend(relativeTime);
    const timeAgo = dayjs(uploadDateTime).fromNow();
    return timeAgo;
  }

  const sortOptions = [
    { value: 'added', label: 'Date added (newest)' },
    { value: 'added_oldest', label: 'Date added (oldest)' },
    { value: 'popular', label: 'Most popular' },
    { value: 'duration', label: 'Duration' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Watch Later</h1>
              <p className="text-gray-400">{watchLaterVideos.length} videos</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {watchLaterVideos.length > 0 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Play size={20} />
                    <span>Play all</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Share size={16} />
                    <span>Share</span>
                  </motion.button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {selectedVideos.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {selectedVideos.length} selected
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={removeSelectedVideos}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </motion.button>
                </div>
              )}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {watchLaterVideos.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllVideos}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Clear all</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {watchLaterVideos.length === 0 ? (
          <div className="text-center py-16">
            <Clock size={64} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No videos saved</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Save videos to watch them later. Click the "Save" button on any video to add it here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse videos
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {watchLaterVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors group"
              >
                {/* Checkbox */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleVideoSelection(video)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedVideos.some(v => v.id.toString() === video.id.toString())
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {selectedVideos.some(v => v.id.toString() === video.id.toString()) && (
                    <CheckCircle size={12} className="text-white" />
                  )}
                </motion.button>

                {/* Video Thumbnail */}
                <div className="relative w-40 aspect-video bg-gray-700 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={video.videoThumbnail}
                    alt={video.tile}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <Play size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1 line-clamp-2 hover:text-gray-300 cursor-pointer">
                    {video.tile}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                    <span className="hover:text-gray-300 cursor-pointer">
                      {video.videoChannelName}
                    </span>
                    {video && (
                      <CheckCircle size={12} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <span>{video.views} views</span>
                    <span className="mx-2">•</span>
                    <span>{getVideoUploadDateTime(video.uploadDateTime)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromWatchLater(video.id.toString())}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    title="Remove from Watch Later"
                  >
                    <Trash2 size={16} className="text-gray-400" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Download size={16} className="text-gray-400" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <MoreVertical size={16} className="text-gray-400" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLater;