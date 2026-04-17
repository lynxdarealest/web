import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { webApiFetch } from "@/lib/web-api";

function amountToCoin(amount: number): number {
  return amount * 100;
}

interface TopupProfile {
  provider: string;
  transferContent: string;
  accountNumber: string;
  accountName: string;
  topupCode: string;
  qrImageUrl: string;
}

const ZALOPAY_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];
const ZALOPAY_WALLET = "0876522271";
const ZALOPAY_OWNER = "NGUYEN TO DUC TRUONG";

export default function TopupSection() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [topupAmount, setTopupAmount] = useState(50000);
  const [topupProfile, setTopupProfile] = useState<TopupProfile | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const { user } = useAuth();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback({ ok: true, message: `Đã sao chép: ${text}` });
    } catch (_error) {
      setFeedback({ ok: false, message: "Không sao chép được nội dung" });
    }
  };

  useEffect(() => {
    if (!user) {
      setTopupProfile(null);
      return;
    }

    const loadTopupProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await webApiFetch<TopupProfile>("/api/web/bank-topup/profile");
        setTopupProfile(response);
      } catch (error) {
        setTopupProfile(null);
        setFeedback({
          ok: false,
          message: error instanceof Error ? error.message : "Không tải được thông tin QR nạp",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void loadTopupProfile();
  }, [user?.userId]);

  const transferContent = topupProfile?.transferContent || "";

  return (
    <Card id="topup" className="bg-card border-border rounded-xl p-4 sm:p-6 space-y-5 overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Nạp qua QR</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Mỗi tài khoản có một mã nạp cố định 6 số, không trùng nhau. Vui lòng chuyển khoản đúng nội dung để hệ thống đối soát.
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-[10px] text-muted-foreground uppercase">QR cố định</span>
        </div>
      </div>

      <div className="bg-background/50 p-4 rounded-lg border border-border space-y-4">
        <div className="space-y-1">
          <Label htmlFor="zalopay-amount" className="text-[10px] text-muted-foreground uppercase">
            Số tiền chuyển
          </Label>
          <select
            id="zalopay-amount"
            value={topupAmount}
            onChange={(event) => setTopupAmount(Number(event.target.value))}
            className="w-full bg-background border border-border p-2 rounded text-sm outline-none"
          >
            {ZALOPAY_AMOUNTS.map((amount) => (
              <option key={amount} value={amount}>
                {amount.toLocaleString("vi-VN")}đ
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">
            Nhận dự kiến: <span className="font-bold text-primary">+{amountToCoin(topupAmount).toLocaleString("vi-VN")} xu</span>
          </p>
        </div>

        {user && topupProfile && (
          <div className="rounded-lg border border-border bg-background/70 p-3 flex justify-center">
            <img
              src={topupProfile.qrImageUrl}
              alt="Mã QR nạp tiền"
              className="w-full max-w-[260px] rounded-lg border border-border"
              loading="lazy"
            />
          </div>
        )}

        <div className="rounded-lg border border-dashed border-primary/30 bg-background/60 p-3 sm:p-4 space-y-2 text-[11px]">
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">Ví nhận tiền:</span>
            <span className="font-bold text-[#0068FF]">{topupProfile?.provider || "ZaloPay"}</span>
          </div>
          <div className="flex justify-between items-start gap-3">
            <span className="text-muted-foreground">Số ví / tài khoản:</span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold break-all text-right">{topupProfile?.accountNumber || ZALOPAY_WALLET}</span>
              <Copy
                className="h-3 w-3 cursor-pointer hover:text-primary shrink-0"
                onClick={() => void copyToClipboard(topupProfile?.accountNumber || ZALOPAY_WALLET)}
              />
            </div>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-muted-foreground">Chủ ví:</span>
            <span className="font-bold text-right break-words">{topupProfile?.accountName || ZALOPAY_OWNER}</span>
          </div>
          <div className="flex justify-between items-start gap-3">
            <span className="text-muted-foreground">Nội dung nạp:</span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-primary break-all text-right">{transferContent || "Đăng nhập để lấy mã nạp"}</span>
              <Copy
                className="h-3 w-3 cursor-pointer hover:text-primary shrink-0"
                onClick={() => void copyToClipboard(transferContent)}
              />
            </div>
          </div>
          {topupProfile && (
            <>
              <div className="flex justify-between items-center gap-4">
                <span className="text-muted-foreground">ID nạp cố định:</span>
                <span className="font-bold">{topupProfile.topupCode}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-muted-foreground">Nhận:</span>
                <span className="font-bold text-primary">+{amountToCoin(topupAmount).toLocaleString("vi-VN")} xu</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full min-w-0 !shrink !whitespace-normal break-words text-center leading-tight font-bold text-[11px] sm:text-xs min-h-10 h-auto py-2 bg-[#0068FF] text-white hover:bg-[#0050c7]"
            onClick={() => void copyToClipboard(transferContent)}
            disabled={!user || !topupProfile || !transferContent}
          >
            Sao chép chính xác nội dung nạp
          </Button>
          <Button
            variant="outline"
            className="w-full min-w-0 !shrink !whitespace-normal break-words text-center leading-tight font-bold text-[11px] sm:text-xs min-h-10 h-auto py-2"
            onClick={() => void copyToClipboard(topupProfile?.accountNumber || ZALOPAY_WALLET)}
            disabled={!user || !topupProfile}
          >
            Sao chép số ví nhận tiền
          </Button>
        </div>

        {!user && (
          <p className="text-xs text-muted-foreground">Vui lòng đăng nhập để lấy mã QR và nội dung nạp cá nhân của bạn.</p>
        )}

        {user && isLoadingProfile && (
          <p className="text-xs text-muted-foreground">Đang tải thông tin QR nạp...</p>
        )}
      </div>

      {feedback && (
        <p
          className={`mt-4 text-center text-xs font-medium ${
            feedback.ok ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </Card>
  );
}
