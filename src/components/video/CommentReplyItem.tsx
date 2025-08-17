import { useEffect, useState } from "react";
import { Comment, CommentReply, UserData } from "../../Commons/userData";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { checkIsCommentReplyDisliked, checkIsCommentReplyLiked, decreaseCommentReplyDislike, decreaseCommentReplyLike, deleteCommentReply, increaseCommentReplyDislike, increaseCommentReplyLike } from "../../services/requestFunctions";

type CommentReplyItemProps = {
    reply: CommentReply;
    user: UserData;
    comment: Comment,
    setCommentList: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export function CommentReplyItem({ reply, user, setCommentList , comment}:CommentReplyItemProps) {
    const [isReplyLiked, setIsReplyLiked] = useState(false);
    const [isReplyDisliked, setIsReplyDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(reply.likes);
    const [dislikeCount, setDislikeCount] = useState(reply.disLikes);
    
  

    useEffect(() => {
        const checkStatus = async () => {
          const formData = new FormData();
          if (user?.channel) {
            formData.append("channelId", user.channel.id.toString());
          }
          formData.append("commentReplyId", reply.id.toString());
      
          const liked = await checkIsCommentReplyLiked(formData);
          const disliked = await checkIsCommentReplyDisliked(formData);
      
          setIsReplyLiked(liked);
          setIsReplyDisliked(disliked);
        };
      
        checkStatus();
      }, [reply.id, user?.channel]);


      const handleLike = async () => {
        const formData = new FormData();
        if (user?.channel) {
          formData.append("channelId", user.channel.id.toString());
        }
        formData.append("commentReplyId", reply.id.toString());
      
        if(isReplyLiked) {
          await decreaseCommentReplyLike(formData);
          setIsReplyLiked(false);
          setLikeCount(prev => prev - 1);
        } else {
          await increaseCommentReplyLike(formData);
          setIsReplyLiked(true);
          setLikeCount(prev => prev + 1);
        }
      };
      
      const handleDislike = async () => {
        const formData = new FormData();
        if (user?.channel) {
          formData.append("channelId", user.channel.id.toString());
        }
        formData.append("commentReplyId", reply.id.toString());
      
        if(isReplyDisliked) {
          await decreaseCommentReplyDislike(formData);
          setIsReplyDisliked(false);
          setDislikeCount(prev => prev - 1);
        } else {
          await increaseCommentReplyDislike(formData);
          setIsReplyDisliked(true);
          setDislikeCount(prev => prev + 1);
        }
      };
      
      

    return (
      <div>
        {/* Thumbs up/down buttons using this reply's states */}
        <div className="flex items-center space-x-2 mt-1">
        <ThumbsUp
            size={14}
            className={`cursor-pointer ${isReplyLiked ? "text-blue-500" : "text-gray-400"}`}
            onClick={handleLike}
        />
        <span className="text-xs text-gray-400">{likeCount}</span>

        <ThumbsDown
            size={14}
            className={`cursor-pointer ${isReplyDisliked ? "text-red-500" : "text-gray-400"}`}
            onClick={handleDislike}
        />
        <span className="text-xs text-gray-400">{dislikeCount}</span>
        {user?.channel && reply.userChannelId === user?.channel.id && (
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={async () => {
                const formData = new FormData();
                formData.append("commentId", comment.id.toString());
                formData.append("commentReplyId", reply.id.toString());
                await deleteCommentReply(formData);
                    setCommentList(prev =>
                        prev.map(c =>
                            c.id === comment.id
                                ? {
                                    ...c,
                                    replies: c.replies.filter(r => r.id !== reply.id),
                                }
                                : c
                        )
                    );
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors"
            >
                <Trash2 size={14} className="text-gray-400" />
            </motion.button>
            )}
        </div>
      </div>
    );
  }
  