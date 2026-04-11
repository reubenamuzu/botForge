import { Router } from 'express'
import { botsRouter } from './bots'
import { chatRouter } from './chat'
import { billingRouter } from './billing'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/bots', botsRouter)
router.use('/chat', chatRouter)
router.use('/billing', billingRouter)
