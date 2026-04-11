import { db } from './db'

export type PlanKey = 'FREE' | 'STARTER' | 'PRO' | 'AGENCY'

export const PLAN_LIMITS: Record<
  PlanKey,
  {
    maxBots: number
    maxMessagesPerMonth: number
    allowPDF: boolean
    allowURL: boolean
    whiteLabel: boolean
  }
> = {
  FREE:    { maxBots: 1,        maxMessagesPerMonth: 50,    allowPDF: false, allowURL: false, whiteLabel: false },
  STARTER: { maxBots: 2,        maxMessagesPerMonth: 1000,  allowPDF: true,  allowURL: true,  whiteLabel: false },
  PRO:     { maxBots: 5,        maxMessagesPerMonth: 5000,  allowPDF: true,  allowURL: true,  whiteLabel: false },
  AGENCY:  { maxBots: Infinity, maxMessagesPerMonth: 20000, allowPDF: true,  allowURL: true,  whiteLabel: true  },
}

export class LimitError extends Error {
  readonly statusCode = 403
  readonly code = 'LIMIT_EXCEEDED'
  constructor(message: string) {
    super(message)
    this.name = 'LimitError'
  }
}

export async function checkBotLimit(userId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { bots: true } } },
  })
  if (!user) throw new Error('User not found')

  const limits = PLAN_LIMITS[user.plan as PlanKey]
  if (user._count.bots >= limits.maxBots) {
    const cap = limits.maxBots === Infinity ? 'unlimited' : `${limits.maxBots}`
    throw new LimitError(
      `Your ${user.plan} plan allows ${cap} bot${limits.maxBots === 1 ? '' : 's'}. Upgrade to create more.`
    )
  }
}

export async function checkMessageLimit(userId: string): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const limits = PLAN_LIMITS[user.plan as PlanKey]
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  const count = await db.message.count({
    where: {
      role: 'USER',
      createdAt: { gte: startOfMonth },
      conversation: { bot: { userId } },
    },
  })

  if (count >= limits.maxMessagesPerMonth) {
    throw new LimitError(
      `You've reached your ${limits.maxMessagesPerMonth.toLocaleString()} message limit for this month. Upgrade to continue.`
    )
  }
}

export async function checkSourceAllowed(userId: string, type: string): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const limits = PLAN_LIMITS[user.plan as PlanKey]

  if (type === 'PDF' && !limits.allowPDF) {
    throw new LimitError('PDF sources require the STARTER plan or higher. Upgrade to continue.')
  }
  if (type === 'URL' && !limits.allowURL) {
    throw new LimitError('URL sources require the STARTER plan or higher. Upgrade to continue.')
  }
}
