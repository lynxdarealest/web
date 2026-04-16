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

interface TopupRequest {
  requestCode: string;
  amount: number;
  coin: number;
  transferContent: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: number;
  statusText: "pending" | "paid" | "expired" | "canceled";
  expiredTime: number | null;
  paidTime: number | null;
}

const ZALOPAY_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

export default function TopupSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [topupAmount, setTopupAmount] = useState(50000);
  const [topupRequest, setTopupRequest] = useState<TopupRequest | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const { user, refreshMe } = useAuth();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback({ ok: true, message: `Đã sao chép: ${text}` });
    } catch (_error) {
      setFeedback({ ok: false, message: "Không sao chép được nội dung" });
    }
  };

  const refreshZaloPayStatus = async (requestCodeParam?: string) => {
    const requestCode = requestCodeParam || topupRequest?.requestCode;
    if (!requestCode) {
      return;
    }
    try {
      setIsCheckingStatus(true);
      const response = await webApiFetch<{ request?: TopupRequest }>(
        `/api/web/bank-topup/request/${requestCode}`
      );
      if (!response.request) {
        return;
      }
      setTopupRequest(response.request);
      if (response.request.statusText === "paid") {
        setFeedback({
          ok: true,
          message: `Nạp ZaloPay thành công (+${response.request.coin.toLocaleString("vi-VN")} xu)`,
        });
        await refreshMe();
        window.dispatchEvent(new Event("web:recharge-updated"));
      } else if (response.request.statusText === "expired") {
        setFeedback({
          ok: false,
          message: "Lệnh ZaloPay đã hết hạn, vui lòng tạo lệnh mới",
        });
      }
    } catch (error) {
      setFeedback({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Không kiểm tra được trạng thái ZaloPay",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (!topupRequest || topupRequest.statusText !== "pending") {
      return;
    }
    const timer = window.setInterval(() => {
      void refreshZaloPayStatus(topupRequest.requestCode);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [topupRequest?.requestCode, topupRequest?.statusText]);

  const createZaloPayRequest = async () => {
    if (!user) {
      setFeedback({ ok: false, message: "Vui lòng đăng nhập để nạp ZaloPay" });
      return;
    }
    setFeedback(null);
    setIsLoading(true);
    try {
      const response = await webApiFetch<{ request?: TopupRequest; message?: string }>(
        "/api/web/bank-topup/request",
        {
          method: "POST",
          body: JSON.stringify({ amount: topupAmount }),
        }
      );
      if (response.request) {
        setTopupRequest(response.request);
      }
      setFeedback({
        ok: true,
        message:
          response.message || "Đã tạo lệnh ZaloPay. Hệ thống sẽ tự xác nhận khi tiền vào ví.",
      });
    } catch (error) {
      setFeedback({
        ok: false,
        message: error instanceof Error ? error.message : "Không tạo được lệnh ZaloPay",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card id="topup" className="bg-card border-border rounded-xl p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Nạp ZaloPay</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Chuyển khoản vào ví ZaloPay được hệ thống chỉ định. Khi tiền vào ví, lệnh sẽ tự chuyển sang đã nạp.
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-[10px] text-muted-foreground uppercase">Tự động xác nhận</span>
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
        </div>

        <div className="rounded-lg border border-dashed border-primary/30 bg-background/60 p-4 space-y-2 text-[11px]">
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">Ví nhận tiền:</span>
            <span className="font-bold text-[#0068FF]">ZaloPay</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">Số ví / tài khoản:</span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold truncate">{topupRequest?.accountNumber || "Tạo lệnh để nhận số ví"}</span>
              <Copy
                className="h-3 w-3 cursor-pointer hover:text-primary shrink-0"
                onClick={() => void copyToClipboard(topupRequest?.accountNumber || "")}
              />
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">Chủ ví:</span>
            <span className="font-bold">{topupRequest?.accountName || "Tạo lệnh để nhận tên"}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">Nội dung:</span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-primary truncate">{topupRequest?.transferContent || "Tạo lệnh để nhận mã nạp"}</span>
              <Copy
                className="h-3 w-3 cursor-pointer hover:text-primary shrink-0"
                onClick={() => void copyToClipboard(topupRequest?.transferContent || "")}
              />
            </div>
          </div>
          {topupRequest && (
            <>
              <div className="flex justify-between items-center gap-4">
                <span className="text-muted-foreground">Mã lệnh:</span>
                <span className="font-bold">{topupRequest.requestCode}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-muted-foreground">Nhận:</span>
                <span className="font-bold text-primary">+{topupRequest.coin.toLocaleString("vi-VN")} xu</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span
                  className={`font-bold ${
                    topupRequest.statusText === "paid"
                      ? "text-green-500"
                      : topupRequest.statusText === "expired"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {topupRequest.statusText === "paid"
                    ? "Đã nạp xong"
                    : topupRequest.statusText === "expired"
                    ? "Đã hết hạn"
                    : "Đang chờ tiền vào ví ZaloPay"}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 font-bold uppercase text-xs h-10 bg-[#0068FF] text-white hover:bg-[#0050c7]"
            onClick={() => void createZaloPayRequest()}
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo..." : "Tạo lệnh ZaloPay"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 font-bold uppercase text-xs h-10"
            onClick={() => void refreshZaloPayStatus()}
            disabled={isCheckingStatus || !topupRequest}
          >
            {isCheckingStatus ? "Đang kiểm tra..." : "Kiểm tra trạng thái"}
          </Button>
        </div>
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
