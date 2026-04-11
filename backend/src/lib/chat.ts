import Anthropic from '@anthropic-ai/sdk'
import { db } from './db'
import { retrieveContext } from './retrieval'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const toneLabel: Record<string, string> = {
  FRIENDLY: 'warm and friendly',
  PROFESSIONAL: 'professional and concise',
  FORMAL: 'formal and precise',
}

export async function generateBotResponse(
  botId: string,
  userMessage: string,
  history: { role: string; content: string }[]
): Promise<string> {
  const bot = await db.bot.findUniqueOrThrow({ where: { id: botId } })
  let chunks: string[] = []
  try {
    chunks = await retrieveContext(botId, userMessage)
  } catch {
    // Embedding/retrieval failure (e.g. quota) — continue with no context
  }

  const systemPrompt = [
    `You are ${bot.name}, a customer support assistant.`,
    `Answer ONLY using the context below.`,
    `If the answer is not in the context, respond with: ${bot.fallbackMsg}`,
    `Tone: ${toneLabel[bot.tone] ?? bot.tone.toLowerCase()}`,
    `Context:\n${chunks.join('\n')}`,
  ].join('\n')

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
      role: (m.role === 'BOT' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ]

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: systemPrompt,
    messages,
  })

  const block = response.content[0]
  return block.type === 'text' ? block.text : bot.fallbackMsg
}
