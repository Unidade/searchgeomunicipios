import * as zod from "zod"

const properties_schema = zod.object({
  CD_MUN: zod.string(),
  NM_MUN: zod.string(),
  SIGLA_UF: zod.string(),
  AREA_KM2: zod.number(),
  POPULATION: zod.number(),
})

const geometry_schema = zod.object({
  type: zod.string(),
  coordinates: zod.array(zod.array(zod.array(zod.number()))),
})

export const municipio_schema = zod.object({
  type: zod.string(),
  properties: properties_schema,
  geometry: geometry_schema,
})

export type Municipio = zod.infer<typeof municipio_schema>
export type Properties = zod.infer<typeof properties_schema>
export type Geometry = zod.infer<typeof geometry_schema>

export interface MunicipioRepository {
  save(data: Municipio): Promise<void>
  saveAll(data: Municipio[]): Promise<SaveAllResponse>
  retrieveByCode(code: string): Promise<Municipio>
  retrieveAll(): Promise<Municipio[]>
  search(polygon: string): Promise<Municipio[]>
}

export function newMunicipio(
  data: unknown,
  safeparse: boolean,
): Municipio | undefined
export function newMunicipio(data: unknown): Municipio

/**
 *
 * @param data
 * @param safeparse=false Allow to parse the data safely and return undefined if the data is not valid
 */
export function newMunicipio(data: unknown, safeparse: boolean = false) {
  if (safeparse) {
    const result = municipio_schema.safeParse(data)
    if (result.success) {
      return result.data
    } else {
      console.error(result.error)
    }
  }
  return municipio_schema.parse(data)
}

/**
 * return the number of municipios saved
 *
 */
export type SaveAllResponse =
  | {
      totalOfSuccessSaves: number
      errors: null
    }
  | {
      totalOfSuccessSaves: number
      errors: number[]
    }
