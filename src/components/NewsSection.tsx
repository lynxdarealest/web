import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

const NEWS_DATA = [
  {
    id: 1,
    title: "Cập nhật phiên bản 2.3.0: Thức tỉnh bản năng vô cực",
    date: "15/04/2024",
    category: "Cập nhật",
    image: "/images/news-1.png"
  },
  {
    id: 2,
    title: "Sự kiện Tết Nguyên Đán: Thu thập bao lì xì, đổi quà cực khủng",
    date: "10/04/2024",
    category: "Sự kiện",
    image: "/images/news-2.png"
  },
  {
    id: 3,
    title: "Mở máy chủ mới: Vũ Trụ 15 - Nhận ngay gói quà tân thủ",
    date: "05/04/2024",
    category: "Máy chủ",
    image: "/images/news-3.png"
  }
];

export default function NewsSection() {
  return (
    <section id="news" className="py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase">TIN TỨC & SỰ KIỆN</h2>
          <p className="text-muted-foreground mt-1 text-xs">Cập nhật những thông tin mới nhất từ thế giới Ngọc Rồng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {NEWS_DATA.map((item) => (
          <Card key={item.id} className="overflow-hidden group cursor-pointer hover:border-primary transition-all border border-border bg-card p-0 flex flex-row h-32">
            <div className="relative w-40 overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col justify-center p-4 flex-grow">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                <Calendar className="h-3 w-3" />
                {item.date}
                <span className="text-primary font-bold">• {item.category}</span>
              </div>
              <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </CardTitle>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
