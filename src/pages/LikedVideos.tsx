import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Play, Share, Download, MoreVertical, CheckCircle, Lock } from 'lucide-react';
import VideoCard from '../components/video/VideoCard';
import { getLikedVideos } from '../services/requestFunctions';
import { useAuth } from '../components/auth/AuthContext';
import { Video } from '../Commons/userData';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';

const LikedVideos: React.FC = () => {
  const [likedVideos, setLikedVideos] = useState<Video[] | null>();
  const [isPrivate, setIsPrivate] = useState(true);
  const [sortBy, setSortBy] = useState('date_liked');
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getLikedVideosData = async() => {
      if(user?.channel){
        const response = await getLikedVideos(user.channel.id);
        setLikedVideos(response);
      }
    }
    getLikedVideosData();
  },[]);

  const removeLike = async(videoId:number) => {

  }
  const getVideoUploadDate = (video:Video):string => {
    dayjs.extend(relativeTime);
    const timeAgo = dayjs(video.uploadDateTime).fromNow()
    return timeAgo;
  }

 
  const sortOptions = [
    { value: 'date_liked', label: 'Date liked (newest)' },
    { value: 'date_liked_oldest', label: 'Date liked (oldest)' },
    { value: 'date_published', label: 'Date published' },
    { value: 'most_popular', label: 'Most popular' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <ThumbsUp size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Liked videos</h1>
              <div className="flex items-center space-x-2 text-gray-400">
                <span>{likedVideos ? likedVideos.length : 0} videos</span>
                {isPrivate && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Lock size={14} />
                      <span>Private</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {likedVideos && likedVideos.length > 0 && (
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Privacy:</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isPrivate 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Lock size={14} />
                  <span>{isPrivate ? 'Private' : 'Public'}</span>
                </motion.button>
              </div>

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
            </div>
          </div>
        </div>

        {/* Content */}
        {likedVideos && likedVideos.length === 0 ? (
          <div className="text-center py-16">
            <ThumbsUp size={64} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No liked videos yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Videos that you like will appear here. Start exploring and like videos you enjoy!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Discover videos
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {likedVideos &&  likedVideos.map((video, index) => (
              <motion.div
                key={video.id}
                onClick={() => navigate(`/watch/${video.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors group"
              >
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
                    {video.videoChannelName && (
                      <CheckCircle size={12} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2">
                    <span>{video.views} views</span>
                    <span className="mx-2">•</span>
                    <span>{video.duration}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p className='whitespace-pre-line'>{getVideoUploadDate(video)}</p>
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
                    onClick={() => removeLike(video.id)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    title="Remove like"
                  >
                    <ThumbsUp size={16} className="text-blue-500 fill-current" />
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

        {/* Privacy Notice */}
        {isPrivate && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-start space-x-3">
              <Lock size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-medium mb-1">This playlist is private</h4>
                <p className="text-gray-400 text-sm">
                  Only you can see this playlist. To share it with others, you can change the privacy setting to public.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedVideos;