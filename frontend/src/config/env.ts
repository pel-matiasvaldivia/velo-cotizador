// Reads runtime config injected by docker-entrypoint.sh (/config.js)
// Falls back to Vite build-time env vars for local development
declare global {
  interface Window {
    _env?: Record<string, string>;
  }
}

export const getEnv = (key: string): string => {
  return window._env?.[key] ?? (import.meta.env[key] as string) ?? '';
};

export const API_URL = getEnv('VITE_API_URL') || 'http://localhost:3001';
export const WS_URL = getEnv('VITE_WS_URL') || 'ws://localhost:3001';
