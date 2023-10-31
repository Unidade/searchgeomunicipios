import { Level, pino } from "pino"

export const log = (str: any, level: Level = "info") => {
  return logger[level](str)
}

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
})
