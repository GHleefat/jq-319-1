import type { Comment, User } from "@/types";
import Avatar from "@/components/common/Avatar";
import { formatDateTime } from "@/utils/helpers";

interface CommentItemProps {
  comment: Comment;
  user: User | undefined;
}

export default function CommentItem({ comment, user }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-3 border-b border-charcoal/5 last:border-0">
      <Avatar src={user?.avatar || ""} alt={user?.name || ""} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {user?.name || "匿名用户"}
          </span>
          <span className="text-xs text-charcoal/40">
            {formatDateTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-charcoal/80 leading-relaxed break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
