import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MoreVertical, CheckCircle } from 'lucide-react';
import { Video } from '../../Commons/userData';
import { useAuth } from '../auth/AuthContext';
import { getVideoChannelPic } from '../../services/requestFunctions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';


interface VideoCardProps {
  video: Video;
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index }) => {
  const {user} = useAuth();
  const [videoChannelPic , setVideoChannelPic] = useState<string>();
  const [videoDuration,setVideoDueration] = useState<string>();
  useEffect( () => {
    const getVideoData = async() => {
      const response = await getVideoChannelPic(video.channelId);
      if(response){
        setVideoChannelPic(response);
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        console.log(video.uploadDateTime)
        const timeAgo = dayjs.utc(video.uploadDateTime).local().fromNow();
        console.log(timeAgo)
        setVideoDueration(timeAgo);
      }
    }
    getVideoData();
  } )
  // const videoChannel:
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <Link to={`/watch/${video.id}`}>
        <div className="relative mb-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
          >
            <img
              src={video.videoThumbnail}
              alt={video.tile}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
          </motion.div>
        </div>
        
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <img
              src={videoChannelPic}
              alt={video.videoChannelName}
              className="w-9 h-9 rounded-full object-cover md:block hidden"
            />
          </div>
          
          <div className="flex-1 min-w-0 md:ml-0 ml-0">
            <div className="flex items-start space-x-3 md:hidden mb-2">
              <img
                src={videoChannelPic}
                alt={user?.channel?.channelName}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <span className="hover:text-gray-200 cursor-pointer">
                  {video.videoChannelName}
                </span>
                {user?.channel?.verified && (
                  <CheckCircle size={12} className="text-gray-400" />
                )}
              </div>
            </div>
            
            <h3 className="text-white font-medium text-sm leading-5 mb-1 line-clamp-2 group-hover:text-gray-200">
              {video.tile}
            </h3>
            
            <div className="flex items-center space-x-1 text-gray-400 text-xs mb-1 md:block hidden">
              <span className="hover:text-gray-200 cursor-pointer">
                {video.videoChannelName}
              </span>
              {user?.channel?.verified && (
                <CheckCircle size={12} className="text-gray-400" />
              )}
            </div>
            
            <div className="text-gray-400 text-xs">
              <span>{video.views} views</span>
              <span className="mx-1">•</span>
              <span>{videoDuration}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default VideoCard;