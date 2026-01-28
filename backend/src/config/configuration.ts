export const configuration = () => ({
  // Application
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT!, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api/v1',

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '7d',
  },

  // AI - Anthropic
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },

  // Market Data Providers
  oanda: {
    apiKey: process.env.OANDA_API_KEY,
    accountId: process.env.OANDA_ACCOUNT_ID,
    environment: process.env.OANDA_ENVIRONMENT || 'practice',
  },

  binance: {
    apiKey: process.env.BINANCE_API_KEY,
    apiSecret: process.env.BINANCE_API_SECRET,
  },

  polygon: {
    apiKey: process.env.POLYGON_API_KEY,
  },

  finnhub: {
    apiKey: process.env.FINNHUB_API_KEY,
  },

  alphaVantage: {
    apiKey: process.env.ALPHA_VANTAGE_API_KEY,
  },

  // Throttling
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL!, 10) || 60000,
    limit: parseInt(process.env.THROTTLE_LIMIT!, 10) || 100,
  },
});

export type AppConfig = ReturnType<typeof configuration>;
