import { pino } from "pino"

export const log = (str: any) => {
  logger.info(str)
}

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
})
