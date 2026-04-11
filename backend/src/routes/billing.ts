import { Router, Request, Response, NextFunction } from 'express'
import { getAuth } from '@clerk/express'
import { clerkAuth } from '../middlewares/auth'
import { db } from '../lib/db'
import { PLAN_LIMITS, type PlanKey } from '../lib/limits'
import axios from 'axios'
import crypto from 'crypto'

export const billingRouter = Router()

const PRICES: Record<string, number> = {
  STARTER: 12000, // GHS 120 in pesewas
  PRO: 30000,     // GHS 300 in pesewas
  AGENCY: 70000,  // GHS 700 in pesewas
}

// GET /api/billing/usage — current plan + usage stats
billingRouter.get('/usage', clerkAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: clerkId } = getAuth(req)
    const user = await db.user.findUnique({
      where: { clerkId: clerkId! },
      include: { _count: { select: { bots: true } } },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const messageCount = await db.message.count({
      where: {
        role: 'USER',
        createdAt: { gte: startOfMonth },
        conversation: { bot: { userId: user.id } },
      },
    })

    res.json({
      plan: user.plan,
      botCount: user._count.bots,
      messageCount,
      limits: PLAN_LIMITS[user.plan as PlanKey],
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/billing/initialize — create Paystack transaction
billingRouter.post('/initialize', clerkAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: clerkId } = getAuth(req)
    const { plan } = req.body as { plan: string }

    if (!['STARTER', 'PRO', 'AGENCY'].includes(plan)) {
      res.status(400).json({ error: 'Invalid plan' })
      return
    }

    const user = await db.user.findUnique({ where: { clerkId: clerkId! } })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:4000'
    const { data } = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: PRICES[plan],
        email: user.email,
        callback_url: `${backendUrl}/api/billing/callback`,
        metadata: { userId: user.id, clerkId: clerkId!, plan },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json({ authorizationUrl: data.data.authorization_url })
  } catch (err) {
    next(err)
  }
})

// GET /api/billing/callback — Paystack redirects here after payment
billingRouter.get('/callback', async (req: Request, res: Response, next: NextFunction) => {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000'
  try {
    const { reference } = req.query as { reference?: string }
    if (!reference) {
      res.redirect(`${frontendUrl}/dashboard/billing?error=missing_reference`)
      return
    }

    const { data } = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    )

    if (data.data.status !== 'success') {
      res.redirect(`${frontendUrl}/dashboard/billing?error=payment_failed`)
      return
    }

    const { userId, plan } = data.data.metadata as { userId: string; plan: string }
    await db.user.update({ where: { id: userId }, data: { plan: plan as PlanKey } })

    res.redirect(`${frontendUrl}/dashboard/billing?success=true`)
  } catch (err) {
    next(err)
  }
})

// POST /api/billing/webhook — called from index.ts with express.raw() body
export async function paystackWebhookHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY ?? ''
    const signature = req.headers['x-paystack-signature'] as string | undefined
    const hash = crypto
      .createHmac('sha512', secret)
      .update(req.body as Buffer)
      .digest('hex')

    if (!signature || hash !== signature) {
      res.sendStatus(401)
      return
    }

    const event = JSON.parse((req.body as Buffer).toString()) as {
      event: string
      data: {
        metadata?: { userId?: string; plan?: string }
        customer?: { email?: string }
      }
    }

    if (event.event === 'charge.success') {
      const { userId, plan } = event.data.metadata ?? {}
      if (userId && plan) {
        await db.user.update({ where: { id: userId }, data: { plan: plan as PlanKey } })
        try {
          const user = await db.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
          if (user) {
            const PRICES_GHS: Record<string, string> = { STARTER: 'GHS 120', PRO: 'GHS 300', AGENCY: 'GHS 700' }
            const { sendPaymentReceiptEmail } = await import('../lib/email')
            await sendPaymentReceiptEmail(user.email, user.name, plan, PRICES_GHS[plan] ?? '')
          }
        } catch (emailErr) {
          console.error('Receipt email failed:', emailErr)
        }
      }
    }

    if (event.event === 'subscription.disable') {
      const email = event.data.customer?.email
      if (email) {
        await db.user.updateMany({ where: { email }, data: { plan: 'FREE' } })
      }
    }

    res.json({ received: true })
  } catch (err) {
    next(err)
  }
}
