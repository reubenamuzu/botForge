import { Router, Request, Response, NextFunction } from 'express'
import { getAuth } from '@clerk/express'
import { clerkAuth } from '../middlewares/auth'
import { db } from '../lib/db'

export const analyticsRouter = Router()
analyticsRouter.use(clerkAuth)

async function resolveUser(clerkUserId: string) {
  return db.user.findUnique({ where: { clerkId: clerkUserId } })
}

// GET /api/analytics/:botId/summary
analyticsRouter.get(
  '/:botId/summary',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req)
      const user = await resolveUser(userId!)
      if (!user) { res.status(401).json({ error: 'Unauthorized' }); return }

      const bot = await db.bot.findFirst({ where: { id: req.params.botId, userId: user.id } })
      if (!bot) { res.status(404).json({ error: 'Bot not found' }); return }

      const conversations = await db.conversation.findMany({
        where: { botId: bot.id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      })

      const totalConversations = conversations.length
      const allMessages = conversations.flatMap((c) => c.messages)
      const totalMessages = allMessages.length

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const messagesThisMonth = allMessages.filter(
        (m) => new Date(m.createdAt) >= startOfMonth
      ).length

      const avgMessagesPerConversation =
        totalConversations > 0
          ? Math.round((totalMessages / totalConversations) * 10) / 10
          : 0

      // Top 5 most asked USER messages
      const userMessages = allMessages.filter((m) => m.role === 'USER')
      const countMap = new Map<string, number>()
      for (const m of userMessages) {
        countMap.set(m.content, (countMap.get(m.content) ?? 0) + 1)
      }
      const topQuestions = [...countMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([content, count]) => ({ content, count }))

      // Unanswered: BOT messages that exactly match the bot's fallback
      const unansweredCount = allMessages.filter(
        (m) => m.role === 'BOT' && m.content.trim() === bot.fallbackMsg.trim()
      ).length

      // Messages per day for last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      const dailyMap = new Map<string, number>()
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        dailyMap.set(d.toISOString().slice(0, 10), 0)
      }
      for (const m of allMessages) {
        const key = new Date(m.createdAt).toISOString().slice(0, 10)
        if (dailyMap.has(key)) {
          dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1)
        }
      }
      const dailyMessages = [...dailyMap.entries()].map(([date, count]) => ({
        date,
        count,
      }))

      res.json({
        totalConversations,
        totalMessages,
        messagesThisMonth,
        avgMessagesPerConversation,
        topQuestions,
        unansweredCount,
        dailyMessages,
      })
    } catch (err) {
      next(err)
    }
  }
)

// GET /api/analytics/:botId/conversations
analyticsRouter.get(
  '/:botId/conversations',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req)
      const user = await resolveUser(userId!)
      if (!user) { res.status(401).json({ error: 'Unauthorized' }); return }

      const bot = await db.bot.findFirst({ where: { id: req.params.botId, userId: user.id } })
      if (!bot) { res.status(404).json({ error: 'Bot not found' }); return }

      const page = Math.max(1, parseInt(req.query.page as string) || 1)
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
      const skip = (page - 1) * limit

      const [total, conversations] = await Promise.all([
        db.conversation.count({ where: { botId: bot.id } }),
        db.conversation.findMany({
          where: { botId: bot.id },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        }),
      ])

      const items = conversations.map((c) => ({
        id: c.id,
        sessionId: c.sessionId,
        createdAt: c.createdAt,
        messageCount: c.messages.length,
        lastMessage: c.messages[c.messages.length - 1]?.content ?? '',
      }))

      res.json({ items, total, page, limit, pages: Math.ceil(total / limit) })
    } catch (err) {
      next(err)
    }
  }
)

// GET /api/analytics/:botId/conversations/:conversationId
analyticsRouter.get(
  '/:botId/conversations/:conversationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req)
      const user = await resolveUser(userId!)
      if (!user) { res.status(401).json({ error: 'Unauthorized' }); return }

      const bot = await db.bot.findFirst({ where: { id: req.params.botId, userId: user.id } })
      if (!bot) { res.status(404).json({ error: 'Bot not found' }); return }

      const conversation = await db.conversation.findFirst({
        where: { id: req.params.conversationId, botId: bot.id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      })
      if (!conversation) { res.status(404).json({ error: 'Conversation not found' }); return }

      res.json({
        conversation: {
          id: conversation.id,
          sessionId: conversation.sessionId,
          createdAt: conversation.createdAt,
        },
        messages: conversation.messages.map((m) => ({
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
      })
    } catch (err) {
      next(err)
    }
  }
)
