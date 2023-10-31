import { createReadStream, existsSync } from "fs"
import nodePath from "path"
import ndjson from "ndjson"

import { hashFile } from "../utils/hashFile.js"
import { Municipio, newMunicipio } from "../model/municipio.js"
import { redisClient, setupRedis } from "../infrastructure/redis.js"
import { getMunicipioUseCase } from "../app/usecase.js"
import { log } from "logger"

export async function loadMunicipiosDataFromFile(path: string) {
  if (typeof path !== "string" || path.trim() === "") {
    throw new Error("Invalid path argument")
  }

  if (!existsSync(path)) {
    throw new Error(`File ${path} does not exist`)
  }

  if (!nodePath.isAbsolute(path)) {
    path = nodePath.join(process.cwd(), path)
  }

  await setupRedis()
  try {
    await _loadMunicipiosDataFromFile(path)
  } catch (error) {
    if (error instanceof Error) {
      log(error.message, "error")
    }
    log(`Error loading data from file ${path}`, "error")
  } finally {
    await redisClient.quit()
  }
}

async function _loadMunicipiosDataFromFile(path: string) {
  const hash = await hashFile(path)

  const isLoaded = await redisClient.get(`data:${hash}`)
  if (isLoaded) {
    log(`Data content from file ${path} already loaded`, "warn")
    return
  }

  const extName = nodePath.extname(path)
  log(`path: ${path}`)

  let data: Municipio[] = []

  switch (extName) {
    case ".geojsonl" || ".jsonl":
      data = await getJsonNLMunicipiosDataFromFile(path)
      break

    default:
      throw new Error(`File ${extName} not supported`)
  }

  const useCase = await getMunicipioUseCase()

  log("Starting to load data")
  const result = await useCase.loadMunicipios(data)
  log(`Loaded ${result.totalOfSuccessSaves} municipios`)
  if (result.errors && result.errors.length > 0) {
    log(`Failed to load ${result.errors.length}:`)
    /**
     * @todo
     * Add a retry mechanism
     */
  }

  // save that the data was loaded
  const response = await redisClient.set(`data:${hash}`, "true")
  if (response !== "OK") {
    await redisClient.del(`data:${hash}`)
    throw new Error(`Could not set key data:${hash}`)
  }
}

/**
 *
 * @param path path to a NL geojson file
 * @returns
 */
export async function getJsonNLMunicipiosDataFromFile(
  path: string
): Promise<Municipio[]> {
  const fetchedData: Municipio[] = []

  return new Promise((resolve, reject) => {
    const stream = createReadStream(path)

    stream
      .pipe(ndjson.parse())
      .on("data", (data: unknown) => {
        // Add the data to the array, skip the data that is not valid
        const municipio = newMunicipio(data, true)
        if (municipio) {
          fetchedData.push(municipio)
        }
      })
      .on("end", () => {
        resolve(fetchedData)
      })
      .on("error", (error: unknown) => {
        reject(error)
      })
  })
}
