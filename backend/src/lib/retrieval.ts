import { db } from './db'
import { generateEmbedding } from './embeddings'

export async function retrieveContext(botId: string, query: string): Promise<string[]> {
  const embedding = await generateEmbedding(query)
  const vectorLiteral = `[${embedding.join(',')}]`

  const rows = await db.$queryRawUnsafe(
    `SELECT "rawText" FROM "KnowledgeItem"
     WHERE "botId" = $1
       AND embedding IS NOT NULL
     ORDER BY embedding <=> $2::vector
     LIMIT 3`,
    botId,
    vectorLiteral
  ) as { rawText: string | null }[]

  return rows.map((r) => r.rawText).filter((t): t is string => t !== null)
}
