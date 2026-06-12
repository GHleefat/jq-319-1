import type { User, Poll, Vote, Ballot, Comment } from "@/types";
import { generateId, getRandomImageUrl, getDefaultDeadline } from "./helpers";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "小明",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming&backgroundColor=ffd5dc",
  },
  {
    id: "user-2",
    name: "小红",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaohong&backgroundColor=b6e3f4",
  },
  {
    id: "user-3",
    name: "阿杰",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=ajie&backgroundColor=c0aede",
  },
  {
    id: "user-4",
    name: "小美",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaomei&backgroundColor=ffdfbf",
  },
  {
    id: "user-5",
    name: "大伟",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=dawei&backgroundColor=d1d4f9",
  },
];

const createMockPoll = (
  id: string,
  title: string,
  outfitCount: number,
  status: "active" | "ended",
): Poll => {
  const deadline =
    status === "ended"
      ? new Date(Date.now() - 86400000).toISOString()
      : getDefaultDeadline();

  const outfits = Array.from({ length: outfitCount }, (_, i) => ({
    id: `outfit-${id}-${i + 1}`,
    pollId: id,
    imageUrl: getRandomImageUrl(
      i + parseInt(id.replace(/\D/g, "")) * outfitCount,
    ),
    name: `搭配 ${i + 1}`,
  }));

  const votes: Vote[] = [];
  const ballots: Ballot[] = [];
  const comments: Comment[] = [];

  if (status === "ended") {
    mockUsers.forEach((user, userIndex) => {
      outfits.forEach((outfit, outfitIndex) => {
        if (Math.random() > 0.3) {
          votes.push({
            id: `vote-${id}-${userIndex}-${outfitIndex}`,
            pollId: id,
            outfitId: outfit.id,
            userId: user.id,
            score: Math.floor(Math.random() * 3) + 3,
            liked: Math.random() > 0.5,
            createdAt: new Date(
              Date.now() - Math.random() * 86400000,
            ).toISOString(),
          });
        }
      });

      const selectedOutfitIndex = Math.floor(Math.random() * outfitCount);
      ballots.push({
        id: `ballot-${id}-${userIndex}`,
        pollId: id,
        outfitId: outfits[selectedOutfitIndex].id,
        userId: user.id,
        createdAt: new Date(
          Date.now() - Math.random() * 86400000,
        ).toISOString(),
      });

      if (Math.random() > 0.4) {
        const commentTexts = [
          "第一套超好看！",
          "第二套更有气质~",
          "都很喜欢，好难选啊",
          "第三套很显瘦！",
          "颜色搭配很高级",
          "我投给第二套！",
        ];
        comments.push({
          id: `comment-${id}-${userIndex}`,
          pollId: id,
          userId: user.id,
          content: commentTexts[userIndex % commentTexts.length],
          createdAt: new Date(
            Date.now() - Math.random() * 86400000,
          ).toISOString(),
        });
      }
    });
  } else {
    mockUsers.slice(0, 2).forEach((user, userIndex) => {
      outfits.slice(0, 2).forEach((outfit, outfitIndex) => {
        votes.push({
          id: `vote-${id}-${userIndex}-${outfitIndex}`,
          pollId: id,
          outfitId: outfit.id,
          userId: user.id,
          score: Math.floor(Math.random() * 2) + 4,
          liked: true,
          createdAt: new Date(
            Date.now() - Math.random() * 3600000,
          ).toISOString(),
        });
      });

      ballots.push({
        id: `ballot-${id}-${userIndex}`,
        pollId: id,
        outfitId: outfits[userIndex % outfitCount].id,
        userId: user.id,
        createdAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      });
    });
  }

  return {
    id,
    title,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    deadline,
    status,
    outfits,
    votes,
    ballots,
    comments,
  };
};

export const createInitialMockPolls = (): Poll[] => {
  return [
    createMockPoll("poll-1", "今日约会穿哪套？", 3, "active"),
    createMockPoll("poll-2", "周末出游穿搭", 4, "ended"),
    createMockPoll("poll-3", "上班通勤选哪套", 2, "active"),
  ];
};

export const getDefaultUser = (): User => mockUsers[0];
