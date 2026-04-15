import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { webApiFetch } from "@/lib/web-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, AlertCircle, Landmark, Gem, Coins } from "lucide-react";

interface Transaction {
  id: number;
  diamond: number;
  coin: number;
  ruby: number;
  reason: string;
  adminName: string;
  createTime: number | string | null;
}

function formatDate(value: number | string | null): string {
  if (value === null || value === undefined) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString("vi-VN");
}

function formatRewards(item: Transaction): string {
  const parts: string[] = [];
  if (item.diamond > 0) {
    parts.push(`+${item.diamond.toLocaleString("vi-VN")} ngọc`);
  }
  if (item.coin > 0) {
    parts.push(`+${item.coin.toLocaleString("vi-VN")} xu`);
  }
  if (item.ruby > 0) {
    parts.push(`+${item.ruby.toLocaleString("vi-VN")} ruby`);
  }
  return parts.length > 0 ? parts.join(" | ") : "Không có dữ liệu";
}

export default function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await webApiFetch<{ history?: Transaction[] }>(
        "/api/web/recharge-history?limit=20"
      );
      setTransactions(Array.isArray(response.history) ? response.history : []);
    } catch (_error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const onUpdated = () => {
      void loadHistory();
    };
    window.addEventListener("web:recharge-updated", onUpdated);
    return () => window.removeEventListener("web:recharge-updated", onUpdated);
  }, [loadHistory]);

  if (!user) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="flex items-center gap-2 mb-8">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Lịch sử nạp gần đây</h2>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Đang tải...</div>
      ) : transactions.length === 0 ? (
        <Card className="bg-card border-border border-dashed p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Bạn chưa có giao dịch nào.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <Card key={tx.id} className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-background border border-border flex items-center justify-center text-primary">
                    {tx.diamond > 0 ? (
                      <Gem className="h-5 w-5" />
                    ) : tx.coin > 0 ? (
                      <Coins className="h-5 w-5" />
                    ) : (
                      <Landmark className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-tight">Nạp tài nguyên</div>
                    <div className="text-[10px] text-muted-foreground">{formatDate(tx.createTime)}</div>
                    <div className="text-[10px] text-muted-foreground italic">{tx.reason || "Nạp từ web"}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-8 flex-grow">
                  <div className="text-right">
                    <div className="text-sm font-black text-primary">{formatRewards(tx)}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">Phần thưởng</div>
                  </div>
                  <div className="min-w-[100px] flex justify-end">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Thành công
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
