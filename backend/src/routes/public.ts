import { Router, Request, Response, NextFunction } from 'express'
import { db } from '../lib/db'

export const publicRouter = Router()

publicRouter.get('/bots/:botId/public', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await db.bot.findUnique({
      where: { id: req.params.botId },
      select: { id: true, name: true, avatar: true, greeting: true, isActive: true, widgetColor: true, widgetPosition: true, leadCapture: true },
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
