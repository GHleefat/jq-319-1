import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Users,
  Share2,
  ChevronDown,
  Trophy,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { useUserStore } from "@/store/useUserStore";
import OutfitSwiper from "@/components/outfit/OutfitSwiper";
import CommentList from "@/components/comment/CommentList";
import UserSwitcher from "@/components/user/UserSwitcher";
import Avatar from "@/components/common/Avatar";
import { formatDate, getPollWithStats } from "@/utils/helpers";
import { cn } from "@/lib/utils";

export default function VotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPollById, addVote, addComment, checkAndUpdatePollStatus } =
    usePollStore();
  const { getCurrentUser, users, setCurrentUser } = useUserStore();
  const [showComments, setShowComments] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const poll = id ? getPollById(id) : undefined;
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (id) {
      checkAndUpdatePollStatus(id);

      const interval = setInterval(() => {
        checkAndUpdatePollStatus(id);
      }, 60000);

      return () => clearInterval(interval);
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
  const isEnded =
    poll.status === "ended" || new Date(poll.deadline) < new Date();

  const handleRate = (outfitId: string, score: number, liked: boolean) => {
    if (!id || !currentUser || isEnded) return;
    addVote(id, outfitId, currentUser.id, score, liked);
  };

  const handleAddComment = (content: string) => {
    if (!id || !currentUser) return;
    addComment(id, currentUser.id, content);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll.title,
        text: "来帮我选搭配吧！",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制到剪贴板！");
    }
  };

  const handleSwitchUser = (userId: string) => {
    setCurrentUser(userId);
    setShowUserMenu(false);
  };

  return (
    <div className="min-h-screen bg-ivory pb-8">
      <header className="border-b border-charcoal/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-ivory-dark/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg line-clamp-1">
                {poll.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-ivory-dark/50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {isEnded && (
              <Link
                to={`/results/${id}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-wine-red text-white text-sm hover:bg-wine-light transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">查看结果</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-display text-xl sm:text-2xl lg:hidden">
                  {poll.title}
                </h1>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-charcoal/60">
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {formatDate(poll.deadline)}
                    </span>
                    <span className="sm:hidden">
                      {formatDate(poll.deadline).split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-charcoal/60">
                    <Users className="w-4 h-4" />
                    <span>{pollWithStats.totalParticipants} 人参与</span>
                  </div>
                </div>
              </div>

              {isEnded && (
                <div className="mb-4 p-3 bg-charcoal/5 border border-charcoal/10 text-center">
                  <span className="tag-ended">投票已结束</span>
                  <Link
                    to={`/results/${id}`}
                    className="ml-3 text-wine-red text-sm hover:underline"
                  >
                    查看最终结果 →
                  </Link>
                </div>
              )}

              <OutfitSwiper
                outfits={poll.outfits}
                votes={poll.votes}
                userId={currentUser?.id || ""}
                onRate={handleRate}
                disabled={isEnded}
              />

              {!isEnded && (
                <p className="text-center text-sm text-charcoal/50 mt-4">
                  ← 左右滑动浏览搭配 →
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:hidden"
            >
              <div className="bg-white p-4 border border-charcoal/5">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-wine-red" />
                    <span className="font-display text-lg">实时统计</span>
                    <span className="text-sm text-charcoal/50">
                      ({pollWithStats.totalParticipants} 人参与)
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-charcoal/40 transition-transform",
                      showStats && "rotate-180",
                    )}
                  />
                </button>

                {showStats && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3">
                      {pollWithStats.outfitStats
                        .sort((a, b) => b.averageScore - a.averageScore)
                        .map((stat, index) => {
                          const outfit = poll.outfits.find(
                            (o) => o.id === stat.outfitId,
                          );
                          if (!outfit) return null;

                          const maxScore = Math.max(
                            ...pollWithStats.outfitStats.map(
                              (s) => s.averageScore,
                            ),
                            5,
                          );
                          const percentage =
                            maxScore > 0
                              ? Math.round((stat.averageScore / maxScore) * 100)
                              : 0;

                          return (
                            <div
                              key={stat.outfitId}
                              className="flex items-center gap-3"
                            >
                              <div className="w-10 h-12 flex-shrink-0 overflow-hidden relative">
                                <img
                                  src={outfit.imageUrl}
                                  alt={outfit.name}
                                  className="w-full h-full object-cover"
                                />
                                {index === 0 &&
                                  pollWithStats.totalRatings > 0 && (
                                    <div className="absolute top-0 left-0 bg-amber-400 text-white text-xs px-1">
                                      <Trophy className="w-3 h-3" />
                                    </div>
                                  )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium truncate">
                                    {outfit.name}
                                  </span>
                                  <span className="text-wine-red font-medium">
                                    {stat.averageScore} 分
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{
                                      delay: 0.1 + index * 0.05,
                                      duration: 0.5,
                                    }}
                                    className={cn(
                                      "h-full rounded-full",
                                      index === 0
                                        ? "bg-amber-400"
                                        : "bg-wine-red",
                                    )}
                                  />
                                </div>
                                <div className="text-xs text-charcoal/50 mt-1 flex flex-wrap items-center gap-2">
                                  <span>{stat.ratingCount} 人评分</span>
                                  <span>·</span>
                                  <span>{stat.likeCount} 赞</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:hidden"
            >
              <div className="bg-white p-4 border border-charcoal/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-charcoal/60">当前身份</span>
                  </div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 -mr-1 hover:bg-ivory-dark/50 transition-colors"
                  >
                    {currentUser && (
                      <>
                        <Avatar
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          size="sm"
                        />
                        <span className="text-sm">{currentUser.name}</span>
                      </>
                    )}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-charcoal/40 transition-transform",
                        showUserMenu && "rotate-180",
                      )}
                    />
                  </button>
                </div>

                {showUserMenu && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-1">
                      <div className="text-xs text-charcoal/40 px-2 py-1 uppercase tracking-wider">
                        切换身份模拟投票
                      </div>
                      {users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSwitchUser(user.id)}
                          className={cn(
                            "w-full flex items-center gap-3 p-2 text-left hover:bg-ivory-dark/30 transition-colors",
                            user.id === currentUser?.id && "bg-ivory-dark/50",
                          )}
                        >
                          <Avatar src={user.avatar} alt={user.name} size="sm" />
                          <span className="text-sm">{user.name}</span>
                          {user.id === currentUser?.id && (
                            <span className="ml-auto text-wine-red text-xs">
                              当前
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:hidden"
            >
              <button
                onClick={() => setShowComments(!showComments)}
                className="w-full py-3 bg-white border border-charcoal/5 text-center hover:bg-ivory-dark/30 transition-colors"
              >
                {showComments
                  ? "收起评论"
                  : `查看评论 (${poll.comments.length})`}
              </button>

              {showComments && (
                <div className="mt-4">
                  <CommentList
                    comments={poll.comments}
                    onAddComment={handleAddComment}
                    disabled={isEnded}
                  />
                </div>
              )}
            </motion.div>
          </div>

          <div className="hidden lg:block space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <UserSwitcher />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white p-4 border border-charcoal/5"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-wine-red" />
                <h3 className="font-display text-lg">实时统计</h3>
              </div>

              <div className="space-y-3">
                {pollWithStats.outfitStats
                  .sort((a, b) => b.averageScore - a.averageScore)
                  .map((stat, index) => {
                    const outfit = poll.outfits.find(
                      (o) => o.id === stat.outfitId,
                    );
                    if (!outfit) return null;

                    const maxScore = Math.max(
                      ...pollWithStats.outfitStats.map((s) => s.averageScore),
                      5,
                    );
                    const percentage =
                      maxScore > 0
                        ? Math.round((stat.averageScore / maxScore) * 100)
                        : 0;

                    return (
                      <div
                        key={stat.outfitId}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-12 flex-shrink-0 overflow-hidden relative">
                          <img
                            src={outfit.imageUrl}
                            alt={outfit.name}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && pollWithStats.totalRatings > 0 && (
                            <div className="absolute top-0 left-0 bg-amber-400 text-white text-xs px-1">
                              <Trophy className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium truncate">
                              {outfit.name}
                            </span>
                            <span className="text-wine-red font-medium">
                              {stat.averageScore} 分
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{
                                delay: 0.3 + index * 0.1,
                                duration: 0.5,
                              }}
                              className={cn(
                                "h-full rounded-full",
                                index === 0 ? "bg-amber-400" : "bg-wine-red",
                              )}
                            />
                          </div>
                          <div className="text-xs text-charcoal/50 mt-1 flex flex-wrap items-center gap-2">
                            <span>{stat.ratingCount} 人评分</span>
                            <span>·</span>
                            <span>{stat.likeCount} 赞</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-4 pt-4 border-t border-charcoal/5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xl font-display font-bold text-wine-red">
                      {pollWithStats.totalParticipants}
                    </div>
                    <div className="text-xs text-charcoal/50">参与人数</div>
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-amber-500">
                      {pollWithStats.totalRatings}
                    </div>
                    <div className="text-xs text-charcoal/50">评分次数</div>
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-rose-500">
                      {pollWithStats.totalLikes}
                    </div>
                    <div className="text-xs text-charcoal/50">点赞总数</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="h-[400px]"
            >
              <CommentList
                comments={poll.comments}
                onAddComment={handleAddComment}
                disabled={isEnded}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
