import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import type { DashboardLeaderboardItem } from "@/hooks/useDashboard";

interface LeaderboardProps {
  data: DashboardLeaderboardItem[];
  loading: boolean;
}

export default function Leaderboard({ data, loading }: LeaderboardProps) {
  return (
    <Card className="bg-card border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Bảng Xếp Hạng</h2>
        <Trophy className="h-4 w-4 text-primary" />
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Đang tải dữ liệu thật...</p>
      ) : data.length === 0 ? (
        <p className="text-xs text-muted-foreground">Chưa có dữ liệu xếp hạng.</p>
      ) : (
        <div className="space-y-4">
          {data.map((user, index) => (
            <div key={`${user.rank}-${user.name}`} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-black"
                      : index === 1
                      ? "bg-gray-400 text-black"
                      : index === 2
                      ? "bg-amber-600 text-black"
                      : "bg-background border border-border text-muted-foreground"
                  }`}
                >
                  {user.rank}
                </div>
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs font-bold group-hover:text-primary transition-colors">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                    Sức mạnh: {user.power.toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-primary">Lv {user.level}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
