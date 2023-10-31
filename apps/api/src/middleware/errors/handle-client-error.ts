import { ErrorRequestHandler } from "express"
import { log } from "logger"

/**
 * Client error is defined as an error that is caused by the client 4xx
 * The message needs to be user friendly
 */
export const handleClientError: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  log("handleClientError")

  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      error: err.message,
    })
  }

  next(err)
}

export class ClientError extends Error {
  public readonly statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}
