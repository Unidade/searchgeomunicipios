import type { SearchReply } from "redis"

/**
 * Convert redis search reply to a json object
 * @param searchReply
 * @returns
 */
export function searchReplyToJson<T>(searchReply: SearchReply) {
  const matchingResults = searchReply.documents
    .map((doc) => {
      const value = doc.value[0]
      return value as T
    })
    .filter((doc) => doc !== null)

  return matchingResults
}
