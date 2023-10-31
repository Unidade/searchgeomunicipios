import { Handler } from "express"
import { geoJson_schema } from "../model/municipio.js"
import { ClientError } from "./errors/handle-client-error.js"

export const validatePolygon: Handler = (req, res, next) => {
  const { polygon } = req.body

  try {
    const result = geoJson_schema.parse(polygon)
    next()
  } catch (error) {
    console.log("VALIDATE POLYGON", error)
    next(new ClientError(`invalid polygon`, 400))
  }
}
