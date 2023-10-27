import { Handler } from "express"

export const notFound: Handler = (req, res) => {
  return res.status(404).json({
    message: "Not found",
  })
}
