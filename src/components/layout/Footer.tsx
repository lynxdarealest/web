import { Gamepad2, Facebook, Youtube, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="h-[50px] bg-[#0a0a0e] flex items-center justify-center text-[12px] text-muted-foreground border-t border-border">
      <div className="container mx-auto px-4 text-center">
        © 2024 Ngoc Rong Online. Vui lòng không cung cấp mật khẩu cho người khác.
      </div>
    </footer>
  );
}
