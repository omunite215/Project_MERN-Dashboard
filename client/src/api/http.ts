import { env } from "@/config/env";
import { useAuthStore } from "@/store/useAuthStore";
import { refreshAccessToken } from "./authClient";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(
    path.replace(/^\//, ""),
    env.BASE_URL.endsWith("/") ? env.BASE_URL : `${env.BASE_URL}/`,
  );
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

interface Options {
  method?: string;
  body?: unknown;
  params?: Record<string, unknown>;
}

async function raw(
  path: string,
  opts: Options,
  token: string | null,
): Promise<Response> {
  return fetch(buildUrl(path, opts.params), {
    method: opts.method ?? "GET",
    credentials: "include",
    headers: {
      ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

export async function apiFetch<T>(
  path: string,
  opts: Options = {},
): Promise<T> {
  let token = useAuthStore.getState().accessToken;
  let res = await raw(path, opts, token);

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (token) {
      res = await raw(path, opts, token);
    }
    if (!token || res.status === 401) {
      useAuthStore.getState().clearAuth();
      throw new HttpError(401, "Unauthorized");
    }
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new HttpError(res.status, message);
  }

  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>,
): Promise<T> {
  return apiFetch<T>(path, { params });
}
