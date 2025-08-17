import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  Mic, 
  VideoIcon, 
  Bell, 
  User,
  Settings,
  LogOut,
  Cast,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../auth/AuthContext';
import AuthModal from '../auth/AuthModal';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };
  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 h-16"
    >
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="md:hidden absolute inset-0 bg-gray-900 flex items-center px-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMobileSearch(false)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors mr-2"
          >
            <X size={20} className="text-white" />
          </motion.button>
          
          <form onSubmit={handleSearch} className="flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 h-10 px-4 bg-gray-800 border border-gray-700 rounded-l-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="h-10 px-4 bg-gray-700 border border-gray-700 rounded-r-full hover:bg-gray-600 transition-colors"
            >
              <Search size={18} className="text-gray-300" />
            </motion.button>
          </form>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            className="ml-2 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Mic size={18} className="text-gray-300" />
          </motion.button>
        </div>
      )}

      <div className={cn(
        "flex items-center justify-between h-full px-4",
        showMobileSearch && "md:flex hidden"
      )}>
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors md:block hidden"
          >
            <Menu size={20} className="text-white" />
          </motion.button>
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <VideoIcon size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white sm:block hidden">RyoTube</span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-8 md:block hidden">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full h-10 px-4 bg-gray-800 border border-gray-700 rounded-l-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="h-10 px-6 bg-gray-700 border border-gray-700 rounded-r-full hover:bg-gray-600 transition-colors"
            >
              <Search size={18} className="text-gray-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="ml-2 p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <Mic size={18} className="text-gray-300" />
            </motion.button>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Mobile Search Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMobileSearch(true)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors md:hidden"
          >
            <Search size={20} className="text-gray-300" />
          </motion.button>

          {/* Cast Button - Mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors md:hidden"
          >
            <Cast size={20} className="text-gray-300" />
          </motion.button>

          {isAuthenticated && (
            <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors md:block hidden"
              title="Upload video"
            >
              <VideoIcon size={20} className="text-gray-300" />
            </motion.button>
          </Link>
          )}
          
          {isAuthenticated && (
            <Link to="/notifications">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors relative"
              >
                <Bell size={20} className="text-gray-300" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center md:block hidden">
                  3
                </span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full md:hidden"></span>
              </motion.button>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
              >
                <img
                  src={user?.channel?.channelPicURL || "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </motion.button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white font-medium">{user?.username}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={18} className="text-gray-300" />
                    <span className="text-white">Your Channel</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={18} className="text-gray-300" />
                    <span className="text-white">Settings</span>
                  </Link>
                  <hr className="border-gray-700 my-2" />
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors w-full text-left"
                  >
                    <LogOut size={18} className="text-gray-300" />
                    <span className="text-white">Sign Out</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </motion.header>
  );
};

export default Header;