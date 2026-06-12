import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, MessageCircle, Share2 } from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { getPollWithStats } from "@/utils/helpers";
import WinnerDisplay from "@/components/results/WinnerDisplay";
import Leaderboard from "@/components/results/Leaderboard";
import CommentList from "@/components/comment/CommentList";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPollById, checkAndUpdatePollStatus } = usePollStore();

  const poll = id ? getPollById(id) : undefined;

  useEffect(() => {
    if (id) {
      checkAndUpdatePollStatus(id);
    }
  }, [id, checkAndUpdatePollStatus]);

  if (!poll) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal/50 mb-4">投票不存在</p>
          <button onClick={() => navigate("/")} className="btn-secondary">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const pollWithStats = getPollWithStats(poll);
  const winnerOutfit = pollWithStats.winnerId
    ? poll.outfits.find((o) => o.id === pollWithStats.winnerId)
    : null;
  const winnerStats = pollWithStats.winnerId
    ? pollWithStats.outfitStats.find(
        (s) => s.outfitId === pollWithStats.winnerId,
      )
    : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${poll.title} - 投票结果`,
        text: `获胜的是 ${winnerOutfit?.name || "最佳搭配"}！`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制到剪贴板！");
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-charcoal/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-ivory-dark/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg">投票结果</h1>
          </div>

          <button
            onClick={handleShare}
            className="p-2 hover:bg-ivory-dark/50 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span className="text-sm text-charcoal/60 uppercase tracking-widest">
              Final Results
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-2">
            {poll.title}
          </h1>
          <p className="text-charcoal/50">
            共 {pollWithStats.totalParticipants} 人参与 ·{" "}
            {pollWithStats.totalRatings} 次评分 · {poll.comments.length} 条评论
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {winnerOutfit && winnerStats && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-md mx-auto"
              >
                <WinnerDisplay outfit={winnerOutfit} stats={winnerStats} />
              </motion.div>
            )}

            {!winnerOutfit && (
              <div className="text-center py-20 bg-white border border-charcoal/5">
                <Trophy className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                <p className="text-charcoal/50">暂无投票数据</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Leaderboard
                outfits={poll.outfits}
                stats={pollWithStats.outfitStats}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-wine-red" />
                <h3 className="font-display text-xl">所有评论</h3>
              </div>
              <CommentList
                comments={poll.comments}
                onAddComment={() => {}}
                disabled
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center pb-8"
            >
              <Link to="/" className="btn-secondary inline-block">
                返回首页
              </Link>
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-wine-red" />
                <h3 className="font-display text-lg">所有评论</h3>
                <span className="text-sm text-charcoal/50">
                  ({poll.comments.length})
                </span>
              </div>
              <div className="h-[500px]">
                <CommentList
                  comments={poll.comments}
                  onAddComment={() => {}}
                  disabled
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
