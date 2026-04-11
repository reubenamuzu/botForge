require('dotenv/config')
const { neon } = require('@neondatabase/serverless')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const sql = neon(process.env.DATABASE_URL)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })

async function main() {
  await sql`ALTER TABLE "KnowledgeItem" DROP COLUMN IF EXISTS embedding`
  await sql`ALTER TABLE "KnowledgeItem" ADD COLUMN embedding vector(3072)`
  console.log('column migrated to vector(3072)')

  const items = await sql`SELECT id, "rawText" FROM "KnowledgeItem" WHERE "rawText" IS NOT NULL`
  console.log('items to re-embed:', items.length)

  for (const item of items) {
    const result = await model.embedContent(item.rawText)
    const vec = '[' + result.embedding.values.join(',') + ']'
    await sql`UPDATE "KnowledgeItem" SET embedding = ${vec}::vector WHERE id = ${item.id}`
    console.log('embedded:', item.id)
  }
  console.log('done')
}

main().catch(e => { console.error(e.message); process.exit(1) })
