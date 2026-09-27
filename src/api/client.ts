/**
 * LORD ESPORTZ API Client
 * Resilient API fetcher with token management and automatic fallback support.
 */

function resolveApiBase(): string {
  let envUrl = ((import.meta.env.VITE_API_URL as string | undefined) || "").trim().replace(/\/+$/, "");

  // If envUrl is missing protocol but looks like a remote hostname (e.g. lordz-esportsserver.vercel.app)
  if (envUrl && !envUrl.startsWith("http://") && !envUrl.startsWith("https://") && !envUrl.startsWith("/")) {
    envUrl = `https://${envUrl}`;
  }

  const isBrowser = typeof window !== "undefined";
  const isLocalhost =
    isBrowser &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("192.168."));

  // If on production (Cloudflare *.workers.dev or custom domain) and envUrl is empty, relative, or points to frontend host, fallback to live Vercel backend
  if (!isLocalhost && (!envUrl || envUrl.startsWith("/") || envUrl.includes("workers.dev"))) {
    return "https://lordz-esportsserver.vercel.app/api";
  }

  if (!envUrl) {
    return "/api";
  }

  if (envUrl.includes("lordz-esportsserver.vercel.app") && !envUrl.endsWith("/api")) {
    return `${envUrl}/api`;
  }

  return envUrl;
}

export const API_BASE = resolveApiBase();

export function getApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  let clean = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // If API_BASE ends with /api and endpoint also starts with /api/, strip duplicate
  if (API_BASE.endsWith("/api") && clean.startsWith("/api/")) {
    clean = clean.slice(4);
  }

  return `${API_BASE}${clean}`;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

// In-memory client cache with TTL (3 minutes) for instant page navigation
interface ClientCacheEntry<T> {
  data: T;
  timestamp: number;
}
const clientCache = new Map<string, ClientCacheEntry<any>>();
const CLIENT_CACHE_TTL = 3 * 60 * 1000; // 3 minutes memory cache

export function clearClientCache(pattern?: string) {
  if (!pattern) {
    clientCache.clear();
    return;
  }
  for (const key of clientCache.keys()) {
    if (key.includes(pattern)) {
      clientCache.delete(key);
    }
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const token =
    localStorage.getItem("lordz_player_token") ||
    localStorage.getItem("lordz_admin_token") ||
    localStorage.getItem("token");

  const method = (options.method || "GET").toUpperCase();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only attach Content-Type on requests with payload (omitting on GET avoids CORS preflight OPTIONS roundtrip)
  if (method !== "GET" && method !== "HEAD" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = getApiUrl(endpoint);
  const isCacheableGet = method === "GET" && !token;

  // 1. Check in-memory cache first (0ms)
  if (isCacheableGet) {
    const cached = clientCache.get(url);
    if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_TTL) {
      return cached.data as T;
    }

    // 2. Check localStorage cache for instant first paint
    try {
      const local = localStorage.getItem(`lordz_swr_${url}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && Date.now() - parsed.timestamp < 10 * 60 * 1000) {
          // Keep in memory and return
          clientCache.set(url, { data: parsed.data, timestamp: parsed.timestamp });
          // Fetch fresh in background if older than 30s
          if (Date.now() - parsed.timestamp > 30 * 1000) {
            fetch(url, { ...options, headers })
              .then(async (r) => {
                if (r.ok) {
                  const j = await r.json();
                  const d = j.data !== undefined ? j.data : j;
                  clientCache.set(url, { data: d, timestamp: Date.now() });
                  localStorage.setItem(`lordz_swr_${url}`, JSON.stringify({ data: d, timestamp: Date.now() }));
                }
              })
              .catch(() => {});
          }
          return parsed.data as T;
        }
      }
    } catch {}
  } else if (method !== "GET") {
    clientCache.clear();
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    let json: ApiResponse<T>;
    if (contentType.includes("application/json")) {
      json = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server returned status ${response.status} (${response.statusText}): ${text.slice(0, 120)}`);
    }

    if (!response.ok) {
      throw new Error(json.message || `Request failed with status ${response.status}`);
    }

    const result = (json.data !== undefined ? json.data : (json as unknown as T)) as T;

    if (isCacheableGet) {
      clientCache.set(url, { data: result, timestamp: Date.now() });
      try {
        localStorage.setItem(`lordz_swr_${url}`, JSON.stringify({ data: result, timestamp: Date.now() }));
      } catch {}
    }

    return result;
  } catch (error: any) {
    // If a fallback was provided, gracefully return it
    if (fallbackData !== undefined) {
      console.warn(`[API Fallback] ${endpoint} unreachable or error: ${error?.message}. Using static fallback.`);
      return fallbackData;
    }
    throw error;
  }
}
