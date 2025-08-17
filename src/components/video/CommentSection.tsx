import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Comment } from '../../Commons/userData';
import { useAuth } from '../auth/AuthContext';
import { postVideoComment } from '../../services/requestFunctions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CommentItem } from './CommentItem';


interface CommentSectionProps {
  comments: Comment[];
  videoId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, videoId }) => {

  useEffect(() => {
    SetCommentList(comments || []);
  },[videoId,comments])
  
  const [newComment, setNewComment] = useState('');
  const [commentList,SetCommentList] = useState<Comment[]>(comments);

  const [sortBy, setSortBy] = useState('top');
  const {user} = useAuth(); 

  const handleSubmitComment = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("JEJEEJ");
    if(newComment.trim() && user && user.channel) {
      const formData = new FormData();
      formData.append("videoId",videoId);
      formData.append("username",user?.username);
      formData.append("userPicURL",user.channel?.channelPicURL);
      formData.append("userChannelId",user.channel.id.toString());
      formData.append("commentData",newComment);
      await postVideoComment(formData);
      const newCommentObj: Comment = {
        id: Date.now(), // temp id
        username: user.username,
        userPicURL: user.channel.channelPicURL,
        commentData: newComment,
        timestamp: new Date().toISOString(),
        likes: "0",
        disLikes:"0",
        replies:[],
        userChannelId:user.channel.id
      };
      SetCommentList([newCommentObj,...comments]);
      setNewComment('');
    }
  };

  const getTimeStamp = (timestamp:string) => {
    dayjs.extend(relativeTime);
    const timeAgo = dayjs(timestamp).fromNow();
    return timeAgo
  }

  return (
    <div className="mt-6">
      <div className="flex items-center space-x-8 mb-6">
        <h3 className="text-lg font-semibold text-white">
          {commentList.length} Comments
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white text-sm border border-gray-700 rounded px-2 py-1"
          >
            <option value="top">Top comments</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
      </div>

      {/* Add comment */}
      <div className="flex space-x-3 mb-6">
        <img
          src={`${user?.channel?.channelPicURL}`}
          alt="Your Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-gray-700 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 pb-2"
              rows={1}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Heart size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setNewComment('')}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comment
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {commentList.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-3"
          >
            <img
              src={comment.userPicURL}
              alt={comment.username}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-white">
                  {comment.username}
                </span>
                <span className="text-xs text-gray-400">
                  {getTimeStamp(comment.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{comment.commentData}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {user && <CommentItem setCommentList={SetCommentList} videoId={videoId} comment={comment} user={user} />}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;