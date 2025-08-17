import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Trash2, Eye, EyeOff } from 'lucide-react';
import VideoCard from '../components/video/VideoCard';
import { mockVideos } from '../data/mockData';
import { GroupedVideos, Video } from '../Commons/userData';
import { useAuth } from '../components/auth/AuthContext';
import { getChannelHistory } from '../services/requestFunctions';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

const History: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [historyPaused, setHistoryPaused] = useState(false);
  const [grouped,setGrouped] = useState<GroupedVideos | null>();
  const {user} = useAuth();
  dayjs.extend(isSameOrAfter);


  useEffect(() => {
    const getHistoryData = async() => {
      if(user?.channel){
        const response  = await getChannelHistory(user.channel.id);
        if(response) setGrouped(groupVideosByDate(response));
      }
    };
    getHistoryData();
  },[])

  const groupedHistory = {
    Today: mockVideos.slice(0, 3),
    Yesterday: mockVideos.slice(3, 6),
    'Earlier this week': mockVideos.slice(6, 9),
  };


  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      // Clear history logic here
      console.log('History cleared');
    }
  };
  const groupVideosByDate = (videos: Video[]): GroupedVideos => {
    const today = dayjs();
    const yesterday = today.subtract(1, "day");
    const weekStart = today.startOf("week");
    const monthStart = today.startOf("month");
  
    const groups: GroupedVideos = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: []
    };
  
    videos.forEach((video) => {
      const uploadDate = dayjs(video.uploadDateTime);
      if (uploadDate.isSame(today, "day")) {
        groups.today.push(video);
      } else if (uploadDate.isSame(yesterday, "day")) {
        groups.yesterday.push(video);
      } else if (uploadDate.isSameOrAfter(weekStart, "day")) {
        groups.thisWeek.push(video);
      } else if (uploadDate.isSameOrAfter(monthStart, "day")) {
        groups.thisMonth.push(video);
      } else {
        groups.older.push(video);
      }
    });
  
    return groups;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Watch History</h1>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHistoryPaused(!historyPaused)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                historyPaused 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {historyPaused ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>{historyPaused ? 'Resume' : 'Pause'} History</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearHistory}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              <span>Clear History</span>
            </motion.button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search watch history"
              className="w-full h-10 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* History Content */}
        {historyPaused ? (
          <div className="text-center py-12">
            <EyeOff size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Watch history is paused</h3>
            <p className="text-gray-400 mb-4">Turn on watch history to help improve your recommendations</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHistoryPaused(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Turn On History
            </motion.button>
          </div>
        ) : grouped && grouped === null ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try different keywords or check your search filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped && grouped.today.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Today</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {grouped.today.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
              </div>
            )}
        
            {grouped && grouped.yesterday.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Yesterday</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {grouped.yesterday.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
              </div>
            )}
        
            {grouped && grouped.thisWeek.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">This Week</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {grouped.thisWeek.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
              </div>
            )}
        
            {grouped && grouped.thisMonth.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">This Month</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {grouped.thisMonth.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
              </div>
            )}
        
            {grouped && grouped.older.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Older</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {grouped.older.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
            )}
          </div>
        </div>
  );
};

export default History;