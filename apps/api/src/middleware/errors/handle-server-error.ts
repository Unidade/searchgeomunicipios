import { ErrorRequestHandler } from "express"

/**
 * Handle server errors 5xx
 * Don't leak any information to the client
 */
export const handleServerError: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof ServerError) {
    return res.status(500).json({
      error: "Sorry, something went wrong.",
    })
  }

  // return to the default express error handler
  next(err)
}

export class ServerError extends Error {
  public readonly statusCode: number
  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
  }
}
