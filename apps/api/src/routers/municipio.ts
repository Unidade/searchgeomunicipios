import { Router } from "express"
import { getRedisMunicipioRepository } from "../model/repository/municipio.js"
import { validadeMunicipio } from "../middleware/validate-municipio.js"

export const router = Router()

/**
 * Add a new municipio to the database
 * @route POST /municipio
 */
router.post("/", validadeMunicipio, async (req, res) => {
  const { data } = req.body
  const repository = await getRedisMunicipioRepository()

  await repository.save(data)

  return res.status(204).end()
})
