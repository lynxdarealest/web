const DOWNLOAD_OPTIONS = [
  { platform: "Android", packageType: "APK", label: "Đang cập nhật" },
  { platform: "PC / Windows", packageType: "EXE", label: "Đang cập nhật" },
  { platform: "iOS / iPhone", packageType: "IPA", label: "Đang cập nhật" },
];

export default function DownloadSection() {
  return (
    <section id="download" className="py-12">
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Tải Game Ngay</h2>
        <p className="text-muted-foreground mt-1 text-xs">Các bản phát hành sẽ được cập nhật ngay khi có file cài đặt chính thức.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DOWNLOAD_OPTIONS.map((item) => (
          <div
            key={item.platform}
            className="bg-card border border-border p-4 rounded-lg text-center cursor-pointer hover:border-primary hover:bg-[#252533] transition-all group"
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{item.platform}</span>
            <span className="text-sm font-bold block">Bản phát hành {item.packageType}</span>
            <span className="mt-2 inline-flex rounded-full border border-border px-2 py-1 text-[10px] uppercase text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
