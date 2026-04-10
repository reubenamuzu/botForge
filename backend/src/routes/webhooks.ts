import { Router, Request, Response } from 'express'
import { Webhook } from 'svix'
import { db } from '../lib/db'

export const webhookRouter = Router()

interface ClerkEmailAddress {
  email_address: string
}

interface ClerkUserPayload {
  id: string
  email_addresses: ClerkEmailAddress[]
  first_name: string | null
  last_name: string | null
}

interface ClerkDeletedPayload {
  id: string
  deleted: true
}

interface ClerkWebhookEvent {
  type: string
  data: ClerkUserPayload | ClerkDeletedPayload
}

webhookRouter.post('/clerk', async (req: Request, res: Response) => {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let event: ClerkWebhookEvent

  try {
    event = wh.verify(req.body as Buffer, {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    }) as ClerkWebhookEvent
  } catch {
    res.status(400).json({ error: 'Invalid webhook signature' })
    return
  }

  try {
    switch (event.type) {
      case 'user.created': {
        const data = event.data as ClerkUserPayload
        const email = data.email_addresses[0]?.email_address ?? ''
        const name =
          [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User'
        await db.user.create({
          data: { clerkId: data.id, email, name, plan: 'FREE' },
        })
        break
      }

      case 'user.updated': {
        const data = event.data as ClerkUserPayload
        const email = data.email_addresses[0]?.email_address ?? ''
        const name =
          [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User'
        await db.user.upsert({
          where: { clerkId: data.id },
          update: { email, name },
          create: { clerkId: data.id, email, name, plan: 'FREE' },
        })
        break
      }

      case 'user.deleted': {
        const data = event.data as ClerkDeletedPayload
        await db.user.deleteMany({ where: { clerkId: data.id } })
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error(`Webhook DB error [${event.type}]:`, err)
  }

  res.status(200).json({ received: true })
})
