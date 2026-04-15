import { useCallback, useEffect, useState } from "react";
import { webApiFetch } from "@/lib/web-api";

export interface DashboardStats {
  totalAccounts: number;
  totalCharacters: number;
  onlineCharacters: number;
  rechargeToday: number;
}

export interface DashboardLeaderboardItem {
  rank: number;
  name: string;
  power: number;
  level: number;
  avatar: string;
}

export interface DashboardActivityItem {
  id: number;
  username: string;
  action: string;
  value: string;
  kind: "diamond" | "coin" | "ruby";
  createTime: number | null;
}

export interface DashboardData {
  stats: DashboardStats;
  leaderboard: DashboardLeaderboardItem[];
  activities: DashboardActivityItem[];
}

interface DashboardResponse {
  status?: string;
  stats?: Partial<DashboardStats>;
  leaderboard?: DashboardLeaderboardItem[];
  activities?: DashboardActivityItem[];
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
}

const EMPTY_DATA: DashboardData = {
  stats: {
    totalAccounts: 0,
    totalCharacters: 0,
    onlineCharacters: 0,
    rechargeToday: 0,
  },
  leaderboard: [],
  activities: [],
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await webApiFetch<DashboardResponse>("/api/web/dashboard");
      const nextData: DashboardData = {
        stats: {
          totalAccounts: toNumber(response.stats?.totalAccounts),
          totalCharacters: toNumber(response.stats?.totalCharacters),
          onlineCharacters: toNumber(response.stats?.onlineCharacters),
          rechargeToday: toNumber(response.stats?.rechargeToday),
        },
        leaderboard: Array.isArray(response.leaderboard)
          ? response.leaderboard
          : [],
        activities: Array.isArray(response.activities) ? response.activities : [],
      };
      setData(nextData);
    } catch (_error) {
      setData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const intervalId = window.setInterval(() => {
      void load();
    }, 30000);
    return () => window.clearInterval(intervalId);
  }, [load]);

  return { data, loading, reload: load };
}
