import "./utils/loadenv.js"

import { redisClient, setupRedis } from "./infrastructure/redis.js"
import { createServer } from "./app.js"
import { log } from "logger"

await setupRedis()

const app = createServer()
const port = process.env.PORT || 8080
const server = app.listen(port, () => {
  log(`Server is running on port ${port}`)
})

process.on("SIGTERM", () => {
  log("SIGTERM signal received.")
  log("Closing http server.")
  server.close(() => {
    log("Http server closed.")

    redisClient.quit().then(() => {
      log("Redis client closed")
      process.exit(0)
    })
  })
})
