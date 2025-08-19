import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Eye,
  Moon,
  Sun,
  Volume2,
  Wifi,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [darkMode, setDarkMode] = useState(true);
  const {user} = useAuth();
  const [notifications, setNotifications] = useState({
    comments: true,
    likes: true,
    subscriptions: true,
    uploads: false,
  });
  const navigate = useNavigate();

  const sections = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'playback', label: 'Playback', icon: Volume2 },
    { id: 'connected', label: 'Connected Apps', icon: Smartphone },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={`${user?.channel?.channelPicURL}`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-white font-medium">{user?.username}</h4>
                    <p className="text-gray-400">{user?.email}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Channel Settings</h3>
              <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{user?.channel?.channelName}</h4>
                    <p className="text-gray-400">Your channel display name</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Change
                  </motion.button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{user?.channel?.channelDescription}</h4>
                    <p className="text-gray-400">Tell viewers about your channel</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Edit
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium capitalize">{key}</h4>
                      <p className="text-gray-400">
                        Receive notifications for {key.toLowerCase()}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
              <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Watch History</h4>
                    <p className="text-gray-400">Save videos you watch</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/watch-later")}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Manage
                  </motion.button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Search History</h4>
                    <p className="text-gray-400">Save your search queries</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/history")}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Manage
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
              <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Theme</h4>
                    <p className="text-gray-400">Choose your preferred theme</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDarkMode(!darkMode)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                    <span>{darkMode ? 'Dark' : 'Light'}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <User size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 w-auto md:w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <section.icon size={20} />
              <span className="whitespace-nowrap">{section.label}</span>
            </motion.button>
          ))}
        </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSectionContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;