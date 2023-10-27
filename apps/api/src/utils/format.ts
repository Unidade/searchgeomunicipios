import wellknown, { GeoJSONFeature } from "wellknown"

export function convertGeoJsonToPolygon(geojson: GeoJSONFeature) {
  try {
    return wellknown.stringify(geojson)
  } catch (error) {
    const err = JSON.stringify(geojson, null, 2)
    throw new Error(`Could not convert ${err} to polygon`)
  }
}
