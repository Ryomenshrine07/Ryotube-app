import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, CheckCircle } from 'lucide-react';
import VideoCard from '../components/video/VideoCard';
import { mockVideos, mockChannels } from '../data/mockData';
import { SubscriptionElement, Video } from '../Commons/userData';
import { getLatestVideos, getSubscriptions } from '../services/requestFunctions';
import { useAuth } from '../components/auth/AuthContext';
import { lastDayOfDecade } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Subscriptions: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [notifications, setNotifications] = useState<{[key: string]: boolean}>({});
  const [subscribedCh,setSubscribedCh] = useState<SubscriptionElement[] | null>();
  const [latestVideos,setLatestVideos] = useState<Video[] | null>();
  const navigate = useNavigate();
  const {user} = useAuth();
  useEffect(() => {
    const getSubsciptionData = async() => {
      if(user?.channel){
        const response = await getSubscriptions(user.channel.id);
        setSubscribedCh(response);
        const videos = await getLatestVideos(user.channel.id);
        setLatestVideos(videos);
      } 
    }
    getSubsciptionData();
  },[])

  const filters = ['All', 'Today', 'This Week', 'Unwatched', 'Live'];

  const toggleNotifications = (channelId: string) => {
    setNotifications(prev => ({
      ...prev,
      [channelId]: !prev[channelId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">Subscriptions</h1>
          
          {/* Filter Tabs */}
          <div className="flex space-x-4 border-b border-gray-800">
            {filters.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter)}
                className={`pb-2 px-1 text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Subscribed Channels */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Your Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscribedCh && subscribedCh.map((channel) => (
              <motion.div
                key={channel.channelId}
                onClick={() => navigate(`/channel/${channel.channelId}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={channel.channelPicURL}
                    alt={channel.channelName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium">{channel.channelName}</h3>
                      {(
                        <CheckCircle size={16} className="text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{channel.subscriberCount} subscribers</p>
                    <p className="text-xs text-gray-500">{channel.videosCount} videos</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleNotifications(channel.channelId.toString())}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    {notifications[channel.channelId] ? (
                      <Bell size={18} className="text-blue-500" />
                    ) : (
                      <BellOff size={18} className="text-gray-400" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Latest Videos */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Latest Videos</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {latestVideos && latestVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;