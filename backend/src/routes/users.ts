import { Router, Request, Response, NextFunction } from 'express'
import { getAuth, clerkClient } from '@clerk/express'
import { clerkAuth } from '../middlewares/auth'
import { db } from '../lib/db'
import { sendWelcomeEmail, sendReportEmail } from '../lib/email'

export const usersRouter = Router()
usersRouter.use(clerkAuth)

async function resolveUser(clerkUserId: string) {
  const existing = await db.user.findUnique({ where: { clerkId: clerkUserId } })
  if (existing) return existing
  const clerkUser = await clerkClient.users.getUser(clerkUserId)
  const user = await db.user.create({
    data: {
      clerkId: clerkUserId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'User',
    },
  })
  sendWelcomeEmail(user.email, user.name).catch(() => {})
  return user
}

// GET /api/users/me
usersRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      onboardingDone: user.onboardingDone,
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/users/me/onboarding — mark onboarding complete
usersRouter.patch('/me/onboarding', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)
    await db.user.update({ where: { id: user.id }, data: { onboardingDone: true } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// POST /api/users/me/report
usersRouter.post('/me/report', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)

    const { category, subject, description, screenshotBase64, screenshotName } = req.body as {
      category?: string
      subject?: string
      description?: string
      screenshotBase64?: string
      screenshotName?: string
    }

    if (!category || !subject || !description) {
      res.status(400).json({ error: 'category, subject, and description are required' })
      return
    }

    await sendReportEmail(user.name, user.email, category, subject, description, screenshotBase64, screenshotName)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/users/me — soft-delete (30-day grace period)
usersRouter.delete('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req)
    const user = await resolveUser(userId!)
    await db.user.update({ where: { id: user.id }, data: { deletedAt: new Date() } })
    res.json({ ok: true, deletedAt: new Date(), message: 'Account scheduled for deletion in 30 days.' })
  } catch (err) {
    next(err)
  }
})
