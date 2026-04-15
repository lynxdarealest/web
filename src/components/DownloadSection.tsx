const DOWNLOAD_OPTIONS = [
  { platform: "Android", packageType: "APK", link: "#" },
  { platform: "PC / Windows", packageType: "EXE", link: "#" },
  { platform: "iOS / iPhone", packageType: "IPA", link: "#" },
];

export default function DownloadSection() {
  return (
    <section id="download" className="py-12">
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Tải Game Ngay</h2>
        <p className="text-muted-foreground mt-1 text-xs">Hiển thị đúng nền tảng phát hành, không dùng thông số giả.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DOWNLOAD_OPTIONS.map((item) => (
          <a
            key={item.platform}
            href={item.link}
            className="bg-card border border-border p-4 rounded-lg text-center cursor-pointer hover:border-primary hover:bg-[#252533] transition-all group"
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{item.platform}</span>
            <span className="text-sm font-bold block">Bản phát hành {item.packageType}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
