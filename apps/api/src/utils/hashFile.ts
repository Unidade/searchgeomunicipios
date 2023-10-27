import { createHash } from "crypto"
import { createReadStream } from "fs"

/**
 * Hash the contents of a file
 * @param path
 * @returns hash
 */
export async function hashFile(path: string) {
  const hash = createHash("sha256")

  const stream = createReadStream(path)

  return new Promise((resolve, reject) => {
    stream
      .on("data", (data) => {
        hash.update(data)
      })
      .on("end", () => {
        resolve(hash.digest("hex"))
      })
      .on("error", (error) => {
        reject(error)
      })
  })
}
