import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Poll } from "@/types";
import { formatDate, getPollWithStats } from "@/utils/helpers";

interface PollCardProps {
  poll: Poll;
  index?: number;
}

export default function PollCard({ poll, index = 0 }: PollCardProps) {
  const navigate = useNavigate();
  const pollWithStats = getPollWithStats(poll);
  const isEnded =
    poll.status === "ended" || new Date(poll.deadline) < new Date();

  const handleClick = () => {
    if (isEnded) {
      navigate(`/results/${poll.id}`);
    } else {
      navigate(`/vote/${poll.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={handleClick}
      className="card-magazine cursor-pointer group"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="absolute inset-0 flex">
          {poll.outfits.slice(0, 3).map((outfit, i) => (
            <div
              key={outfit.id}
              className="flex-1 relative"
              style={{ marginLeft: i > 0 ? "-1px" : "0" }}
            >
              <img
                src={outfit.imageUrl}
                alt={outfit.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className={isEnded ? "tag-ended" : "tag-active"}>
            {isEnded ? "已结束" : "进行中"}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-display text-xl mb-2 line-clamp-2">
            {poll.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(poll.deadline)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{pollWithStats.totalVotes} 票</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-charcoal/60">
          <span>{poll.outfits.length} 套搭配</span>
          <span className="text-wine-red font-medium group-hover:translate-x-1 transition-transform inline-block">
            查看详情 →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
