import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Lock } from "lucide-react";

export default function MoreMenuButton({ videoId }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  const handleWatchLaterToggle = async () => {
    setIsWatchLater(!isWatchLater);
    // await handleWatchLater(videoId);
    setShowMenu(false); // close after selecting
  };

  return (
    <div className="relative inline-block">
      {/* More Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors hidden md:block"
      >
        <MoreHorizontal size={20} />
      </motion.button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 text-white rounded-lg shadow-lg p-3 z-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Save video to...</span>
            <button onClick={() => setShowMenu(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <div
            onClick={handleWatchLaterToggle}
            className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            <input type="checkbox" checked={isWatchLater} readOnly />
            <span>Watch Later</span>
            <Lock size={14} className="ml-auto" />
          </div>
        </div>
      )}
    </div>
  );
}

