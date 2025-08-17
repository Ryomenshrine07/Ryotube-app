import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  SkipForward,
  SkipBack
} from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  thumbnail: string;
  videoURL:string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, thumbnail, videoURL }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
        video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  
    const updateDuration = () => setDuration(video.duration);
  
    let animationFrameId: number;
  
    const updateTime = () => {
      setCurrentTime(video.currentTime);
      animationFrameId = requestAnimationFrame(updateTime);
    };
  
    // Start duration once metadata is loaded
    video.addEventListener('loadedmetadata', updateDuration);
  
    // Start smooth progress tracking
    animationFrameId = requestAnimationFrame(updateTime);
  
    return () => {
      video.removeEventListener('loadedmetadata', updateDuration);
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoURL,videoId]);

  

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const showControlsWithTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };
  const toggleFullScreen = () => {
    const videoContainer = videoRef.current?.parentElement;
  
    if (!document.fullscreenElement) {
      if (videoContainer?.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if ((videoContainer as any)?.webkitRequestFullscreen) {
        (videoContainer as any).webkitRequestFullscreen();
      } else if ((videoContainer as any)?.msRequestFullscreen) { 
        (videoContainer as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseMove={showControlsWithTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        key={videoId}
        ref={videoRef}
        poster={thumbnail}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      >
        <source src={`${videoURL}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className={`w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isPlaying ? (
            <Pause size={24} className="text-white ml-1" />
          ) : (
            <Play size={24} className="text-white ml-1" />
          )}
        </motion.button>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4"
      >
        {/* Progress bar */}
        <div className="w-full mb-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full  h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={skipBackward}
              className="text-white hover:text-gray-300"
            >
              <SkipBack size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="text-white hover:text-gray-300"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={skipForward}
              className="text-white hover:text-gray-300"
            >
              <SkipForward size={20} />
            </motion.button>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="text-white hover:text-gray-300"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </motion.button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white hover:text-gray-300"
            >
              <Settings size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFullScreen}
              className="text-white hover:text-gray-300"
            >
              <Maximize size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPlayer;