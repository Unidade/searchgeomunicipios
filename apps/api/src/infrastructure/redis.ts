import { createClient } from "redis"
import { log } from "logger"

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) {
  throw new Error("REDIS_URL env variable not defined")
}

export const redisClient = createClient({
  url: REDIS_URL,
})

export type RedisClientType = typeof redisClient

export async function setupRedis() {
  log(`Connecting to redis url: ${redisClient.options?.url}`)
  await redisClient.connect()
  log("Successfully connected to redis")
}
