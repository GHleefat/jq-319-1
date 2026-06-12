import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Comment, User } from "@/types";
import CommentItem from "./CommentItem";
import Avatar from "@/components/common/Avatar";
import { useUserStore } from "@/store/useUserStore";

interface CommentListProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  disabled?: boolean;
}

export default function CommentList({
  comments,
  onAddComment,
  disabled = false,
}: CommentListProps) {
  const [content, setContent] = useState("");
  const { getCurrentUser, getUserById } = useUserStore();
  const currentUser = getCurrentUser();

  const handleSubmit = () => {
    if (!content.trim() || disabled) return;
    onAddComment(content.trim());
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="bg-white border border-charcoal/5 flex flex-col h-full">
      <div className="p-4 border-b border-charcoal/5">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-wine-red" />
          <h3 className="font-display text-lg">评论</h3>
          <span className="text-sm text-charcoal/50">({comments.length})</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 min-h-[200px] max-h-[400px]">
        {sortedComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-charcoal/40">
            <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">暂无评论，来说两句吧~</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {sortedComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CommentItem
                  comment={comment}
                  user={getUserById(comment.userId)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {!disabled && currentUser && (
        <div className="p-4 border-t border-charcoal/5">
          <div className="flex gap-3">
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="发表你的看法..."
                className="flex-1 px-4 py-2 bg-ivory border-0 text-sm focus:outline-none focus:ring-1 focus:ring-wine-red/30"
              />
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="px-4 bg-wine-red text-white hover:bg-wine-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
