import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Mail, UserPlus, LogIn } from "lucide-react";
import { useState, FormEvent, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

type MessageType = "error" | "success";

const ACCOUNT_PATTERN = /^[a-z0-9]+$/;
const EMAIL_PATTERN = /^[a-z0-9@.]+$/;

function normalizeAccountValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeEmailValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9@.]/g, "");
}

export default function AuthModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(
    null
  );
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { login, register } = useAuth();

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text });
  };

  const resetFeedback = () => setMessage(null);

  const handleTabChange = (nextTab: string) => {
    setTab(nextTab);
    resetFeedback();
  };

  const validateRegister = () => {
    if (registerForm.username.length < 5 || registerForm.username.length > 25) {
      return "Tên tài khoản phải từ 5-25 ký tự";
    }
    if (!ACCOUNT_PATTERN.test(registerForm.username)) {
      return "Tên tài khoản chỉ gồm chữ thường và số";
    }
    if (registerForm.password.length < 5 || registerForm.password.length > 25) {
      return "Mật khẩu phải từ 5-25 ký tự";
    }
    if (!ACCOUNT_PATTERN.test(registerForm.password)) {
      return "Mật khẩu chỉ gồm chữ thường và số";
    }
    if (!registerForm.email || !EMAIL_PATTERN.test(registerForm.email)) {
      return "Email không hợp lệ";
    }
    return null;
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    if (!loginForm.username || !loginForm.password) {
      showMessage("error", "Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    setIsLoading(true);
    const result = await login(loginForm);
    setIsLoading(false);
    showMessage(result.ok ? "success" : "error", result.message);
    if (result.ok) {
      setOpen(false);
      setLoginForm({ username: "", password: "" });
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    const validationError = validateRegister();
    if (validationError) {
      showMessage("error", validationError);
      return;
    }

    setIsLoading(true);
    const result = await register(registerForm);
    setIsLoading(false);
    showMessage(result.ok ? "success" : "error", result.message);
    if (result.ok) {
      setOpen(false);
      setRegisterForm({ username: "", email: "", password: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Tài khoản Rong Than Online</DialogTitle>
          <DialogDescription className="text-center">
            Đăng ký hoặc đăng nhập để sử dụng tài khoản trực tiếp trong game.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={handleTabChange} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="gap-2">
              <LogIn className="h-4 w-4" />
              Đăng Nhập
            </TabsTrigger>
            <TabsTrigger value="register" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Đăng Ký
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên tài khoản</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={loginForm.username}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        username: normalizeAccountValue(event.target.value),
                      }))
                    }
                    placeholder="Tên tài khoản game"
                    className="pl-10"
                    maxLength={25}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: normalizeAccountValue(event.target.value),
                      }))
                    }
                    placeholder="Mật khẩu game"
                    className="pl-10"
                    maxLength={25}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 pt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Tên tài khoản</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-username"
                    value={registerForm.username}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        username: normalizeAccountValue(event.target.value),
                      }))
                    }
                    placeholder="5-25 ký tự (a-z, 0-9)"
                    className="pl-10"
                    maxLength={25}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email khôi phục</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        email: normalizeEmailValue(event.target.value),
                      }))
                    }
                    placeholder="example@gmail.com"
                    className="pl-10"
                    maxLength={80}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        password: normalizeAccountValue(event.target.value),
                      }))
                    }
                    placeholder="5-25 ký tự (a-z, 0-9)"
                    className="pl-10"
                    maxLength={25}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Tạo Tài Khoản"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {message && (
          <div
            className={`rounded-md border px-3 py-2 text-sm ${
              message.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-600"
                : "border-red-500/30 bg-red-500/10 text-red-500"
            }`}
          >
            {message.text}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
