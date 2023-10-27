import { existsSync } from "fs"
import { loadMunicipiosDataFromFile } from "../data/load-municipios-from-file.js"

async function cmdLoadMunicipiosFromFile() {
  const filepath = process.argv[2]

  if (!filepath || process.argv.length !== 3 || !existsSync(filepath)) {
    console.log("Usage: tsx load-municipios-from-file.ts <filepath>")
    process.exit(1)
  }

  console.log("filepath:", filepath)

  await loadMunicipiosDataFromFile(filepath)
}

await cmdLoadMunicipiosFromFile()
