require('dotenv/config')
const { neon } = require('@neondatabase/serverless')
const sql = neon(process.env.DATABASE_URL)

async function main() {
  const rows = await sql`
    SELECT id, type, question, answer, "rawText", embedding IS NOT NULL as has_emb
    FROM "KnowledgeItem"
  `
  console.log(JSON.stringify(rows, null, 2))
}

main().catch(e => { console.error(e.message); process.exit(1) })
