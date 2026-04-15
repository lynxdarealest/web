import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Monitor, Laptop, Apple } from "lucide-react";

const DOWNLOAD_OPTIONS = [
  {
    platform: "Android",
    icon: Smartphone,
    version: "v2.3.0",
    size: "85 MB",
    description: "Tải bản APK chính thức cho các dòng máy Android.",
    color: "bg-green-500"
  },
  {
    platform: "PC / Windows",
    icon: Monitor,
    version: "v2.3.0",
    size: "120 MB",
    description: "Trải nghiệm mượt mà nhất trên máy tính Windows.",
    color: "bg-blue-500"
  },
  {
    platform: "iOS / iPhone",
    icon: Apple,
    version: "v2.3.0",
    size: "90 MB",
    description: "Dành cho các thiết bị iPhone và iPad.",
    color: "bg-slate-800"
  },
  {
    platform: "Java / J2ME",
    icon: Laptop,
    version: "v1.9.0",
    size: "2 MB",
    description: "Bản siêu nhẹ cho các dòng máy đời cũ.",
    color: "bg-orange-500"
  }
];

export default function DownloadSection() {
  return (
    <section id="download" className="py-12">
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Tải Game Ngay</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DOWNLOAD_OPTIONS.slice(0, 3).map((item) => (
          <div key={item.platform} className="bg-card border border-border p-4 rounded-lg text-center cursor-pointer hover:border-primary hover:bg-[#252533] transition-all group">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{item.platform}</span>
            <span className="text-sm font-bold block">{item.version} ({item.platform === "PC / Windows" ? "EXE" : item.platform === "Android" ? "APK" : "IPA"})</span>
          </div>
        ))}
      </div>
    </section>
  );
}
