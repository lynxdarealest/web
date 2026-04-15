import { Button } from "@/components/ui/button";
import { Gamepad2, User, Menu, LogOut, Gem, Coins, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import AuthModal from "../AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const usernameInitials = useMemo(() => {
    if (!user?.username) {
      return "CB";
    }
    return user.username.substring(0, 2).toUpperCase();
  }, [user?.username]);

  return (
    <nav className="sticky top-0 z-50 w-full h-20 border-b-2 border-primary bg-gradient-to-r from-[#1a1a24] to-[#0d0d12] backdrop-blur">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-black tracking-widest text-primary uppercase">
            NGỌC RỒNG <span className="text-white">ONLINE</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Trang Chủ</a>
          <a href="#news" className="text-sm font-medium hover:text-primary transition-colors">Tin Tức</a>
          <a href="#download" className="text-sm font-medium hover:text-primary transition-colors">Tải Game</a>
          <a href="#topup" className="text-sm font-medium hover:text-primary transition-colors">Nạp Thẻ</a>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end leading-tight">
                <div className="text-xs font-bold text-primary flex items-center gap-1">
                  <Gem className="h-3 w-3" />
                  {user.diamond.toLocaleString("vi-VN")} Ngọc
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  {user.coin.toLocaleString("vi-VN")} Xu
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {usernameInitials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <User className="h-4 w-4" />
                    {user.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Wifi className="h-4 w-4" />
                    {user.online ? "Đang online trong game" : "Đang offline"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-destructive" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <AuthModal>
              <Button variant="default" className="gap-2">
                <User className="h-4 w-4" />
                Đăng Nhập
              </Button>
            </AuthModal>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4">
          <a href="#" className="text-sm font-medium">Trang Chủ</a>
          <a href="#news" className="text-sm font-medium">Tin Tức</a>
          <a href="#download" className="text-sm font-medium">Tải Game</a>
          <a href="#topup" className="text-sm font-medium">Nạp Thẻ</a>

          {user ? (
            <div className="flex flex-col gap-2 pt-2 border-t">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{usernameInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold">{user.username}</div>
                  <div className="text-xs text-muted-foreground">
                    Ngọc: {user.diamond.toLocaleString("vi-VN")} | Xu: {user.coin.toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          ) : (
            <AuthModal>
              <Button variant="default" className="w-full gap-2">
                <User className="h-4 w-4" />
                Đăng Nhập
              </Button>
            </AuthModal>
          )}
        </div>
      )}
    </nav>
  );
}
