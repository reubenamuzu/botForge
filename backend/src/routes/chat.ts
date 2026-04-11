import { Router, Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { db } from '../lib/db'
import { generateBotResponse } from '../lib/chat'
import { checkMessageLimit, PLAN_LIMITS, type PlanKey } from '../lib/limits'

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
  leadName: z.string().max(100).optional(),
  leadEmail: z.string().email().optional(),
})

chatRouter.post('/', limiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { botId, sessionId, message, leadName, leadEmail } = chatSchema.parse(req.body)

    const bot = await db.bot.findUnique({
      where: { id: botId },
      select: { userId: true },
    })
    if (!bot) {
      res.status(404).json({ error: 'Bot not found' })
      return
    }
    await checkMessageLimit(bot.userId)

    let conversation = await db.conversation.findFirst({
      where: { botId, sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 10 },
      },
    })

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          botId,
          sessionId,
          ...(leadName ? { leadName } : {}),
          ...(leadEmail ? { leadEmail } : {}),
        },
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

    // Fire-and-forget: check 80% usage threshold and send alert once per month
    checkAndSendUsageAlert(bot.userId).catch(() => {/* non-fatal */})

    res.json({ reply, conversationId: conversation.id })
  } catch (err) {
    next(err)
  }
})

async function checkAndSendUsageAlert(userId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, plan: true, usageAlertSentAt: true },
  })
  if (!user) return

  const limits = PLAN_LIMITS[user.plan as PlanKey]
  if (limits.maxMessagesPerMonth === Infinity) return

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Only send once per calendar month
  if (user.usageAlertSentAt && user.usageAlertSentAt >= startOfMonth) return

  const used = await db.message.count({
    where: {
      role: 'USER',
      createdAt: { gte: startOfMonth },
      conversation: { bot: { userId } },
    },
  })

  const pct = used / limits.maxMessagesPerMonth
  if (pct < 0.8) return

  await db.user.update({ where: { id: userId }, data: { usageAlertSentAt: now } })

  const { sendUsageAlertEmail } = await import('../lib/email')
  await sendUsageAlertEmail(
    user.email,
    user.name,
    used,
    limits.maxMessagesPerMonth,
    user.plan
  )
}
