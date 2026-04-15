import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { webApiFetch } from "@/lib/web-api";

export interface PortalUser {
  userId: number;
  username: string;
  online: boolean;
  diamond: number;
  coin: number;
  ruby: number;
  level: number;
}

interface AuthActionResult {
  ok: boolean;
  message: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  password: string;
  email: string;
}

interface AuthContextType {
  user: PortalUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthActionResult>;
  register: (payload: RegisterPayload) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

interface MeResponse {
  status?: string;
  userId?: number;
  username?: string;
  online?: boolean;
  diamond?: number;
  coin?: number;
  ruby?: number;
  level?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return "Có lỗi kết nối, vui lòng thử lại";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const data = await webApiFetch<MeResponse>("/api/web/me");
      if (data.status === "guest") {
        setUser(null);
        return;
      }

      setUser({
        userId: toNumber(data.userId),
        username: String(data.username ?? ""),
        online: Boolean(data.online),
        diamond: toNumber(data.diamond),
        coin: toNumber(data.coin),
        ruby: toNumber(data.ruby),
        level: toNumber(data.level, 1),
      });
    } catch (_error) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    };
    void boot();
  }, [refreshMe]);

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthActionResult> => {
      try {
        const data = await webApiFetch<{ message?: string }>("/api/web/login", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        await refreshMe();
        return {
          ok: true,
          message:
            typeof data.message === "string" ? data.message : "Đăng nhập thành công",
        };
      } catch (error) {
        return { ok: false, message: getErrorMessage(error) };
      }
    },
    [refreshMe]
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthActionResult> => {
      try {
        const data = await webApiFetch<{ message?: string }>("/api/web/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        await refreshMe();
        return {
          ok: true,
          message:
            typeof data.message === "string" ? data.message : "Đăng ký thành công",
        };
      } catch (error) {
        return { ok: false, message: getErrorMessage(error) };
      }
    },
    [refreshMe]
  );

  const logout = useCallback(async () => {
    try {
      await webApiFetch("/api/web/logout", { method: "POST" });
    } catch (_error) {
      // Ignore network errors when logging out, client state is still reset.
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
