export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Outfit {
  id: string;
  pollId: string;
  imageUrl: string;
  name: string;
}

export interface Vote {
  id: string;
  pollId: string;
  outfitId: string;
  userId: string;
  score: number;
  liked: boolean;
  createdAt: string;
}

export interface Ballot {
  id: string;
  pollId: string;
  outfitId: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  pollId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Poll {
  id: string;
  title: string;
  createdAt: string;
  deadline: string;
  status: "active" | "ended";
  outfits: Outfit[];
  votes: Vote[];
  ballots: Ballot[];
  comments: Comment[];
}

export interface OutfitStats {
  outfitId: string;
  participantCount: number;
  ratingCount: number;
  likeCount: number;
  ballotCount: number;
  averageScore: number;
  totalScore: number;
}

export type PollWithStats = Poll & {
  outfitStats: OutfitStats[];
  totalParticipants: number;
  totalRatings: number;
  totalLikes: number;
  totalBallots: number;
  winnerId: string | null;
};
