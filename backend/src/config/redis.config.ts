import { registerAs } from '@nestjs/config';

// Prefer REDIS_URL (used in docker-compose); fall back to discrete vars.
// Always expose a `url` so Bull and ioredis share one source of truth.
export default registerAs('redis', () => {
  const rawUrl = process.env.REDIS_URL;

  if (rawUrl) {
    const parsed = new URL(rawUrl);
    return {
      url: rawUrl,
      host: parsed.hostname,
      port: parseInt(parsed.port || '6379', 10),
      password: parsed.password || process.env.REDIS_PASSWORD || undefined,
    };
  }

  const host = process.env.REDIS_HOST || 'redis';
  const port = parseInt(process.env.REDIS_PORT || '6379', 10);
  const password = process.env.REDIS_PASSWORD || undefined;

  return {
    url: `redis://${password ? `:${password}@` : ''}${host}:${port}`,
    host,
    port,
    password,
  };
});
