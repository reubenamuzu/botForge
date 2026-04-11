export type Tone = 'FRIENDLY' | 'PROFESSIONAL' | 'FORMAL'
export type KnowledgeType = 'FAQ' | 'PDF' | 'URL'
export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'AGENCY'

export interface PlanLimits {
  maxBots: number
  maxMessagesPerMonth: number
  allowPDF: boolean
  allowURL: boolean
  whiteLabel: boolean
}

export interface UsageStats {
  plan: Plan
  botCount: number
  messageCount: number
  limits: PlanLimits
}

export interface Bot {
  id: string
  userId: string
  name: string
  avatar: string | null
  greeting: string
  tone: Tone
  fallbackMsg: string
  isActive: boolean
  createdAt: string
}

export interface KnowledgeItem {
  id: string
  botId: string
  type: KnowledgeType
  question: string | null
  answer: string | null
  sourceUrl: string | null
  rawText: string | null
  createdAt: string
}
