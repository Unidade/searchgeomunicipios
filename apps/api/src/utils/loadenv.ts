import { config } from "dotenv"

const env = process.env.NODE_ENV || "local"

config({ path: `.env.${env}` })
