import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Play, 
  Users, 
  History, 
  Clock, 
  ThumbsUp, 
  Download, 
  User,
  Settings,
  HelpCircle,
  Flag
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getSubscriptions } from '../../services/requestFunctions';
import { useAuth } from '../auth/AuthContext';
import { SubscriptionElement } from '../../Commons/userData';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const {user} = useAuth();
  const [subscriptions,setSubscriptions] = useState<SubscriptionElement[] | null>(); 
  useEffect(() => {
    const getSubscriptionsData = async() => {
      if(user?.channel){
        const response:SubscriptionElement[] | null = await getSubscriptions(user?.channel?.id);
        console.log(response)
        setSubscriptions(response);
      }
    }
    getSubscriptionsData();
  },[])

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Play, label: 'Shorts', path: '/shorts' },
    { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
  ];

  const libraryItems = [
    { icon: History, label: 'History', path: '/history' },
    { icon: Clock, label: 'Watch Later', path: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/liked' },
    { icon: Download, label: 'Downloads', path: '/downloads' },
  ];

  const settingsItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: Flag, label: 'Report History', path: '/report' },
  ];

  const sidebarVariants = {
    open: {
      width: '240px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      width: '72px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      className="fixed left-0 top-16 bottom-0 bg-gray-900 border-r border-gray-800 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 z-40 md:block hidden"
    >
      <div className="py-4">
        {/* Main Menu */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={cn(
                'flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors',
                location.pathname === item.path && 'bg-gray-800 text-white'
              )}
            >
              <item.icon size={20} />
              {isOpen && <span className="ml-6 text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {isOpen && (
          <>
            <hr className="border-gray-800 my-4" />

            {/* Library */}
            <div className="px-4 py-2">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Library</h3>
              <nav className="space-y-1">
                {libraryItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={cn(
                      'flex items-center px-0 py-2 text-gray-300 hover:bg-gray-800 transition-colors rounded',
                      location.pathname === item.path && 'bg-gray-800 text-white'
                    )}
                  >
                    <item.icon size={18} />
                    <span className="ml-6 text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <hr className="border-gray-800 my-4" />

            {/* Subscriptions */}
            <div className="px-4 py-2">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Subscriptions</h3>
              <nav className="space-y-1">
                {subscriptions && subscriptions.map((sub, index) => (
                  <Link
                    key={index}
                    to={`/channel/${sub.channelId}`}
                    className="flex items-center px-0 py-2 text-gray-300 hover:bg-gray-800 transition-colors rounded"
                  >
                    <div className="relative">
                      <img
                        src={sub.channelPicURL}
                        alt={sub.channelName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </div>
                    <span className="ml-3 text-sm truncate">{sub.channelName}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <hr className="border-gray-800 my-4" />

            {/* Settings */}
            <div className="px-4 py-2">
              <nav className="space-y-1">
                {settingsItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={cn(
                      'flex items-center px-0 py-2 text-gray-300 hover:bg-gray-800 transition-colors rounded',
                      location.pathname === item.path && 'bg-gray-800 text-white'
                    )}
                  >
                    <item.icon size={18} />
                    <span className="ml-6 text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;