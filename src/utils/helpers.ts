import type {
  Poll,
  OutfitStats,
  PollWithStats,
  User,
  Vote,
  Comment,
  Outfit,
} from "@/types";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) {
    return "已结束";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `剩余 ${days} 天 ${hours} 小时`;
  } else if (hours > 0) {
    return `剩余 ${hours} 小时 ${minutes} 分`;
  } else {
    return `剩余 ${minutes} 分钟`;
  }
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}月${day}日 ${hours}:${minutes}`;
};

export const calculateOutfitStats = (
  outfit: Outfit,
  votes: Vote[],
): OutfitStats => {
  const outfitVotes = votes.filter((v) => v.outfitId === outfit.id);
  const likeCount = outfitVotes.filter((v) => v.liked).length;
  const ratedVotes = outfitVotes.filter((v) => v.score > 0);
  const ratingCount = ratedVotes.length;
  const totalScore = ratedVotes.reduce((sum, v) => sum + v.score, 0);
  const averageScore = ratingCount > 0 ? totalScore / ratingCount : 0;

  const participantCount = outfitVotes.length;

  return {
    outfitId: outfit.id,
    participantCount,
    ratingCount,
    likeCount,
    averageScore: Math.round(averageScore * 10) / 10,
    totalScore,
  };
};

export const getPollWithStats = (poll: Poll): PollWithStats => {
  const outfitStats = poll.outfits.map((outfit) =>
    calculateOutfitStats(outfit, poll.votes),
  );

  const uniqueUsers = new Set(poll.votes.map((v) => v.userId));
  const totalParticipants = uniqueUsers.size;
  const totalRatings = poll.votes.filter((v) => v.score > 0).length;
  const totalLikes = poll.votes.filter((v) => v.liked).length;

  let winnerId: string | null = null;
  if (totalRatings > 0) {
    const sorted = [...outfitStats].sort(
      (a, b) => b.averageScore - a.averageScore,
    );
    if (sorted[0].averageScore > 0) {
      winnerId = sorted[0].outfitId;
    }
  }

  return {
    ...poll,
    outfitStats,
    totalParticipants,
    totalRatings,
    totalLikes,
    winnerId,
  };
};

export const isPollEnded = (poll: Poll): boolean => {
  return new Date(poll.deadline) < new Date() || poll.status === "ended";
};

export const getUserById = (
  users: User[],
  userId: string,
): User | undefined => {
  return users.find((u) => u.id === userId);
};

export const getDefaultDeadline = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(23, 59, 59, 0);
  return date.toISOString();
};

export const getRandomImageUrl = (index: number): string => {
  const fashionImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop",
  ];
  return fashionImages[index % fashionImages.length];
};
