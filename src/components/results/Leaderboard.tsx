import { motion } from "framer-motion";
import { Trophy, Heart, Star, Users } from "lucide-react";
import type { Outfit, OutfitStats } from "@/types";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  outfits: Outfit[];
  stats: OutfitStats[];
}

export default function Leaderboard({ outfits, stats }: LeaderboardProps) {
  const sortedOutfits = outfits
    .map((outfit) => ({
      outfit,
      stat: stats.find((s) => s.outfitId === outfit.id) || {
        outfitId: outfit.id,
        participantCount: 0,
        ratingCount: 0,
        likeCount: 0,
        averageScore: 0,
        totalScore: 0,
      },
    }))
    .sort((a, b) => b.stat.averageScore - a.stat.averageScore);

  const maxScore = Math.max(
    ...sortedOutfits.map((o) => o.stat.averageScore),
    5,
  );

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-amber-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-700";
      default:
        return "text-charcoal/40";
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-50 border-amber-200";
      case 1:
        return "bg-gray-50 border-gray-200";
      case 2:
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-white border-charcoal/5";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="font-display text-xl">排行榜</h3>
      </div>

      {sortedOutfits.map(({ outfit, stat }, index) => (
        <motion.div
          key={outfit.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn("flex items-center gap-4 p-4 border", getRankBg(index))}
        >
          <div
            className={cn(
              "w-8 h-8 flex items-center justify-center font-display font-bold text-xl",
              getRankColor(index),
            )}
          >
            {index + 1}
          </div>

          <div className="w-16 h-20 flex-shrink-0 overflow-hidden">
            <img
              src={outfit.imageUrl}
              alt={outfit.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium mb-2">{outfit.name}</h4>

            <div className="w-full h-2 bg-charcoal/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stat.averageScore / maxScore) * 100}%` }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className={cn(
                  "h-full rounded-full",
                  index === 0 ? "bg-amber-500" : "bg-wine-red",
                )}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-charcoal/60">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{stat.averageScore} 分</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-wine-red fill-wine-red" />
                <span>{stat.likeCount}</span>
              </div>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {stat.ratingCount} 人评分
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
