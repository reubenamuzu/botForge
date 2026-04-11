import { Router, Request, Response, NextFunction } from 'express'
import { db } from '../lib/db'
import { PLAN_LIMITS, type PlanKey } from '../lib/limits'

export const publicRouter = Router()

publicRouter.get('/bots/:botId/public', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await db.bot.findUnique({
      where: { id: req.params.botId },
      select: {
        id: true,
        name: true,
        avatar: true,
        greeting: true,
        isActive: true,
        widgetColor: true,
        widgetPosition: true,
        leadCapture: true,
        user: { select: { plan: true } },
      },
    })
    if (!bot) {
      res.status(404).json({ error: 'Bot not found' })
      return
    }
    const limits = PLAN_LIMITS[bot.user.plan as PlanKey]
    const { user: _user, ...botFields } = bot
    res.json({ ...botFields, whiteLabel: limits.whiteLabel })
  } catch (err) {
    next(err)
  }
})
