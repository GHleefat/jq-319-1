import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import type { Outfit, OutfitStats } from "@/types";

interface WinnerDisplayProps {
  outfit: Outfit;
  stats: OutfitStats;
}

export default function WinnerDisplay({ outfit, stats }: WinnerDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <Crown className="w-16 h-16 text-amber-400 drop-shadow-lg" />
        </motion.div>
      </div>

      <div className="relative overflow-hidden shadow-2xl">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="aspect-[3/4]"
        >
          <img
            src={outfit.imageUrl}
            alt={outfit.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-amber-400 text-sm uppercase tracking-widest mb-2">
              获胜搭配
            </div>
            <h2 className="font-display text-3xl mb-4">{outfit.name}</h2>

            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-amber-400">
                  {stats.ballotCount}
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider">
                  得票数
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold">
                  {stats.averageScore}
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider">
                  平均分
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold">
                  {stats.likeCount}
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider">
                  点赞数
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{
              delay: 0.8 + i * 0.1,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="absolute"
            style={{
              left: `${10 + (i % 4) * 25}%`,
              top: `${15 + Math.floor(i / 4) * 30}%`,
            }}
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
