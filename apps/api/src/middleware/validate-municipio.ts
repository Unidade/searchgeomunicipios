import { Handler } from "express"
import { newMunicipio } from "../model/municipio.js"

export const validadeMunicipio: Handler = (req, res, next) => {
  const { data } = req.body

  if (!data) {
    return res.status(400).json({
      message: "Missing data",
    })
  }

  newMunicipio(data)
  next()
}
