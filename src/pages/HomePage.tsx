import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PollList from "@/components/poll/PollList";
import UserSwitcher from "@/components/user/UserSwitcher";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-charcoal/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-2xl"
          >
            <span className="text-wine-red">搭配</span>投票
          </motion.h1>

          <UserSwitcher compact />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center py-12"
        >
          <p className="text-charcoal/60 mb-2">今天穿什么？</p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            让朋友帮你<span className="text-wine-red">选搭配</span>
          </h2>
          <p className="text-charcoal/50 max-w-md mx-auto">
            上传几套搭配，分享给朋友投票，实时看结果
          </p>
        </motion.div>

        <PollList />
      </main>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        onClick={() => navigate("/create")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-wine-red text-white rounded-full shadow-lg hover:bg-wine-light hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      >
        <Plus className="w-7 h-7" />
      </motion.button>
    </div>
  );
}
