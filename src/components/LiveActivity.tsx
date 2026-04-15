import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { User, Zap, Trophy } from "lucide-react";

const ACTIVITIES = [
  { id: 1, user: "Goku99", action: "vừa nạp", amount: "50,000đ", icon: Zap },
  { id: 2, user: "Vegeta_Sama", action: "đạt cấp", amount: "150", icon: Trophy },
  { id: 3, user: "Krillin_VN", action: "vừa nạp", amount: "20,000đ", icon: Zap },
  { id: 4, user: "Bulma_Tech", action: "vừa nạp", amount: "100,000đ", icon: Zap },
  { id: 5, user: "Piccolo_JR", action: "đạt cấp", amount: "120", icon: Trophy },
];

export default function LiveActivity() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const activity = ACTIVITIES[index];

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-[#1a1a24] border border-[#2c3e50] rounded-lg py-2 px-4 shadow-2xl flex items-center gap-3"
        >
          <div className="h-8 w-8 rounded bg-[#f39c12]/10 flex items-center justify-center text-[#f39c12]">
            <activity.icon className="h-4 w-4" />
          </div>
          <div className="text-xs uppercase tracking-tight">
            <span className="font-black text-[#f39c12]">{activity.user}</span>
            <span className="mx-1 text-[#95a5a6]">{activity.action}</span>
            <span className="font-bold text-white">{activity.amount}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
