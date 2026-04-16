import { Card, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { webApiFetch } from "@/lib/web-api";

interface EventItem {
  title: string;
  description: string;
}

interface EventsResponse {
  events?: EventItem[];
}

const DEFAULT_EVENT_GUIDE: EventItem[] = [
  {
    title: "Giới thiệu sự kiện Giỗ tổ Hùng Vương",
    description:
      "Đồng hành cùng Vua Hùng, thu thập lễ vật để mở quà hiếm, đua TOP và đổi điểm nhận vật phẩm giá trị.",
  },
  {
    title: "Cơ chế tham gia",
    description:
      "1) Gõ hv để nhận hộ tống Mị Nương.\n2) Hạ quái nhận Voi 9 ngà, làm nhiệm vụ ngày nhận Gà 9 cựa.\n3) Hoàn thành hộ tống nhận Ngựa 9 hồng mao.\n4) Chế tạo Lễ vật thường/đặc biệt để mở quà và tích điểm.",
  },
  {
    title: "Cơ chế nạp và đổi quà",
    description:
      "Mỗi 700 Kim cương nạp hoặc được tặng sẽ nhận 1 Capsule Hùng Vương. Điểm sự kiện dùng tại mục Đổi điểm để mua quà.",
  },
];

export default function NewsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await webApiFetch<EventsResponse>("/api/web/events");
        const serverEvents = Array.isArray(response.events) ? response.events : [];
        setEvents(serverEvents.length > 0 ? serverEvents : DEFAULT_EVENT_GUIDE);
      } catch (_error) {
        setEvents(DEFAULT_EVENT_GUIDE);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <section id="news" className="py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase">TIN TỨC & SỰ KIỆN</h2>
          <p className="text-muted-foreground mt-1 text-xs">Dữ liệu lấy trực tiếp từ máy chủ game.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Đang tải dữ liệu...</p>
      ) : events.length === 0 ? (
        <p className="text-xs text-muted-foreground">Chưa có bản tin mới.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((item, index) => (
            <Card
              key={`${item.title}-${index}`}
              className="overflow-hidden group hover:border-primary transition-all border border-border bg-card p-0 flex flex-row min-h-24"
            >
              <div className="flex flex-col justify-center p-4 flex-grow">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                  <Calendar className="h-3 w-3" />
                  Tin từ hệ thống
                </div>
                <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </CardTitle>
                <p className="mt-2 text-xs text-muted-foreground whitespace-pre-line">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
