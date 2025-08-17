import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Play, 
  Pause, 
  Trash2, 
  MoreVertical, 
  CheckCircle, 
  Wifi, 
  WifiOff,
  HardDrive,
  Settings,
  Filter
} from 'lucide-react';
import { useDownloadStore } from '../components/auth/DownloadStore';

interface DownloadedVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  duration: string;
  fileSize: string;
  downloadDate: string;
  quality: string;
  progress: number;
  status: 'completed' | 'downloading' | 'paused' | 'failed';
}


const Downloads: React.FC = () => {
  // const [downloads, setDownloads] = useState(mockDownloads);
  const downloads = useDownloadStore(state => state.downloads);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const deleteDownload = (videoId: string) => {
    // setDownloads(prev => prev.filter(video => video.id !== videoId));
    // setSelectedVideos(prev => {
    //   const newSet = new Set(prev);
    //   newSet.delete(videoId);
    //   return newSet;
    // });
  };

  const deleteSelectedDownloads = () => {
    // if (window.confirm(`Delete ${selectedVideos.size} downloaded videos?`)) {
    //   setDownloads(prev => prev.filter(video => !selectedVideos.has(video.id)));
    //   setSelectedVideos(new Set());
    // }
  };

  const pauseDownload = (videoId: string) => {
    // setDownloads(prev => prev.map(video => 
    //   video.id === videoId 
    //     ? { ...video, status: video.status === 'downloading' ? 'paused' : 'downloading' as const }
    //     : video
    // ));
  };

  const getStatusIcon = (status: DownloadedVideo['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'downloading':
        return <Download size={16} className="text-blue-500 animate-pulse" />;
      case 'paused':
        return <Pause size={16} className="text-yellow-500" />;
      case 'failed':
        return <div className="w-4 h-4 bg-red-500 rounded-full" />;
      default:
        return null;
    }
  };
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const completedDownloads = downloads.filter(d => d.status === 'completed');
  const activeDownloads = downloads.filter(d => d.status === 'downloading');
  const totalSize = 0
  const sortOptions = [
    { value: 'recent', label: 'Recently downloaded' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'size', label: 'File size' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All downloads' },
    { value: 'completed', label: 'Completed' },
    { value: 'downloading', label: 'Downloading' },
    { value: 'paused', label: 'Paused' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Download size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Downloads</h1>
                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                  <span>{completedDownloads.length} videos</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <HardDrive size={14} />
                    <span>{totalSize.toFixed(1)} GB used</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isOfflineMode 
                    ? 'bg-orange-600 text-white hover:bg-orange-700' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {isOfflineMode ? <WifiOff size={16} /> : <Wifi size={16} />}
                <span>{isOfflineMode ? 'Offline Mode' : 'Online Mode'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Settings size={20} />
              </motion.button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {selectedVideos.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {selectedVideos.size} selected
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={deleteSelectedDownloads}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </motion.button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Downloads */}
        {activeDownloads.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Currently Downloading</h2>
            <div className="space-y-3">
              {activeDownloads.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-24 aspect-video bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-1 line-clamp-1">
                        {video.title}
                      </h3>
                      <div className="text-sm text-gray-400 mb-2">
                        {video.channelName}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${video.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {video.progress}% • {formatBytes(video.fileSize)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => pauseDownload(video.id.toString())}
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                          >
                            {video.status === 'downloading' ? (
                              <Pause size={16} className="text-gray-400" />
                            ) : (
                              <Play size={16} className="text-gray-400" />
                            )}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteDownload(video.id.toString())}
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                          >
                            <Trash2 size={16} className="text-gray-400" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Downloaded Videos */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Downloaded Videos</h2>
          
          {completedDownloads.length === 0 ? (
            <div className="text-center py-16">
              <Download size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No downloads yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Download videos to watch them offline. Look for the download button on any video.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse videos
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {completedDownloads.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors group"
                >
                  {/* Checkbox */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleVideoSelection(video.id.toString())}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedVideos.has(video.id.toString())
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {selectedVideos.has(video.id.toString()) && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </motion.button>

                  {/* Video Thumbnail */}
                  <div className="relative w-40 aspect-video bg-gray-700 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                      {video.videoDuration}
                    </div>
                    <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1 py-0.5 rounded flex items-center space-x-1">
                      <Download size={10} />
                      {/* <span>{video.quality}</span> */}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <Play size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-1 line-clamp-2 hover:text-gray-300 cursor-pointer">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                      <span className="hover:text-gray-300 cursor-pointer">
                        {video.channelName}
                      </span>
                      {video && (
                        <CheckCircle size={12} className="text-gray-400" />
                      )}
                    </div>
                    
                    {/* <div className="text-sm text-gray-400 mb-1">
                      <span>Downloaded {video.downloadDate}</span>
                    </div> */}
                    
                    <div className="text-sm text-gray-500">
                      <span>{formatBytes(video.fileSize)}</span>
                      <span className="mx-2">•</span>
                      {/* <span>{video.quality}</span> */}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteDownload(video.id.toString())}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                      title="Delete download"
                    >
                      <Trash2 size={16} className="text-gray-400" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HardDrive size={20} className="text-gray-400" />
              <div>
                <h4 className="text-white font-medium">Storage Usage</h4>
                <p className="text-gray-400 text-sm">
                  {totalSize.toFixed(1)} GB of downloads • {completedDownloads.length} videos
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Manage Storage
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;