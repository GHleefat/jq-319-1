import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Copy,
  Share2,
  ArrowRight,
  Home,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { formatDateTime } from "@/utils/helpers";

export default function PollSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPollById } = usePollStore();
  const [copied, setCopied] = useState(false);

  const poll = id ? getPollById(id) : undefined;

  useEffect(() => {
    if (!poll) {
      navigate("/");
    }
  }, [poll, navigate]);

  if (!poll) {
    return null;
  }

  const shareUrl = `${window.location.origin}/vote/${poll.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poll.title,
          text: "来帮我选搭配吧！",
          url: shareUrl,
        });
      } catch (err) {
        console.error("分享失败:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>

          <h1 className="font-display text-2xl mb-2">投票创建成功！</h1>
          <p className="text-charcoal/60 mb-6">{poll.title}</p>

          <div className="bg-ivory p-4 mb-6">
            <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-2">
              投票链接
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-white px-3 py-2 text-sm text-charcoal/70 border border-charcoal/10 truncate"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`px-4 py-2 text-white flex-shrink-0 transition-colors ${
                  copied ? "bg-green-500" : "bg-wine-red hover:bg-wine-light"
                }`}
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    已复制
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm">
                    <Copy className="w-4 h-4" />
                    复制
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center p-3 bg-ivory-dark/30">
              <div className="text-2xl font-display font-bold text-wine-red">
                {poll.outfits.length}
              </div>
              <div className="text-xs text-charcoal/50">套搭配</div>
            </div>
            <div className="text-center p-3 bg-ivory-dark/30">
              <div className="flex items-center justify-center gap-1 text-wine-red mb-1">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium text-charcoal/80">
                {formatDateTime(poll.deadline)}
              </div>
              <div className="text-xs text-charcoal/50">截止时间</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleShare}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              分享给朋友
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/vote/${poll.id}`)}
                className="btn-secondary flex items-center justify-center gap-1 text-sm"
              >
                去投票
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-1 text-sm text-charcoal/60 hover:text-charcoal transition-colors py-3"
              >
                <Home className="w-4 h-4" />
                返回首页
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-charcoal/40 mt-6">
          <ExternalLink className="w-3 h-3 inline mr-1" />
          朋友打开链接后即可参与投票打分
        </p>
      </motion.div>
    </div>
  );
}
