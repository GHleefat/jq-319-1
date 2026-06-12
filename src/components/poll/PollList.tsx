import { usePollStore } from "@/store/usePollStore";
import PollCard from "./PollCard";

export default function PollList() {
  const { polls } = usePollStore();

  const activePolls = polls.filter(
    (p) => p.status === "active" && new Date(p.deadline) >= new Date(),
  );

  const endedPolls = polls.filter(
    (p) => p.status === "ended" || new Date(p.deadline) < new Date(),
  );

  return (
    <div className="space-y-12">
      {activePolls.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-wine-red" />
            <h2 className="font-display text-2xl">进行中的投票</h2>
            <span className="text-sm text-charcoal/50">
              {activePolls.length} 个
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePolls.map((poll, index) => (
              <PollCard key={poll.id} poll={poll} index={index} />
            ))}
          </div>
        </section>
      )}

      {endedPolls.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-charcoal/30" />
            <h2 className="font-display text-2xl">已结束</h2>
            <span className="text-sm text-charcoal/50">
              {endedPolls.length} 个
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {endedPolls.map((poll, index) => (
              <PollCard key={poll.id} poll={poll} index={index} />
            ))}
          </div>
        </section>
      )}

      {polls.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👗</div>
          <h3 className="font-display text-xl mb-2">还没有投票</h3>
          <p className="text-charcoal/50">创建你的第一个搭配投票吧！</p>
        </div>
      )}
    </div>
  );
}
