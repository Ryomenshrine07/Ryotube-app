import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Share, Play, Pencil } from 'lucide-react';
import VideoCard from '../components/video/VideoCard';
import { useAuth } from '../components/auth/AuthContext';
import { getAllChannelVideos, setChannelAbout, setChannelBanner, setChannelProfile } from '../services/requestFunctions';
import { Video } from '../Commons/userData';
import ProfilePicModal from '../components/Modals/ProfilePicModal';
import BannerModal from '../components/Modals/BannerModal';
import AboutModal from '../components/Modals/AboutModal';
import { Form } from 'react-router-dom';


const Profile: React.FC = () => {
  const [userVideos,setUserVideos] = useState<Video[] | null>([]);
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [profilePic, setProfilePic] = useState("/default-pic.jpg");
  const [banner, setBanner] = useState(user?.channel?.banner.bannerPicUrl || "https://wallpapers.com/images/featured/aesthetic-youtube-banner-background-fg0sm3sfskojcx7w.jpg");
  const [bannerHead, setBannerHead] = useState(user?.channel?.banner.bannerHead || "");
  const [bannerDesc, setBannerDesc] = useState(user?.channel?.banner.bannerDescription || "");
  const [aboutDesc, setAboutDesc] = useState(user?.channel?.channelDescription ||  "");
  const [aboutLinks, setAboutLinks] = useState({
    website: "https://example.com",
    twitter: "https://twitter.com/example",
    github: "https://github.com/example",
  });
    // Modal states
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);


  
  useEffect(() => {
    if(user?.channel) setUserVideos(user?.channel?.videos);

})

  const tabs = [
    { id: 'videos', label: 'Videos', count: userVideos == null ? 0 : userVideos.length },
    { id: 'shorts', label: 'Shorts', count: 0 },
    { id: 'about', label: 'About', count: null },
  ];



  // console.log(user);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Channel Header */}
      <div className="relative">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <img src={`${banner ? banner : "https://wallpapers.com/images/featured/aesthetic-youtube-banner-background-fg0sm3sfskojcx7w.jpg"}`} alt="Banner" className="absolute w-full h-48 object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-white text-center"
            >
              <h1 className="text-4xl font-bold mb-2">{user?.channel?.banner.bannerHead}</h1>
              <p className="text-lg opacity-90">{user?.channel?.banner.bannerDescription}</p>
            </motion.div>
            <button
          className="absolute top-3 right-3 bg-black/50 p-2 rounded-full hover:bg-black/70"
          onClick={() => setShowBannerModal(true)}
        >
          <Pencil size={18} />
        </button>
          </div>
        </div>

        {/* Channel Info */}
        <div className="bg-gray-900 px-6 py-4">
          <div className="flex items-start space-x-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative -mt-12"
            >
              <img
                src={user?.channel?.channelPicURL}
                alt={user?.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-900"
              />
              <button
              className="absolute bottom-1 right-1 bg-black/50 p-2 rounded-full hover:bg-black/70"
              onClick={() => setShowProfilePicModal(true)}
            >
              <Pencil size={18} />
            </button>
            </motion.div>
            
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-white">{user?.channel?.channelName}</h2>
                <CheckCircle size={20} className="text-blue-500" />
              </div>
              
              <div className="text-gray-400 text-sm mb-2">
                <span>{user?.channel?.subscribersCount} subscribers</span>
                <span className="mx-2">•</span>
                <span>{userVideos == null ? 0 : userVideos.length}</span>
                <span className='mx-2'>Videos</span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 max-w-2xl">
                {user?.channel?.channelDescription}
              </p>
              
              <div className="flex items-center gap-2 sm:space-x-4">
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isSubscribed
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </motion.button> */}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <Share size={16} />
                  <span>Share</span>
                </motion.button>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="px-6">
          <div className="flex space-x-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.count != null && tab.count >= 0 && tab.label != 'About' && (
                  <span className="ml-2 text-xs bg-gray-800 px-2 py-1 rounded">
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'videos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Videos</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Sort by</span>
                <select className="bg-gray-800 text-white text-sm border border-gray-700 rounded px-2 py-1">
                  <option>Latest</option>
                  <option>Popular</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {userVideos && userVideos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))}
            </motion.div>
          </div>
        )}

        {activeTab === 'shorts' && (
          <div className="text-center py-12">
            <Play size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No shorts yet</h3>
            <p className="text-gray-400">Start creating short videos to engage with your audience!</p>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No playlists yet</h3>
            <p className="text-gray-400">Create playlists to organize your videos!</p>
          </div>
        )}

        {activeTab === 'about' && (
          
          <div className="max-w-4xl">
          
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              
              <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
              <p className="tex-gray-300 mb-4">
                {user?.channel?.channelDescription}
              </p>
              <p className="text-gray-300">
              
              </p>
              <button
          className="absolute right-3 bg-black/50 p-2 rounded-full hover:bg-black/70"
          onClick={() => setShowAboutModal(true)}
        >
          <Pencil size={18} />
        </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-3">Channel Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Joined</span>
                    <span className="text-white">{user?.channel?.channelStatus.joinedDate.slice(0,10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total views</span>
                    <span className="text-white">{user?.channel?.channelStatus.totalViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country</span>
                    <span className="text-white">{user?.channel?.channelStatus.country}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-3">Links</h4>
                <div className="space-y-2">
                  <a href={`${user?.channel?.websiteLink}`} className="block text-blue-400 hover:text-blue-300 transition-colors">
                    🌐 Website
                  </a>
                  <a href={`${user?.channel?.twitterLink}`} className="block text-blue-400 hover:text-blue-300 transition-colors">
                    🐦 Twitter
                  </a>
                  <a href={`${user?.channel?.gitHubLink}`} className="block text-blue-400 hover:text-blue-300 transition-colors">
                    💼 GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProfilePicModal
        isOpen={showProfilePicModal}
        onClose={() => setShowProfilePicModal(false)}
        currentPic={profilePic}
        onSave={async(file) => {
          const formData = new FormData();
          if(user?.channel) formData.append("channelId",user?.channel?.id.toString());
          formData.append("profile-pic",file);
          await setChannelProfile(formData);
        }}
      />
        <BannerModal
        isOpen={showBannerModal}
        onClose={() => setShowBannerModal(false)}
        currentBanner={banner}
        currentHead={bannerHead}
        currentDesc={bannerDesc}
        onSave={async({ file, head, desc }) => {
          // console.log("HEJRERE");
          const formData = new FormData();
          if(user?.channel) formData.append("channelId",user?.channel.id.toString());
          if(file) formData.append("banner-pic",file);
          formData.append("bannerHead",head);
          formData.append("bannerDesc",desc);
          await setChannelBanner(formData);
        }}
      />
       <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        currentDescription={aboutDesc}
        currentLinks={aboutLinks}
        onSave={async({ description, website, twitter, github }) => {
          const formData = new FormData();
          if(user?.channel) formData.append("channelId",user?.channel?.id.toString());
          formData.append("channelDesc",description);
          if(website) formData.append("website-link",website);
          if(twitter) formData.append("twitter-link",twitter);
          if(github) formData.append("github-link",github);
          await setChannelAbout(formData); 
        }}
      />
    </div>
  );
};

export default Profile;