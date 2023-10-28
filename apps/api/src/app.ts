import express, { urlencoded, json } from "express"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import { router as searchRouter } from "./routers/search.js"
import { router as municipioRouter } from "./routers/municipio.js"
import { notFound } from "./middleware/404.js"
import { handleError } from "./middleware/handle-error.js"
import cors from "cors"
import morgan from "morgan"
import * as url from "url"
import path from "path"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

const swaggerDocument = YAML.load(path.join(__dirname, "api.yaml"))

export const createServer = () => {
  const app = express()

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())

    .use("/search", searchRouter)
    .use("/municipio", municipioRouter)
    .use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use(handleError)
    .use(notFound)

  return app
}
