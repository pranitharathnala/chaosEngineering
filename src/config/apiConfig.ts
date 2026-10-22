/**
 * Centralized API configuration for ChaosResilience.
 * Uses VITE_API_BASE_URL when defined in environment variables.
 * In local development, defaults to http://localhost:5000.
 * In production / Docker reverse proxy environments, defaults to empty string
 * so API calls resolve relatively (e.g., /health, /api/status).
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ??
  (import.meta.env.DEV ? 'http://localhost:5000' : '');
