import { Handler, NextFunction, Request, Router } from "express"
import { getMunicipioUseCase } from "../app/usecase.js"
import { log } from "logger"
import { asyncHandler } from "../utils/asyncHandler.js"
import { geoJson_schema } from "../model/municipio.js"
import { validatePolygon } from "../middleware/validate-polygon.js"

export const router = Router()

const searchMunicipiosWithinPolygon: Handler = async (req, res) => {
  const { polygon } = req.body
  const useCase = await getMunicipioUseCase()
  const municipios = await useCase.searchMunicipiosWithinPolygon(polygon)

  return res.json({ municipios })
}

router.post("/", validatePolygon, asyncHandler(searchMunicipiosWithinPolygon))
