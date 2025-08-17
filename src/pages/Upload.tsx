import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload as UploadIcon, 
  Video, 
  Image, 
  X, 
  Play,
  Eye,
  EyeOff,
  Save,
  Trash2,
  FileVideo,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { uploadVideo } from '../services/requestFunctions';

const Upload: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {user} = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    visibility: 'public',
    tags: '',
    allowComments: true,
    allowRatings: true,
  });

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Gaming',
    'Music', 
    'Technology',
    'Education',
    'Sports',
    'Entertainment',
    'News',
    'Movie',
    'Science',
    'Cooking',
    'Travel'
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Anyone can search for and view' },
    { value: 'unlisted', label: 'Unlisted', description: 'Anyone with the link can view' },
    { value: 'private', label: 'Private', description: 'Only you can view' },
  ];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!videoFile || !formData.title || !formData.category) {
      alert('Please fill in all required fields and select a video file.');
      return;
    }
  
    const uploadData = new FormData();
    uploadData.append("video", videoFile);
    if (thumbnailFile) uploadData.append("thumbnail", thumbnailFile);
    uploadData.append("title", formData.title);
    uploadData.append("category", formData.category);
    uploadData.append("description", formData.description);
    uploadData.append("tags", formData.tags);
    if (user?.channel) uploadData.append("channelId", user.channel.id.toString());
  
    setIsUploading(true);
    setUploadProgress(0);
  
    try {
      const response = await uploadVideo(uploadData, (progressEvent) => {
        const total = progressEvent.total || 1; // avoid divide-by-zero
        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
        setUploadProgress(percentCompleted);
      });
  
      setIsUploading(false);
      alert('Video uploaded successfully!');
  
      // Reset the form
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview('');
      setThumbnailPreview('');
      setFormData({
        title: '',
        description: '',
        category: '',
        visibility: 'public',
        tags: '',
        allowComments: true,
        allowRatings: true,
      });
  
    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
      alert("Something went wrong during upload.");
    }
  };
  

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
          <p className="text-gray-400">Share your content with the RyoTube community</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Left Column - Video Upload & Preview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Video Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Video size={24} className="mr-2" />
                  Video File *
                </h2>
                
                {!videoFile ? (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <UploadIcon size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Click to upload video</p>
                    <p className="text-gray-400 text-sm">MP4, MOV, AVI up to 2GB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full aspect-video bg-black rounded-lg"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X size={16} />
                    </motion.button>
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <FileVideo size={16} className="mr-2" />
                      {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  </div>
                )}
                
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </motion.div>

              {/* Thumbnail Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Image size={24} className="mr-2" />
                  Custom Thumbnail (Optional)
                </h2>
                
                {!thumbnailFile ? (
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <Image size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-medium mb-1">Upload thumbnail</p>
                    <p className="text-gray-400 text-sm">JPG, PNG up to 2MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                )}
                
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </motion.div>
            </div>

            {/* Right Column - Video Details */}
            <div className="space-y-6">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <label className="block text-white font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter video title"
                  maxLength={100}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {formData.title.length}/100
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <label className="block text-white font-medium mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell viewers about your video"
                  rows={4}
                  maxLength={5000}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {formData.description.length}/5000
                </div>
              </motion.div>

              {/* Category */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <label className="block text-white font-medium mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Visibility */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <label className="block text-white font-medium mb-4">
                  Visibility
                </label>
                <div className="space-y-3">
                  {visibilityOptions.map((option) => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={formData.visibility === option.value}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-white font-medium">{option.label}</div>
                        <div className="text-gray-400 text-sm">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <label className="block text-white font-medium mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Add tags separated by commas"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Help people find your video with relevant tags
                </p>
              </motion.div>

              {/* Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <h3 className="text-white font-medium mb-4">Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowComments"
                      checked={formData.allowComments}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Allow comments</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowRatings"
                      checked={formData.allowRatings}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Allow ratings</span>
                  </label>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Uploading...</span>
                <span className="text-blue-500">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-end space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Save as Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isUploading || !videoFile || !formData.title || !formData.category}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <UploadIcon size={20} />
              <span>{isUploading ? 'Uploading...' : 'Upload Video'}</span>
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Upload;