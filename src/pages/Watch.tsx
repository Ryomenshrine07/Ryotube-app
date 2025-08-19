import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal, Bell, CheckCircle } from 'lucide-react';
import VideoPlayer from '../components/video/VideoPlayer';
import CommentSection from '../components/video/CommentSection';
import VideoCard from '../components/video/VideoCard';
import { mockVideos, mockComments } from '../data/mockData';
import { checkIsDisliked, checkIsLiked, checkIsSubcribed, decreaseVideoDislikes, decreaseVideoLikes, getAllVideosExceptSelf, getDislikeCount, getDownloadURL, getLikeCount, getVideoById, getVideoChannelPic, getVideoChannelSubCount, getVideoComments, increaseVideoDislikes, increaseVideoLikes, increaseVideoViews, setChannelHistory, subscribeToChannel, unSubscribeToChannel } from '../services/requestFunctions';
import { Comment, CommentReply, Video } from '../Commons/userData';
import { useAuth } from '../components/auth/AuthContext';
import { useDownloads } from '../components/auth/DownloadContext';
import { useDownloadStore } from '../components/auth/DownloadStore';
import axios from 'axios';

const Watch: React.FC = () => {
  const { videoId, videoURL } = useParams<{ videoId: string,videoURL: string }>();
  const [video, setVideo] = useState< Video | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount,setLikeCount] = useState<number>(0);
  const [dislikeCount,setDislikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [relatedVideos,setRelatedVideos] = useState<Video[] | null>(null);
  const [videoChannelPic,setVideoChannelPic] = useState<string>();
  const [vCSubCount, setVCSubCount] = useState(0);
  const [comments, setComments] = useState<Comment[] | null>();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
  
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2; // ~2s total fill
        });
      }, 40);
    }
  
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    // Find the video by ID
    const getVideo = async() => {
      if(videoId){
        setLoading(true);
        const response = await getVideoById(+videoId);
        const formData = new FormData();
        if(user?.channel) formData.append("channelId",user?.channel?.id.toString());
        formData.append("videoId",videoId);
        await increaseVideoViews(formData);
        await setChannelHistory(formData);
        const videoData = new FormData();
        videoData.append("videoId",videoId);
        if(user?.channel) videoData.append("channelId",user?.channel?.id.toString());
        const liked = await checkIsLiked(videoData);
        const disliked = await checkIsDisliked(videoData);
        if(liked){
          setIsLiked(liked);
        }else if(disliked){
          setIsDisliked(disliked);
        }
        const likes = await getLikeCount(+videoId);
        const dislikes = await getDislikeCount(+videoId);
        setLikeCount(likes);
        // if(likes > 0){
        //   setIsLiked(true);
        //   setIsDisliked(false);
        // }else if(dislikes > 0){
        //   setIsLiked(false);
        //   setIsDisliked(true);
        // }else{
        //   setIsLiked(false);
        //   setIsDisliked(false);
        // }
        setDislikeCount(dislikes);
        setVideo(response);
        const rest = await getAllVideosExceptSelf(+videoId);
        setRelatedVideos(rest);
        if(response){
          const url = await getVideoChannelPic(response?.channelId);
          // console.log(url)
          if(url) setVideoChannelPic(url);
          const subData = new FormData();
          if(user?.channel) subData.append("channelId",user?.channel?.id.toString());
          subData.append("subscribed-channelId",response.channelId.toString());
          const isSub = await checkIsSubcribed(subData);
            if(isSub){
              setIsSubscribed(true);
            }else{
              setIsSubscribed(false);
            }
          const subCount = await getVideoChannelSubCount(response.channelId);
          if(subCount) setVCSubCount(subCount);
          const commmentRes = await getVideoComments(+videoId);
          if(commmentRes){
            setComments(commmentRes);
          }else{
            setComments([]);
          }
        }
        setLoading(false);
      }
    }
    const getAllData = async() => {
      await getVideo();
    }
    getAllData();
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-64 h-2 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white mt-4">Loading video...</p>
      </div>
    );
  }

  if(!video) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Video not found</div>
      </div>
    );
  }

  // const relatedVideos = mockVideos.filter((v) => v.id !== videoId).slice(0, 6);

  const handleLike = async() => {
    const videoData = new FormData();
    if(videoId) videoData.append("videoId",videoId);
    if(user?.channel) videoData.append("channelId",user?.channel?.id.toString());
    if(!isLiked) await increaseVideoLikes(videoData);
    else await decreaseVideoLikes(videoData);
    if(videoId){
      const likes = await getLikeCount(+videoId);
      setLikeCount(likes);
      const dislikes = await getDislikeCount(+videoId);
      setDislikeCount(dislikes);
    }
    setIsLiked(!isLiked);
    if(isDisliked) setIsDisliked(false);
  };

  const handleDislike = async() => {
    const videoData = new FormData();
    if(videoId) videoData.append("videoId",videoId);
    if(user?.channel) videoData.append("channelId",user?.channel?.id.toString());
    if(!isDisliked) await increaseVideoDislikes(videoData);
    else await decreaseVideoDislikes(videoData);
    if(videoId){
      const likes = await getLikeCount(+videoId);
      setLikeCount(likes);
      const dislikes = await getDislikeCount(+videoId);
      setDislikeCount(dislikes);
    }
    setIsDisliked(!isDisliked);
    if(isLiked) setIsLiked(false);
  };

  const handleSubscribe = async() => {
    console.log("HERER");
    const formData = new FormData();
    if(user?.channel) formData.append("channelId",user?.channel?.id.toString());
    if(videoId) formData.append("videoId",videoId);
    if(!isSubscribed){
      await subscribeToChannel(formData);
      setIsSubscribed(true);
    }else{
      await unSubscribeToChannel(formData);
      setIsSubscribed(false);
    }
  }
  const handleWatchLater = async (videoId:number) => {
    try {
      if (!user?.channel) {
        console.log("User not logged in or channel not found");
        return;
      }
  
      const formData = new FormData();
      formData.append("videoId", videoId.toString());
      formData.append("channelId", user.channel.id.toString());
  
      // await addToWatchLater(formData); // <-- your API function here
  
      console.log("Video added to Watch Later");
      // Optional: show a toast notification
      // toast.success("Added to Watch Later");
    } catch (err) {
      console.error("Failed to add to Watch Later", err);
      // toast.error("Something went wrong");
    }
  };
  const handleDownload = async() => {
    if (!videoId) return;

    try {
      const url = await getDownloadURL(+videoId); // presigned GET URL
  
      // Single GET request with streaming
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const contentLength = Number(response.headers.get("content-length"));
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];
  
      // Add download to store
      useDownloadStore.getState().addDownload({
        id: +videoId,
        title: video.tile,
        thumbnail: video.videoThumbnail,
        channelName: video.videoChannelName,
        videoDuration: video.duration,
        progress: 0,
        fileSize: contentLength,
        status: "downloading",
      });
  
      const reader = response.body!.getReader();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        chunks.push(value);
        receivedLength += value.length;
  
        const progress = Math.round((receivedLength / contentLength) * 100);
        useDownloadStore.getState().updateProgress(+videoId, progress);
      }
  
      // Merge chunks and download
      const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${video.tile}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      useDownloadStore.getState().markCompleted(+videoId);
    } catch (error) {
      console.error(error);
      useDownloadStore.getState().updateStatus(+videoId, "failed");
    }
  }
  // const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col xl:flex-row gap-6 p-4 md:p-6">
        {/* Main Video Section */}
        <div className="flex-1">
          <VideoPlayer videoURL={video.videoUrl} videoId={String(videoId)} thumbnail={video.videoThumbnail} />
          
          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-lg md:text-xl font-bold text-white mb-2">{video.tile}</h1>
            
            <div className="flex items-center justify-between flex-wrap gap-2 md:gap-4">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">
                  {video.views} views
                </div>
              </div>
              
              <div className="flex items-center space-x-1 no-scrollbar md:space-x-2 overflow-x-auto">
                <div className="flex items-center bg-gray-800 rounded-full overflow-hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 transition-colors ${
                      isLiked ? 'text-blue-500' : 'text-gray-300'
                    }`}
                  >
                    <ThumbsUp size={20} />
                    <span className="text-sm">{likeCount}</span>
                  </motion.button>
                  
                  <div className="w-px h-6 bg-gray-700" />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDislike}
                    className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 transition-colors ${
                      isDisliked ? 'text-red-500' : 'text-gray-300'
                    }`}
                  >
                    <ThumbsDown size={20} />
                    <span className="text-sm">{dislikeCount}</span>
                  </motion.button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <Share size={20} />
                  <span className="text-sm hidden md:inline">Share</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors hidden md:flex"
                >
                  <Download size={20} />
                  <span className="text-sm">Download</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors hidden md:block"
                >
                  <MoreHorizontal size={20} />
                </motion.button>
              </div>
            </div>
            
            {/* Channel Info */}
            <div className="flex items-center justify-between mt-6 p-4 bg-gray-800 rounded-lg">
              
              <div className="flex items-center space-x-4">
                <img
                  src={videoChannelPic}
                  alt={video.videoChannelName}
                  className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 onClick={() => navigate(`/channel/${video.channelId.toString()}`)} className="text-white font-medium text-sm md:text-base cursor-pointer">{video.videoChannelName}</h3>
                    {user?.channel?.verified && (
                      <CheckCircle size={16} className="text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-gray-400">{vCSubCount} subscribers</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubscribe}
                className={`flex items-center space-x-2 px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm md:text-base ${
                  isSubscribed
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <Bell size={18} />
                <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
              </motion.button>
            </div>
            
            {/* Description */}
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <div className="text-gray-300 text-sm">
                {showDescription ? (
                  <div>
                    <p className="mb-2">{video.description}</p>
                    <p className="mb-2">
                      This is a detailed description of the video content. Here you can find more information about what the video covers, including timestamps, resources, and additional notes from the creator.
                    </p>
                    <p className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      #React #TypeScript #WebDevelopment #Tutorial
                    </p>
                  </div>
                ) : (
                  <p className="line-clamp-2">{video.description}</p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDescription(!showDescription)}
                className="mt-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showDescription ? 'Show less' : 'Show more'}
              </motion.button>
            </div>
          </div>
          
          {/* Comments */}
          {window.innerWidth > 768 && comments && <CommentSection comments={comments} videoId={String(videoId)} />}
        </div>
        
        {/* Related Videos Sidebar */}
        <div className="w-full xl:w-96 space-y-4 mt-6 xl:mt-0">
          <h2 className="text-lg font-semibold text-white mb-4">Other Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            {relatedVideos && relatedVideos.map((relatedVideo, index) => (
              <div key={relatedVideo.id} className="xl:flex xl:space-x-3">
                <div className="w-full md:w-48 xl:w-full flex-shrink-0">
                  <VideoCard video={relatedVideo} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {window.innerWidth <= 768 && comments && <CommentSection comments={comments} videoId={String(videoId)} />}
      </div>
    </div>
  );
};

export default Watch;