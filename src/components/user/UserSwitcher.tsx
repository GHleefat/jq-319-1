import { useState } from "react";
import { ChevronDown, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import Avatar from "@/components/common/Avatar";
import { cn } from "@/lib/utils";

export default function UserSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { users, currentUserId, setCurrentUser, getCurrentUser } =
    useUserStore();
  const currentUser = getCurrentUser();

  const handleSelect = (userId: string) => {
    setCurrentUser(userId);
    setIsOpen(false);
  };

  if (!currentUser) return null;

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-ivory-dark/50 transition-colors"
        >
          <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-full mt-1 bg-white shadow-lg z-50 min-w-40 border border-charcoal/10"
            >
              <div className="p-2">
                <div className="text-xs text-charcoal/50 px-3 py-1 uppercase tracking-wider">
                  切换用户
                </div>
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-ivory-dark/30 transition-colors",
                      user.id === currentUserId && "bg-ivory-dark/50",
                    )}
                  >
                    <Avatar src={user.avatar} alt={user.name} size="sm" />
                    <span className="text-sm">{user.name}</span>
                    {user.id === currentUserId && (
                      <span className="ml-auto text-wine-red text-xs">
                        当前
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-charcoal/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-wine-red" />
        <span className="text-sm font-medium">当前身份</span>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-ivory hover:bg-ivory-dark/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" />
          <div className="text-left">
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-xs text-charcoal/50">点击切换身份</div>
          </div>
        </div>
        <ChevronDown
          className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-1">
              <div className="text-xs text-charcoal/40 px-3 py-1 uppercase tracking-wider">
                选择其他身份
              </div>
              {users
                .filter((u) => u.id !== currentUserId)
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-ivory-dark/30 transition-colors text-left"
                  >
                    <Avatar src={user.avatar} alt={user.name} size="sm" />
                    <span className="text-sm">{user.name}</span>
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
