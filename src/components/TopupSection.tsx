import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { webApiFetch } from "@/lib/web-api";

function amountToDiamond(amount: number): number {
  if (amount >= 500000) return 100000;
  if (amount >= 200000) return 36000;
  if (amount >= 100000) return 16000;
  if (amount >= 50000) return 7200;
  if (amount >= 20000) return 2600;
  return 1200;
}

function amountToCoin(amount: number): number {
  return amount * 100;
}

export default function TopupSection() {
  const [isLoading, setIsLoading] = useState(false);
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

  const submitRecharge = async (payload: {
    diamond?: number;
    coin?: number;
    ruby?: number;
    note?: string;
  }) => {
    if (!user) {
      setFeedback({ ok: false, message: "Vui lòng đăng nhập để nạp tiền" });
      return false;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await webApiFetch<{
        message?: string;
        diamond?: number;
        coin?: number;
        ruby?: number;
      }>("/api/web/recharge", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await refreshMe();
      window.dispatchEvent(new Event("web:recharge-updated"));
      setFeedback({
        ok: true,
        message:
          typeof response.message === "string"
            ? response.message
            : "Nạp thành công, vui lòng vào game để kiểm tra",
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nạp thất bại, vui lòng thử lại";
      setFeedback({ ok: false, message });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopup = async (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const cardType = (form.elements.namedItem("card-type") as HTMLSelectElement).value;
    const amountStr = (form.elements.namedItem("card-value") as HTMLSelectElement).value;
    const amount = parseInt(amountStr.replace(/[^0-9]/g, ""), 10);
    const serial = (form.elements.namedItem("serial") as HTMLInputElement).value.trim();

    const ok = await submitRecharge({
      diamond: amountToDiamond(amount),
      note: `Nạp thẻ ${cardType} mệnh giá ${amount} - seri ${serial}`,
    });
    if (ok) {
      form.reset();
    }
  };

  const handleOnlinePayment = async (type: "momo" | "bank", amount: number) => {
    await submitRecharge({
      coin: amountToCoin(amount),
      note: `Nạp ${type.toUpperCase()} mệnh giá ${amount}`,
    });
  };

  return (
    <Card id="topup" className="bg-card border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Nạp Tài Nguyên</h2>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-[10px] text-muted-foreground uppercase">Liên kết game</span>
        </div>
      </div>

      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-background/50">
          <TabsTrigger value="card" className="text-[10px] uppercase">Thẻ Cào</TabsTrigger>
          <TabsTrigger value="bank" className="text-[10px] uppercase">Bank</TabsTrigger>
          <TabsTrigger value="momo" className="text-[10px] uppercase">Momo</TabsTrigger>
        </TabsList>

        <TabsContent value="card">
          <form onSubmit={handleTopup} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="card-type" className="text-[10px] text-muted-foreground uppercase">Loại thẻ</Label>
              <select id="card-type" className="w-full bg-background border border-border p-2 rounded text-sm outline-none">
                <option>Viettel</option>
                <option>Vinaphone</option>
                <option>Mobifone</option>
                <option>Zing</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="card-value" className="text-[10px] text-muted-foreground uppercase">Mệnh giá</Label>
              <select id="card-value" className="w-full bg-background border border-border p-2 rounded text-sm outline-none">
                <option>10.000đ</option>
                <option>20.000đ</option>
                <option>50.000đ</option>
                <option>100.000đ</option>
                <option>200.000đ</option>
                <option>500.000đ</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="serial" className="text-[10px] text-muted-foreground uppercase">Số Seri</Label>
              <Input id="serial" placeholder="Nhập số seri" required className="bg-background border-border h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pin" className="text-[10px] text-muted-foreground uppercase">Mã thẻ</Label>
              <Input id="pin" placeholder="Nhập mã thẻ" required className="bg-background border-border h-9 text-sm" />
            </div>
            <Button type="submit" className="w-full font-bold uppercase text-xs h-10 bg-primary text-black hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Nạp Ngay"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <div className="bg-background/50 p-4 rounded-lg border border-border space-y-3">
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ngân hàng:</span>
                <span className="font-bold">MB Bank</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Số tài khoản:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">123456789</span>
                  <Copy className="h-3 w-3 cursor-pointer hover:text-primary" onClick={() => void copyToClipboard("123456789")} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nội dung:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-primary">NAP {user?.username || "TAIKHOAN"}</span>
                  <Copy className="h-3 w-3 cursor-pointer hover:text-primary" onClick={() => void copyToClipboard(`NAP ${user?.username || ""}`)} />
                </div>
              </div>
            </div>
          </div>
          <Button
            className="w-full font-bold uppercase text-xs h-10 bg-primary text-black"
            onClick={() => void handleOnlinePayment("bank", 50000)}
            disabled={isLoading}
          >
            Xác nhận đã chuyển
          </Button>
        </TabsContent>

        <TabsContent value="momo" className="space-y-4">
          <div className="bg-background/50 p-4 rounded-lg border border-border space-y-3">
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ví điện tử:</span>
                <span className="font-bold text-[#A50064]">MoMo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">0987654321</span>
                  <Copy className="h-3 w-3 cursor-pointer hover:text-primary" onClick={() => void copyToClipboard("0987654321")} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nội dung:</span>
                <span className="font-bold text-primary">NAP {user?.username || "TAIKHOAN"}</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full font-bold uppercase text-xs h-10 bg-[#A50064] text-white hover:bg-[#80004d]"
            onClick={() => void handleOnlinePayment("momo", 50000)}
            disabled={isLoading}
          >
            Xác nhận đã chuyển
          </Button>
        </TabsContent>
      </Tabs>

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
