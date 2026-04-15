import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from "lucide-react";

const LEADERBOARD = [
  { rank: 1, name: "SonGoku_SSJ", level: 250, power: "99,999,999", avatar: "SG" },
  { rank: 2, name: "Vegeta_Prince", level: 248, power: "98,500,000", avatar: "VG" },
  { rank: 3, name: "Gohan_Beast", level: 245, power: "95,000,000", avatar: "GH" },
  { rank: 4, name: "Trunks_Future", level: 230, power: "88,000,000", avatar: "TR" },
  { rank: 5, name: "Piccolo_Orange", level: 225, power: "85,000,000", avatar: "PC" },
];

export default function Leaderboard() {
  return (
    <Card className="bg-card border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Bảng Xếp Hạng</h2>
        <Trophy className="h-4 w-4 text-primary" />
      </div>

      <div className="space-y-4">
        {LEADERBOARD.map((user, index) => (
          <div key={user.rank} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                index === 0 ? "bg-yellow-500 text-black" : 
                index === 1 ? "bg-gray-400 text-black" : 
                index === 2 ? "bg-amber-600 text-black" : "bg-background border border-border text-muted-foreground"
              }`}>
                {index + 1}
              </div>
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{user.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xs font-bold group-hover:text-primary transition-colors">{user.name}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">Sức mạnh: {user.power}</div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-primary">{user.level}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
