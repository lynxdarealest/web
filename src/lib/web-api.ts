const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function buildUrl(path: string): string {
  if (!path.startsWith("/")) {
    return `${API_BASE}/${path}`;
  }
  return `${API_BASE}${path}`;
}

export async function webApiFetch<T = Record<string, unknown>>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch (_error) {
    data = {};
  }

  const message =
    typeof data.message === "string" && data.message.trim().length > 0
      ? data.message
      : `HTTP ${response.status}`;

  if (!response.ok || data.status === "error") {
    throw new Error(message);
  }

  return data as T;
}
