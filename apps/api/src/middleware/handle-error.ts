import { ErrorRequestHandler } from "express"

export const handleError: ErrorRequestHandler = (err, req, res) => {
  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message,
    })
  }

  return res.status(500).json({
    message: "Internal server error",
  })
}
