const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!API_BASE) {
    return normalizedPath;
  }

  let finalPath = normalizedPath;

  // Avoid duplicated prefixes when API_BASE already includes /api or /api/web.
  if (/\/api\/web$/i.test(API_BASE) && /^\/api\/web(\/|$)/i.test(finalPath)) {
    finalPath = finalPath.replace(/^\/api\/web/i, "");
  } else if (/\/api$/i.test(API_BASE) && /^\/api(\/|$)/i.test(finalPath)) {
    finalPath = finalPath.replace(/^\/api/i, "");
  }

  return `${API_BASE}${finalPath}`;
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
