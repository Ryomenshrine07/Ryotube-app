import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Bell, 
  Share, 
  MoreHorizontal, 
  Play, 
  Eye, 
  Calendar,
  Globe,
  Github,
  Twitter,
  Users,
  VideoIcon,
  Clock
} from 'lucide-react';
import { ChannelData, UserData, Video } from '../Commons/userData';
import { useAuth } from '../components/auth/AuthContext';
import { checkIsSubcribed, getAllChannelVideos, getChannelById, getChannelVideosById, subscribeToChannelPage, unSubscribeToChannelPage } from '../services/requestFunctions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate, useParams } from 'react-router-dom';


interface ChannelPageProps{
    channelId:number
}

const ChannelPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  if(channelId == null) return;
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'about'>('videos');
  const [channel,setChannel] = useState<ChannelData>();
  const {user} = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [videos,setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();



  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
  
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2; // ~2s total fill
        });
      }, 40);
    }
  
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const checkIsSub = async() => {
        if(user && user.channel && channelId){
            const formData = new FormData();
            formData.append("channelId",user.channel?.id.toString());
            formData.append("subscribed-channelId",channelId);
            const isSub = await checkIsSubcribed(formData);
            if(isSub){
                setIsSubscribed(true);
              }else{
                setIsSubscribed(false);
              }
        }
    };
    const getChannelVideos = async() => {
        const reposne = await getChannelVideosById(+channelId);
        if(reposne){
            setVideos(reposne);
        }
    };
    const getUserByChannel = async() => {
        const data = await getChannelById(+channelId);
        setChannel(data);
    }
    setLoading(true);
    checkIsSub();
    getChannelVideos();
    getUserByChannel();
    setLoading(false);
  },[]);

  const handleSubscribe = async() => {
    console.log("HERER");
    const formData = new FormData();
    if(user?.channel) formData.append("userChannelId",user?.channel?.id.toString());
    formData.append("subChannelId",channelId);
    if(!isSubscribed){
      await subscribeToChannelPage(formData);
      setIsSubscribed(true);
    }else{
      await unSubscribeToChannelPage(formData);
      setIsSubscribed(false);
    }
  };
  const getUploadDateTime = (uploadDateTime:string) => {
    dayjs.extend(relativeTime);
    const timeAgo = dayjs(uploadDateTime).fromNow();
    return timeAgo
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="relative h-64 overflow-hidden"
        variants={itemVariants}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${channel?.banner.bannerPicUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </div>
        
        {/* Navigation */}
        <div className="relative z-10 p-6">
          <motion.button
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} 
          >
            <ArrowLeft size={24} />
            <span className="text-sm">Back</span>
          </motion.button>
        </div>

        {/* Channel Header Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-6">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <img
                src={channel?.channelPicURL}
                alt={channel?.channelName}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white/20 backdrop-blur-sm"
              />
              {user && (
                <motion.div
                  className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                >
                  <VideoIcon size={12} className="text-white" />
                </motion.div>
              )}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <motion.h1 
                className="text-lg sm:text-xl md:text-3xl font-bold mb-1"
                variants={itemVariants}
              >
                {channel?.channelName}
              </motion.h1>
              <motion.div 
                className="flex items-center gap-2 sm:gap-3 md:gap-4 text-gray-300 text-xs sm:text-sm md:text-base mb-2"
                variants={itemVariants}
              >
                {/* <span>{channel.handle}</span> */}
                <span>•</span>
                <span>{channel?.subscribersCount} subscribers</span>
                <span>•</span>
                <span>{channel?.videos?.length} videos</span>
              </motion.div>
            </div>
            </div>
            <div className='p-2'>
            <motion.div 
              className="flex items-center gap-3"
              variants={itemVariants}
            >
              <motion.button
                className={`px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full font-medium transition-all ${
                  isSubscribed 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
                onClick={handleSubscribe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <motion.span
                  key={isSubscribed ? 'subscribed' : 'subscribe'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </motion.span>
              </motion.button>

              <motion.button
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell size={20} />
              </motion.button>

              <motion.button
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share size={20} />
              </motion.button>

              <motion.button
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreHorizontal size={20} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <motion.div 
          className="border-b border-gray-700 mb-8"
          variants={itemVariants}
        >
          <div className="flex gap-8">
            {[
              { key: 'videos', label: 'Videos', count: channel?.videos?.length
               },
              { key: 'shorts', label: 'Shorts', count: '0' },
              { key: 'about', label: 'About' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                className={`pb-4 px-2 relative transition-colors ${
                  activeTab === tab.key ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab(tab.key as any)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-medium">{tab.label}</span>
                {tab.count && (
                  <span className="ml-2 text-sm text-gray-500">{tab.count}</span>
                )}
                
                {activeTab === tab.key && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Videos</h2>
                <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm">
                  <option>Latest</option>
                  <option>Popular</option>
                  <option>Oldest</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    onClick={() => navigate(`/watch/${video.id}`)}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <motion.img
                        src={video.videoThumbnail}
                        alt={video.tile}
                        className="w-full aspect-video object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      
                      <motion.div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                        whileHover={{ opacity: 1 }}
                      >
                        <motion.div
                          className="bg-red-600 rounded-full p-3"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play size={24} fill="white" />
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                        {video.tile}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Eye size={14} />
                        <span>{video.views} views</span>
                        <span>•</span>
                        <span>{getUploadDateTime(video.uploadDateTime)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'shorts' && (
            <motion.div
              key="shorts"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-16"
            >
              <VideoIcon size={48} className="mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-medium mb-2">No Shorts yet</h3>
              <p className="text-gray-400">This channel hasn't uploaded any Shorts.</p>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {channel?.channelDescription}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-400">Joined</span>
                      </div>
                      <span className="text-sm">Mar 15, 2019</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-400">Total views</span>
                      </div>
                      <span className="text-sm">{channel?.channelStatus.totalViews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-400">Country</span>
                      </div>
                      <span className="text-sm">{channel?.channelStatus.country}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Links</h3>
                  <div className="space-y-3">
                    {channel?.websiteLink && (
                      <motion.a
                        href={channel.websiteLink}
                        className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Globe size={16} />
                        <span className="text-sm">Website</span>
                      </motion.a>
                    )}
                    {channel?.twitterLink && (
                      <motion.a
                        href={channel?.twitterLink}
                        className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Twitter size={16} />
                        <span className="text-sm">Twitter</span>
                      </motion.a>
                    )}
                    {channel?.gitHubLink && (
                      <motion.a
                        href={channel?.gitHubLink}
                        className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Github size={16} />
                        <span className="text-sm">GitHub</span>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChannelPage;