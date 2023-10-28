import "../utils/loadenv.js"

import { existsSync } from "fs"
import { loadMunicipiosDataFromFile } from "../data/load-municipios-from-file.js"
import { log } from "logger"

async function cmdLoadMunicipiosFromFile() {
  const filepath = process.argv[2]

  if (!filepath || process.argv.length !== 3 || !existsSync(filepath)) {
    log("Usage: tsx load-municipios-from-file.ts <filepath>")
    process.exit(1)
  }

  log(`filepath: ${filepath}`)

  await loadMunicipiosDataFromFile(filepath)
}

await cmdLoadMunicipiosFromFile()
