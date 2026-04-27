/**
 * Default public URL for backend-mv (multivendor Payload). Keep in sync with:
 * - Repo root `docker-compose.yml` → `backend-mv` ports `4000:3000`
 * - `BS-Commerce/package.json` → `dev:host:mv` (host-run Next on port 4000)
 */
export const DEFAULT_MV_BACKEND_ORIGIN = "http://localhost:4000" as const;
export const DEFAULT_MV_API_URL = `${DEFAULT_MV_BACKEND_ORIGIN}/api` as const;
