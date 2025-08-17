import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  checkIsCommentDisliked,
  checkIsCommentLiked,
  decreaseCommentDislike,
  decreaseCommentLike,
  deleteCommentReply,
  deleteVideoComment,
  increaseCommentDislike,
  increaseCommenttLike,
  postCommentReply
} from "../../services/requestFunctions";
import { Comment, UserData, CommentReply } from "../../Commons/userData";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CommentReplyItem } from "./CommentReplyItem";

type CommentItemProps = {
  comment: Comment;
  user: UserData;
  videoId: string;
  setCommentList: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export const CommentItem = ({
  comment,
  user,
  videoId,
  setCommentList
}: CommentItemProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(+comment.likes);
  const [dislikesCount, setDislikesCount] = useState<number>(+comment.disLikes);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const checkLikedStatus = async () => {
      if (user?.channel) {
        const formData = new FormData();
        formData.append("channelId", user?.channel.id.toString());
        formData.append("commentId", comment.id.toString());
        const isLiked = await checkIsCommentLiked(formData);
        setLiked(isLiked);
        const isDisliked = await checkIsCommentDisliked(formData);
        setDisliked(isDisliked);
      }
    };
    checkLikedStatus();
  }, [user?.channel, comment.id]);

  const handleLikeClick = async () => {
    if (!user?.channel) return;

    const formData = new FormData();
    formData.append("channelId", user.channel.id.toString());
    formData.append("commentId", comment.id.toString());

    if (liked) {
      await decreaseCommentLike(formData);
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      await increaseCommenttLike(formData);
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleDislike = async () => {
    if (!user?.channel) return;

    const formData = new FormData();
    formData.append("channelId", user.channel.id.toString());
    formData.append("commentId", comment.id.toString());

    if (disliked) {
      await decreaseCommentDislike(formData);
      setDisliked(false);
      setDislikesCount((prev) => prev - 1);
    } else {
      await increaseCommentDislike(formData);
      setDisliked(true);
      setDislikesCount((prev) => prev + 1);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !user?.channel) return;

    const formData = new FormData();
    formData.append("videoId", videoId);
    formData.append("commentId", comment.id.toString());
    formData.append("username", user.username);
    formData.append("userPicURL", user.channel.channelPicURL);
    formData.append("userChannelId", user.channel.id.toString());
    formData.append("commentData", replyText);

    await postCommentReply(formData);

    const newReply: CommentReply = {
      id: Date.now(),
      username: user.username,
      userPicURL: user.channel.channelPicURL,
      commentData: replyText,
      timestamp: new Date().toISOString(),
      likes: +"0",
      disLikes: +"0",
      userChannelId: user.channel.id
    };

    setCommentList((prev) =>
      prev.map((c) =>
        c.id === comment.id
          ? { ...c, replies: [...(c.replies || []), newReply] }
          : c
      )
    );

    setReplyText("");
    setShowReplyForm(false);
  };

  const getTimeStamp = (timestamp: string) => {
    dayjs.extend(relativeTime);
    return dayjs(timestamp).fromNow();
  };

  return (
    <div>
      {/* Like/Dislike/Reply/Delete Buttons */}
      <div className="flex items-center space-x-4">
        {/* Like */}
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLikeClick}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <ThumbsUp
              size={14}
              className={liked ? "text-blue-500" : "text-gray-400"}
            />
          </motion.button>
          <span className="text-xs text-gray-400">{likesCount}</span>
        </div>

        {/* Dislike */}
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDislike}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <ThumbsDown
              size={14}
              className={disliked ? "text-red-500" : "text-gray-400"}
            />
          </motion.button>
          <span className="text-xs text-gray-400">{dislikesCount}</span>
        </div>

        {/* Reply Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReplyForm((prev) => !prev)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Reply
        </motion.button>

        {/* Delete Button */}
        {user?.channel && comment.userChannelId === user?.channel.id && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={async () => {
              const formData = new FormData();
              formData.append("videoId", videoId);
              formData.append("commentId", comment.id.toString());
              await deleteVideoComment(formData);
              setCommentList((prev) =>
                prev.filter((c) => c.id !== comment.id)
              );
            }}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            <Trash2 size={14} className="text-gray-400" />
          </motion.button>
        )}
         {/* View replies button */}
      {comment.replies.length > 0 && (
        <button
          className="text-blue-400 text-xs mt-1"
          onClick={() => setShowReplies(prev => !prev)}
        >
          {showReplies
            ? "Hide replies"
            : `View ${comment.replies.length} replies`}
        </button>
      )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-2 flex space-x-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 bg-transparent border-b border-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReplySubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reply
          </motion.button>
        </div>
      )}

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-6 border-l border-gray-700 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex space-x-2">
              <img
                src={reply.userPicURL}
                alt={reply.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">
                    {reply.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {getTimeStamp(reply.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{reply.commentData}</p>
                {/* Like/Dislike for reply */}
                <div className="flex items-center space-x-2 mt-1">
                    <CommentReplyItem reply={reply} user={user} comment={comment} setCommentList={setCommentList}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
