import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';
import VideoCard from '../components/video/VideoCard';
import { mockVideos } from '../data/mockData';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState(mockVideos);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    // Simulate search filtering
    if (query) {
      const filtered = mockVideos.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.channel.name.toLowerCase().includes(query.toLowerCase()) ||
        video.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(mockVideos);
    }
  }, [query]);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'upload_date', label: 'Upload Date' },
    { value: 'view_count', label: 'View Count' },
    { value: 'rating', label: 'Rating' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'video', label: 'Video' },
    { value: 'channel', label: 'Channel' },
    { value: 'playlist', label: 'Playlist' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg text-white">
              {results.length} results for "{query}"
            </h1>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </motion.button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filter Bar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800 rounded-lg p-4 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                  >
                    {filterOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration
                  </label>
                  <select className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2">
                    <option>Any duration</option>
                    <option>Under 4 minutes</option>
                    <option>4-20 minutes</option>
                    <option>Over 20 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Date
                  </label>
                  <select className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2">
                    <option>Any time</option>
                    <option>Last hour</option>
                    <option>Today</option>
                    <option>This week</option>
                    <option>This month</option>
                    <option>This year</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Search Results */}
        {results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try different keywords or remove search filters</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {results.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {results.length > 0 && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Load More Results
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;