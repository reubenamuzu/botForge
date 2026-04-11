import { Router, Request, Response, NextFunction } from 'express'
import { getAuth, clerkClient } from '@clerk/express'
import { clerkAuth } from '../middlewares/auth'
import { db } from '../lib/db'
import { generateEmbedding } from '../lib/embeddings'
import { checkBotLimit, checkSourceAllowed } from '../lib/limits'
import { z } from 'zod'
import axios from 'axios'
import { load } from 'cheerio'

async function scrapeUrl(url: string): Promise<string> {
  const { data } = await axios.get<string>(url, {
    timeout: 8000,
    headers: { 'User-Agent': 'BotForge/1.0' },
  })
  const $ = load(data)
  $('script, style, nav, footer, header, noscript').remove()
  return $('body').text().replace(/\s+/g, ' ').trim().slice(0, 10000)
}

export const botsRouter = Router()

botsRouter.use(clerkAuth)

async function resolveUser(clerkUserId: string) {
  const existing = await db.user.findUnique({ where: { clerkId: clerkUserId } })
  if (existing) return existing

  const clerkUser = await clerkClient.users.getUser(clerkUserId)
  return db.user.create({
    data: {
      clerkId: clerkUserId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
        'User',
    },
  })
}

const createBotSchema = z.object({
  name: z.string().min(1),
  greeting: z.string().min(1),
  tone: z.enum(['FRIENDLY', 'PROFESSIONAL', 'FORMAL']).default('FRIENDLY'),
  fallbackMsg: z
    .string()
    .default("I'm sorry, I didn't understand that. Could you rephrase?"),
  avatar: z.string().optional(),
})

const updateBotSchema = createBotSchema.partial().extend({
  isActive: z.boolean().optional(),
})

const createKnowledgeSchema = z.object({
  type: z.enum(['FAQ', 'PDF', 'URL']),
  question: z.string().optional(),
  answer: z.string().optional(),
  sourceUrl: z.string().optional(),
  rawText: z.string().optional(),
})

botsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)
    await checkBotLimit(user.id)
    const body = createBotSchema.parse(req.body)
    const bot = await db.bot.create({ data: { ...body, userId: user.id } })
    res.status(201).json(bot)
  } catch (err) {
    next(err)
  }
})

botsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)
    const bots = await db.bot.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json(bots)
  } catch (err) {
    next(err)
  }
})

botsRouter.get('/:botId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)
    const bot = await db.bot.findFirst({
      where: { id: req.params.botId, userId: user.id },
    })
    if (!bot) {
      res.status(404).json({ error: 'Bot not found' })
      return
    }
    res.json(bot)
  } catch (err) {
    next(err)
  }
})

botsRouter.patch('/:botId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)
    const existing = await db.bot.findFirst({
      where: { id: req.params.botId, userId: user.id },
    })
    if (!existing) {
      res.status(404).json({ error: 'Bot not found' })
      return
    }
    const body = updateBotSchema.parse(req.body)
    const bot = await db.bot.update({ where: { id: req.params.botId }, data: body })
    res.json(bot)
  } catch (err) {
    next(err)
  }
})

botsRouter.delete('/:botId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)
    const existing = await db.bot.findFirst({
      where: { id: req.params.botId, userId: user.id },
    })
    if (!existing) {
      res.status(404).json({ error: 'Bot not found' })
      return
    }
    await db.bot.delete({ where: { id: req.params.botId } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

botsRouter.post(
  '/:botId/knowledge',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req)
      const user = await resolveUser(userId!)
      const bot = await db.bot.findFirst({
        where: { id: req.params.botId, userId: user.id },
      })
      if (!bot) {
        res.status(404).json({ error: 'Bot not found' })
        return
      }
      const body = createKnowledgeSchema.parse(req.body)
      await checkSourceAllowed(user.id, body.type)

      let rawText: string | null = null
      if (body.type === 'FAQ' && body.question && body.answer) {
        rawText = `Q: ${body.question}\nA: ${body.answer}`
      } else if (body.type === 'URL' && body.sourceUrl) {
        try {
          rawText = await scrapeUrl(body.sourceUrl)
        } catch {
          rawText = null
        }
      }

      const item = await db.knowledgeItem.create({
        data: {
          botId: bot.id,
          type: body.type,
          question: body.question,
          answer: body.answer,
          sourceUrl: body.sourceUrl,
          rawText,
        },
      })

      if (rawText) {
        try {
          const embedding = await generateEmbedding(rawText)
          await db.$executeRawUnsafe(
            `UPDATE "KnowledgeItem" SET embedding = $1::vector WHERE "id" = $2`,
            `[${embedding.join(',')}]`,
            item.id
          )
        } catch {
          // Non-fatal — item is saved without embedding
        }
      }

      res.status(201).json(item)
    } catch (err) {
      next(err)
    }
  }
)

botsRouter.get(
  '/:botId/knowledge',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req)
      const user = await resolveUser(userId!)
      const bot = await db.bot.findFirst({
        where: { id: req.params.botId, userId: user.id },
      })
      if (!bot) {
        res.status(404).json({ error: 'Bot not found' })
        return
      }
      const items = await db.knowledgeItem.findMany({
        where: { botId: bot.id },
        orderBy: { createdAt: 'desc' },
      })
      res.json(items)
    } catch (err) {
      next(err)
    }
  }
)

botsRouter.delete(
  '/:botId/knowledge/:itemId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req)
      const user = await resolveUser(userId!)
      const bot = await db.bot.findFirst({
        where: { id: req.params.botId, userId: user.id },
      })
      if (!bot) {
        res.status(404).json({ error: 'Bot not found' })
        return
      }
      const item = await db.knowledgeItem.findFirst({
        where: { id: req.params.itemId, botId: bot.id },
      })
      if (!item) {
        res.status(404).json({ error: 'Knowledge item not found' })
        return
      }
      await db.knowledgeItem.delete({ where: { id: req.params.itemId } })
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
)
