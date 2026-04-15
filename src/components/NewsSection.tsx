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

export default function NewsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await webApiFetch<EventsResponse>("/api/web/events");
        setEvents(Array.isArray(response.events) ? response.events : []);
      } catch (_error) {
        setEvents([]);
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
                <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
