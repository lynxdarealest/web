import { Button } from "@/components/ui/button";
import { Download, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import type { DashboardStats } from "@/hooks/useDashboard";

interface HeroProps {
  stats: DashboardStats;
  loading: boolean;
}

function formatStat(value: number, loading: boolean): string {
  if (loading) {
    return "...";
  }
  return value.toLocaleString("vi-VN");
}

export default function Hero({ stats, loading }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a24]/80 to-[#0d0d12]/40 border border-border rounded-xl p-10">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-primary leading-tight uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                RONG THAN <br />
                <span className="text-white">ONLINE CHÍNH THỨC</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                Đăng nhập, tạo tài khoản, nạp tiền và theo dõi sự kiện trực tiếp tại vercel.lynxphg.me. Tất cả dữ liệu đồng bộ với máy chủ game.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg gap-2 shadow-lg shadow-primary/20"
                onClick={() => document.getElementById("download")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Download className="h-5 w-5" />
                Tải Game Ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg gap-2"
                onClick={() => document.getElementById("news")?.scrollIntoView({ behavior: "smooth" })}
              >
                <PlayCircle className="h-5 w-5" />
                Xem Tin Tức
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-8 pt-4"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{formatStat(stats.totalAccounts, loading)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Tài khoản</div>
              </div>
              <div className="border-l h-8" />
              <div className="text-center">
                <div className="text-2xl font-bold">{formatStat(stats.totalCharacters, loading)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Nhân vật</div>
              </div>
              <div className="border-l h-8" />
              <div className="text-center">
                <div className="text-2xl font-bold">{formatStat(stats.onlineCharacters, loading)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Đang Online</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
              <motion.img
                src="/images/hero-bgr.png"
                alt="Rong Than Online"
                className="w-full h-auto object-cover"
                animate={{
                  scale: [1, 1.08, 1],
                  x: [0, -18, 0],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-30%", "220%"] }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  repeatDelay: 1.1,
                  ease: "linear",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <div className="text-sm font-medium uppercase tracking-widest opacity-80">Giao dịch ZaloPay hôm nay</div>
                  <div className="text-2xl font-bold">{formatStat(stats.rechargeToday, loading)} lượt nạp</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-xl animate-bounce">
              <span className="text-3xl">⭐</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
