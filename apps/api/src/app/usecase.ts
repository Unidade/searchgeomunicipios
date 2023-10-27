import {
  Municipio,
  MunicipioRepository,
  SaveAllResponse,
} from "../model/municipio.js"
import { getRedisMunicipioRepository } from "../model/repository/municipio.js"
import { GeoJSONFeature } from "wellknown"
import { convertGeoJsonToPolygon } from "../utils/format.js"

interface _MunicipioUseCase {
  loadMunicipios(data: Municipio[]): Promise<SaveAllResponse>
  searchMunicipiosWithinPolygon(polygon: GeoJSONFeature): Promise<Municipio[]>
}

class MunicipioUseCase implements _MunicipioUseCase {
  #repository: MunicipioRepository
  constructor(repository: MunicipioRepository) {
    this.#repository = repository
  }

  async searchMunicipiosWithinPolygon(
    polygon: GeoJSONFeature,
  ): Promise<Municipio[]> {
    const wellKnowString = convertGeoJsonToPolygon(polygon)
    const municipios = await this.#repository.search(wellKnowString)
    return municipios
  }

  async loadMunicipios(data: Municipio[]) {
    return await this.#repository.saveAll(data)
  }
}

let municipioUseCase: MunicipioUseCase | undefined
export const getMunicipioUseCase = async () => {
  if (!municipioUseCase) {
    const repository = await getRedisMunicipioRepository()
    municipioUseCase = new MunicipioUseCase(repository)
  }
  return municipioUseCase
}
