import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Play, Plus, Users, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Play, label: 'Shorts', path: '/shorts' },
    { icon: Plus, label: 'Create', path: '/upload' },
    { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
    { icon: User, label: 'You', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={cn(
              'flex flex-col items-center py-2 px-3 min-w-0 flex-1',
              location.pathname === item.path ? 'text-white' : 'text-gray-400'
            )}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <item.icon size={20} />
              <span className="text-xs mt-1 truncate">{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;