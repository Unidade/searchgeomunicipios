import { Router } from "express"
import { getMunicipioUseCase } from "../app/usecase.js"
import { log } from "logger"

export const router = Router()

router.post("/", async (req, res) => {
  log(`POST /search request.body: ${JSON.stringify(req.body, null, 2)}`)
  const { polygon } = req.body

  const useCase = await getMunicipioUseCase()
  const matchedResults = await useCase.searchMunicipiosWithinPolygon(polygon)

  log(`POST /search response: ${matchedResults}`)
  return res.status(200).json(matchedResults)
})
