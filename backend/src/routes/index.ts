import { Router } from 'express'
import { botsRouter } from './bots'
import { chatRouter } from './chat'
import { billingRouter } from './billing'
import { analyticsRouter } from './analytics'
import { usersRouter } from './users'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/bots', botsRouter)
router.use('/chat', chatRouter)
router.use('/billing', billingRouter)
router.use('/analytics', analyticsRouter)
router.use('/users', usersRouter)
