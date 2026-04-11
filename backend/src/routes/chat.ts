import { Router, Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { db } from '../lib/db'
import { generateBotResponse } from '../lib/chat'

export const chatRouter = Router()

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  keyGenerator: (req: Request) => {
    const body = req.body as { sessionId?: string }
    return body?.sessionId ?? 'anonymous'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const chatSchema = z.object({
  botId: z.string().min(1),
  sessionId: z.string().min(1),
  message: z.string().min(1).max(2000),
})

chatRouter.post('/', limiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { botId, sessionId, message } = chatSchema.parse(req.body)

    let conversation = await db.conversation.findFirst({
      where: { botId, sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 10 },
      },
    })

    if (!conversation) {
      conversation = await db.conversation.create({
        data: { botId, sessionId },
        include: { messages: true },
      })
    }

    await db.message.create({
      data: { conversationId: conversation.id, role: 'USER', content: message },
    })

    const history = conversation.messages.map((m) => ({
      role: m.role as string,
      content: m.content,
    }))

    const reply = await generateBotResponse(botId, message, history)

    await db.message.create({
      data: { conversationId: conversation.id, role: 'BOT', content: reply },
    })

    res.json({ reply, conversationId: conversation.id })
  } catch (err) {
    next(err)
  }
})
