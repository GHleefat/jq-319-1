import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Outfit, Vote } from "@/types";
import RatingControls from "./RatingControls";
import { cn } from "@/lib/utils";

interface OutfitSwiperProps {
  outfits: Outfit[];
  votes: Vote[];
  userId: string;
  onRate: (outfitId: string, score: number, liked: boolean) => void;
  disabled?: boolean;
}

export default function OutfitSwiper({
  outfits,
  votes,
  userId,
  onRate,
  disabled = false,
}: OutfitSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentOutfit = outfits[currentIndex];
  const currentVote = votes.find(
    (v) => v.outfitId === currentOutfit?.id && v.userId === userId,
  );

  const goToNext = useCallback(() => {
    if (currentIndex < outfits.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, outfits.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const threshold = 100;

    if (info.offset.x < -threshold && currentIndex < outfits.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setDragX(0);
  };

  const handleDrag = (event: any, info: any) => {
    setIsDragging(true);
    setDragX(info.offset.x);
  };

  const handleScoreChange = (score: number) => {
    if (!currentOutfit || disabled) return;
    onRate(currentOutfit.id, score, currentVote?.liked || false);
  };

  const handleLikeChange = (liked: boolean) => {
    if (!currentOutfit || disabled) return;
    onRate(currentOutfit.id, currentVote?.score || 0, liked);
  };

  if (outfits.length === 0) {
    return (
      <div className="aspect-[3/4] bg-ivory-dark flex items-center justify-center">
        <p className="text-charcoal/50">暂无搭配</p>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 swipe-container cursor-grab active:cursor-grabbing"
          >
            <img
              src={currentOutfit.imageUrl}
              alt={currentOutfit.name}
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="font-display text-2xl mb-4">
                {currentOutfit.name}
              </h3>

              <div className="flex items-center justify-between">
                <RatingControls
                  initialScore={currentVote?.score || 0}
                  initialLiked={currentVote?.liked || false}
                  onScoreChange={handleScoreChange}
                  onLikeChange={handleLikeChange}
                  size="lg"
                  disabled={disabled}
                />

                <div className="text-right">
                  <div className="text-sm text-white/70">
                    {currentIndex + 1} / {outfits.length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {currentIndex > 0 && (
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentIndex < outfits.length - 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {outfits.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-wine-red w-6"
                : "bg-charcoal/20 hover:bg-charcoal/40",
            )}
          />
        ))}
      </div>

      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.min(Math.abs(dragX) / 200, 0.3) }}
            className={cn(
              "absolute inset-0",
              dragX < 0 ? "bg-wine-red/20" : "bg-charcoal/20",
            )}
          />
        </div>
      )}
    </div>
  );
}
