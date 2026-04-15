import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Zap, Trophy, Gem } from "lucide-react";
import type { DashboardActivityItem } from "@/hooks/useDashboard";

interface LiveActivityProps {
  activities: DashboardActivityItem[];
}

export default function LiveActivity({ activities }: LiveActivityProps) {
  const [index, setIndex] = useState(0);

  const normalized = useMemo(() => activities.filter((item) => item && item.username), [activities]);

  useEffect(() => {
    setIndex(0);
  }, [normalized.length]);

  useEffect(() => {
    if (normalized.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % normalized.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [normalized.length]);

  if (normalized.length === 0) {
    return null;
  }

  const activity = normalized[index];
  const icon =
    activity.kind === "diamond" ? Gem : activity.kind === "coin" ? Trophy : Zap;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activity.id}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-[#1a1a24] border border-[#2c3e50] rounded-lg py-2 px-4 shadow-2xl flex items-center gap-3"
        >
          <div className="h-8 w-8 rounded bg-[#f39c12]/10 flex items-center justify-center text-[#f39c12]">
            {icon === Gem ? <Gem className="h-4 w-4" /> : icon === Trophy ? <Trophy className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
          </div>
          <div className="text-xs uppercase tracking-tight">
            <span className="font-black text-[#f39c12]">{activity.username}</span>
            <span className="mx-1 text-[#95a5a6]">{activity.action}</span>
            <span className="font-bold text-white">{activity.value}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
