// Central place for talking to your Spring Boot `simple_auth` backend.
// Override the base URL with NEXT_PUBLIC_API_URL in a .env.local file if your
// backend runs somewhere other than http://localhost:8080/api.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Thin wrapper around fetch that:
 *  - prefixes API_URL
 *  - sends JSON
 *  - sends the auth cookie on every request (credentials: "include")
 *  - throws on a non-2xx response so callers can try/catch
 *
 * There is no token to read here on purpose. The token lives in an httpOnly
 * cookie that your JavaScript cannot see. The browser attaches it automatically
 * as long as we pass `credentials: "include"`.
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  // Some endpoints (e.g. logout) may return an empty body.
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
