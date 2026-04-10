import { Router } from 'express'
import { botsRouter } from './bots'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/bots', botsRouter)
