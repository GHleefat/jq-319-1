import { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RatingControlsProps {
  initialScore?: number;
  initialLiked?: boolean;
  onScoreChange?: (score: number) => void;
  onLikeChange?: (liked: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function RatingControls({
  initialScore = 0,
  initialLiked = false,
  onScoreChange,
  onLikeChange,
  size = "md",
  disabled = false,
}: RatingControlsProps) {
  const [score, setScore] = useState(initialScore);
  const [liked, setLiked] = useState(initialLiked);
  const [hoverScore, setHoverScore] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  useEffect(() => {
    setScore(initialScore);
    setLiked(initialLiked);
  }, [initialScore, initialLiked]);

  const handleScoreClick = (newScore: number) => {
    if (disabled) return;
    const finalScore = score === newScore ? 0 : newScore;
    setScore(finalScore);
    onScoreChange?.(finalScore);
  };

  const handleLikeClick = () => {
    if (disabled) return;
    const newLiked = !liked;
    setLiked(newLiked);
    onLikeChange?.(newLiked);

    if (newLiked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 600);
    }
  };

  const sizeClasses = {
    sm: { star: "w-4 h-4", heart: "w-5 h-5" },
    md: { star: "w-6 h-6", heart: "w-7 h-7" },
    lg: { star: "w-8 h-8", heart: "w-10 h-10" },
  };

  const displayScore = hoverScore || score;

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleScoreClick(star)}
            onMouseEnter={() => !disabled && setHoverScore(star)}
            onMouseLeave={() => setHoverScore(0)}
            disabled={disabled}
            className={cn(
              "p-1 transition-all duration-200",
              disabled ? "cursor-default" : "cursor-pointer hover:scale-110",
            )}
          >
            <Star
              className={cn(
                sizeClasses[size].star,
                "transition-colors duration-200",
                star <= displayScore
                  ? "text-amber-400 fill-amber-400"
                  : "text-charcoal/20",
              )}
            />
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={handleLikeClick}
          disabled={disabled}
          className={cn(
            "transition-all duration-200",
            disabled ? "cursor-default" : "cursor-pointer hover:scale-110",
            liked ? "text-wine-red" : "text-charcoal/30",
          )}
        >
          <Heart
            className={cn(
              sizeClasses[size].heart,
              "transition-all duration-200",
              liked ? "fill-wine-red" : "",
              showHeartAnimation ? "animate-heart-beat" : "",
            )}
          />
        </button>

        {showHeartAnimation && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1.5,
                  x: Math.cos((i * Math.PI * 2) / 6) * 30,
                  y: Math.sin((i * Math.PI * 2) / 6) * 30 - 10,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <Heart className="w-3 h-3 fill-wine-red text-wine-red" />
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
