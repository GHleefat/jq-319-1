import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Poll, Vote, Comment, Outfit } from "@/types";
import { generateId, getPollWithStats, isPollEnded } from "@/utils/helpers";
import { createInitialMockPolls } from "@/utils/mockData";

interface PollState {
  polls: Poll[];
  currentPollId: string | null;

  createPoll: (
    title: string,
    deadline: string,
    outfitImages: string[],
  ) => string;
  getPollById: (id: string) => Poll | undefined;
  getPollWithStatsById: (
    id: string,
  ) => ReturnType<typeof getPollWithStats> | undefined;

  addVote: (
    pollId: string,
    outfitId: string,
    userId: string,
    score: number,
    liked: boolean,
  ) => void;
  updateVote: (voteId: string, score: number, liked: boolean) => void;
  getUserVoteForOutfit: (
    pollId: string,
    outfitId: string,
    userId: string,
  ) => Vote | undefined;

  addComment: (pollId: string, userId: string, content: string) => void;

  setCurrentPoll: (id: string | null) => void;

  checkAndUpdatePollStatus: (pollId: string) => void;

  getAllPolls: () => Poll[];
}

export const usePollStore = create<PollState>()(
  persist(
    (set, get) => ({
      polls: createInitialMockPolls(),
      currentPollId: null,

      createPoll: (title, deadline, outfitImages) => {
        const pollId = generateId();
        const outfits: Outfit[] = outfitImages.map((imageUrl, index) => ({
          id: generateId(),
          pollId,
          imageUrl,
          name: `搭配 ${index + 1}`,
        }));

        const newPoll: Poll = {
          id: pollId,
          title,
          createdAt: new Date().toISOString(),
          deadline,
          status: "active",
          outfits,
          votes: [],
          comments: [],
        };

        set((state) => ({
          polls: [newPoll, ...state.polls],
        }));

        return pollId;
      },

      getPollById: (id) => {
        return get().polls.find((p) => p.id === id);
      },

      getPollWithStatsById: (id) => {
        const poll = get().polls.find((p) => p.id === id);
        if (!poll) return undefined;
        return getPollWithStats(poll);
      },

      addVote: (pollId, outfitId, userId, score, liked) => {
        const existingVote = get().getUserVoteForOutfit(
          pollId,
          outfitId,
          userId,
        );

        if (existingVote) {
          get().updateVote(existingVote.id, score, liked);
          return;
        }

        const newVote: Vote = {
          id: generateId(),
          pollId,
          outfitId,
          userId,
          score,
          liked,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          polls: state.polls.map((poll) =>
            poll.id === pollId
              ? { ...poll, votes: [...poll.votes, newVote] }
              : poll,
          ),
        }));
      },

      updateVote: (voteId, score, liked) => {
        set((state) => ({
          polls: state.polls.map((poll) => ({
            ...poll,
            votes: poll.votes.map((vote) =>
              vote.id === voteId
                ? { ...vote, score, liked, createdAt: new Date().toISOString() }
                : vote,
            ),
          })),
        }));
      },

      getUserVoteForOutfit: (pollId, outfitId, userId) => {
        const poll = get().polls.find((p) => p.id === pollId);
        if (!poll) return undefined;
        return poll.votes.find(
          (v) => v.outfitId === outfitId && v.userId === userId,
        );
      },

      addComment: (pollId, userId, content) => {
        const newComment: Comment = {
          id: generateId(),
          pollId,
          userId,
          content,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          polls: state.polls.map((poll) =>
            poll.id === pollId
              ? { ...poll, comments: [...poll.comments, newComment] }
              : poll,
          ),
        }));
      },

      setCurrentPoll: (id) => {
        set({ currentPollId: id });
      },

      checkAndUpdatePollStatus: (pollId) => {
        const poll = get().polls.find((p) => p.id === pollId);
        if (!poll) return;

        if (isPollEnded(poll) && poll.status === "active") {
          set((state) => ({
            polls: state.polls.map((p) =>
              p.id === pollId ? { ...p, status: "ended" } : p,
            ),
          }));
        }
      },

      getAllPolls: () => {
        return get().polls;
      },
    }),
    {
      name: "outfit-poll-storage",
      partialize: (state) => ({ polls: state.polls }),
    },
  ),
);
