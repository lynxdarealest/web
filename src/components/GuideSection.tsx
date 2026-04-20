import { useMemo, useState } from "react";
import { BookOpenText, MapPinned, Search, TerminalSquare } from "lucide-react";

import { MAP_TEMPLATES } from "@/lib/mapTemplates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type StatusFilter = "ALL" | "ONLINE" | "OFFLINE";

const EVENT_GUIDE_STEPS = [
  "Gõ `hv` để nhận hộ tống Mị Nương khi sự kiện Hùng Vương mở.",
  "Hạ quái để nhặt nguyên liệu sự kiện và tích điểm đổi quà.",
  "Hoàn thành nhiệm vụ ngày để tăng tốc nhận mốc thưởng sự kiện.",
  "Dùng điểm sự kiện tại mục Đổi điểm để lấy vật phẩm hiếm.",
];

const USER_COMMANDS = [
  {
    syntax: "gm<ID_MAP>",
    example: "gm4",
    description: "Bay nhanh tới map theo ID. Ví dụ `gm4` sẽ bay tới map ID 4 (Đồi hoang Aka).",
  },
  {
    syntax: "idht",
    example: "idht",
    description: "Hiển thị ID toàn bộ vật phẩm đang có trong hành trang.",
  },
  {
    syntax: "xoaht",
    example: "xoaht",
    description: "Xóa toàn bộ vật phẩm trong hành trang.",
  },
];

export default function GuideSection() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [planetFilter, setPlanetFilter] = useState("ALL");

  const planets = useMemo(() => {
    const allPlanets = Array.from(new Set(MAP_TEMPLATES.map((map) => map.planet))).sort();
    return ["ALL", ...allPlanets];
  }, []);

  const maps = useMemo(() => {
    const sorted = [...MAP_TEMPLATES].sort((a, b) => a.id - b.id);
    const query = keyword.trim().toLowerCase();

    return sorted.filter((map) => {
      const statusMatched = statusFilter === "ALL" || map.status === statusFilter;
      const planetMatched = planetFilter === "ALL" || map.planet === planetFilter;
      const queryMatched =
        query.length === 0 ||
        map.name.toLowerCase().includes(query) ||
        String(map.id).includes(query) ||
        map.planet.toLowerCase().includes(query);

      return statusMatched && planetMatched && queryMatched;
    });
  }, [keyword, planetFilter, statusFilter]);

  return (
    <section id="guide" className="py-12 space-y-6">
      <div>
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">HƯỚNG DẪN NGƯỜI CHƠI</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Tổng hợp sự kiện, lệnh người chơi và danh sách map ID lấy từ dữ liệu server.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="border border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenText className="h-4 w-4 text-primary" />
              Hướng Dẫn Sự Kiện
            </CardTitle>
            <CardDescription>Áp dụng cho chuỗi sự kiện Hùng Vương đang chạy.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-xs text-muted-foreground">
              {EVENT_GUIDE_STEPS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <Badge variant="secondary" className="min-w-5 justify-center px-1.5">
                    {index + 1}
                  </Badge>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="border border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TerminalSquare className="h-4 w-4 text-primary" />
              Lệnh Người Chơi Có Thể Dùng
            </CardTitle>
            <CardDescription>Dùng trực tiếp trong chat ingame.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {USER_COMMANDS.map((command) => (
              <div key={command.syntax} className="rounded-lg border border-border/70 bg-muted/20 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{command.syntax}</Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Ví dụ: <code className="font-mono">{command.example}</code>
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{command.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-primary" />
            Danh Sách ID Map
          </CardTitle>
          <CardDescription>Tìm nhanh theo ID map, tên map hoặc hành tinh.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Nhập id, tên map hoặc hành tinh..."
                className="pl-8"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["ALL", "ONLINE", "OFFLINE"] as StatusFilter[]).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {planets.map((planet) => (
                <Button
                  key={planet}
                  size="sm"
                  variant={planetFilter === planet ? "default" : "outline"}
                  onClick={() => setPlanetFilter(planet)}
                >
                  {planet}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Tổng map hiển thị: {maps.length}</div>

          <div className="max-h-[480px] overflow-auto rounded-lg border border-border/80">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-semibold">ID</th>
                  <th className="px-3 py-2 text-left font-semibold">Tên map</th>
                  <th className="px-3 py-2 text-left font-semibold">Hành tinh</th>
                  <th className="px-3 py-2 text-left font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {maps.map((map) => (
                  <tr key={`${map.id}-${map.name}`} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono">{map.id}</td>
                    <td className="px-3 py-2">{map.name}</td>
                    <td className="px-3 py-2">{map.planet}</td>
                    <td className="px-3 py-2">
                      <Badge variant={map.status === "ONLINE" ? "default" : "outline"}>{map.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
