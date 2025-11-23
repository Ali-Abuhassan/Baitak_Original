// // backend/config/redis.js
// const IORedis = require('ioredis');

// const redis = new IORedis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
//   // password: process.env.REDIS_PASSWORD || undefined, // only if you set one
// });

// redis.on('connect', () => console.log('🔗 Redis connected'));
// redis.on('error', (err) => console.error('❌ Redis error', err));

// module.exports = redis;
// backend/config/redis.js
const { createClient } = require("redis");

const redis = createClient({
  url: "redis://redis:6379", // "redis" = service name in docker-compose
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

// Connect only once during server startup
async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

module.exports = {
  redis,
  connectRedis
};
