import {
  Municipio,
  MunicipioRepository,
  SaveAllResponse,
  newMunicipio,
} from "../municipio.js"

import wellknown, { GeoJSONFeature } from "wellknown"
import { RedisClientType, redisClient } from "../../infrastructure/redis.js"
import { searchReplyToJson } from "../../utils/searchReply.js"
import { convertGeoJsonToPolygon } from "../../utils/format.js"

type RedisMuncipio = {
  code: Municipio["properties"]["CD_MUN"]
  name: Municipio["properties"]["NM_MUN"]
  state: Municipio["properties"]["SIGLA_UF"]
  area_km2: Municipio["properties"]["AREA_KM2"]
  population: Municipio["properties"]["POPULATION"]
  boundaries: string
}

class RedisMunicipioRepository_ implements MunicipioRepository {
  #indexName = "idx:region"
  #redisClient: RedisClientType

  constructor(redisClient: RedisClientType) {
    this.#redisClient = redisClient
  }

  async setup() {
    return this
  }

  async save(data: Municipio) {
    const municipio = newMunicipio(data)

    const response = await this.#loadMunicipioToDatabase(municipio)

    this.verifyRedisResponse(response)
  }
  async saveAll(data: Municipio[]) {
    const municipios = data.map((municipio) => {
      newMunicipio(municipio)
      return this.#loadMunicipioToDatabase(municipio)
    })

    // auto pipelining
    const arr = await Promise.all(municipios)

    return this.verifyRedisResponse(arr)
  }

  async retrieveByCode(code: string) {
    const data = await this.#redisClient.json.get(`region:${code}`)
    if (!data) {
      throw new Error(`Could not find region with code ${code}`)
    }
    return data as Municipio
  }

  async retrieveAll() {
    const municipios = await this.#redisClient.ft.search(this.#indexName, "*", {
      LIMIT: {
        from: 0,
        size: 5572,
      },
    })

    return searchReplyToJson<Municipio>(municipios)
  }

  async #loadMunicipioToDatabase(data: Municipio) {
    const municipio = newMunicipio(data)

    const redisMunicipioModel = this.createRedisMunicipio(municipio)

    return this.#redisClient.json.set(
      `region:${redisMunicipioModel.code}`,
      "$",
      redisMunicipioModel,
    )
  }

  async createIdx() {
    const list = await this.#redisClient.ft._list()

    if (list.includes(this.#indexName)) {
      console.log(`Dropping old index ${this.#indexName}`)
      await this.#redisClient.ft.dropIndex(this.#indexName)
    }

    console.log(`Creating index ${this.#indexName}`)

    const indexDefinition = `FT.CREATE ${
      this.#indexName
    } ON JSON PREFIX 1 region: SCHEMA $.state AS state TAG SORTABLE $.code AS code TAG $.name AS name TEXT $.area_km2 as area_km2 NUMERIC SORTABLE $.population as population NUMERIC SORTABLE $.boundaries AS boundaries GEOSHAPE SPHERICAL`
    await this.#redisClient.sendCommand(indexDefinition.split(" "))
  }

  async search(polygon: string): Promise<Municipio[]> {
    const polygonWKnown = wellknown.stringify(
      polygon as unknown as GeoJSONFeature,
    )

    const response = await this.#redisClient.ft.search(
      this.#indexName,
      "@boundaries:[WITHIN $poly]",
      {
        PARAMS: {
          poly: polygonWKnown,
        },
        DIALECT: 3,
        LIMIT: {
          from: 0,
          size: 5572,
        },
      },
    )

    const results = searchReplyToJson<Municipio>(response)
    return results
  }

  /**
   * Return an array with number of success when the response is an array
   * @param response
   */
  verifyRedisResponse(response: unknown): SaveAllResponse {
    let totalOfSuccessSaves = 0
    const errorsIdx: number[] = []

    if (typeof response === "string") {
      if (response !== "OK") {
        throw new Error("Could not load data to redis")
      }
      totalOfSuccessSaves++
    } else if (Array.isArray(response)) {
      response.map((value, idx) => {
        if (value !== "OK") {
          errorsIdx.push(idx)
        } else {
          totalOfSuccessSaves++
        }
      })
    }

    const errors = errorsIdx.length > 0 ? errorsIdx : null

    return {
      totalOfSuccessSaves,
      errors,
    }
  }

  createRedisMunicipio(municipio: Municipio): RedisMuncipio {
    const {
      CD_MUN: code,
      NM_MUN: name,
      SIGLA_UF: state,
      AREA_KM2: area_km2,
      POPULATION: population,
    } = municipio.properties

    const boundaries = convertGeoJsonToPolygon(
      municipio.geometry as unknown as GeoJSONFeature,
    )
    if (!boundaries) {
      throw new Error("Could not convert geometry to well known string")
    }

    return {
      code,
      name,
      state,
      area_km2,
      population,
      boundaries,
    }
  }
}

let RedisMunicipioRepository: RedisMunicipioRepository_ | undefined
export const getRedisMunicipioRepository = async () => {
  if (!RedisMunicipioRepository) {
    RedisMunicipioRepository = await new RedisMunicipioRepository_(
      redisClient,
    ).setup()
  }
  return RedisMunicipioRepository
}
