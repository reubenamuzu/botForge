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
  widgetColor: string
  widgetPosition: 'bottom-right' | 'bottom-left'
  leadCapture: boolean
  createdAt: string
  conversationCount: number
  lastActiveAt: string | null
}

export interface LeadItem {
  id: string
  sessionId: string
  leadName: string | null
  leadEmail: string
  createdAt: string
  messageCount: number
}

export interface LeadListResponse {
  items: LeadItem[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface CurrentUser {
  id: string
  email: string
  name: string
  plan: Plan
  onboardingDone: boolean
}

export interface AnalyticsSummary {
  totalConversations: number
  totalMessages: number
  messagesThisMonth: number
  avgMessagesPerConversation: number
  topQuestions: { content: string; count: number }[]
  unansweredCount: number
  dailyMessages: { date: string; count: number }[]
}

export interface ConversationItem {
  id: string
  sessionId: string
  createdAt: string
  messageCount: number
  lastMessage: string
}

export interface ConversationListResponse {
  items: ConversationItem[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface ConversationMessage {
  role: 'USER' | 'BOT'
  content: string
  createdAt: string
}

export interface ConversationDetail {
  conversation: { id: string; sessionId: string; createdAt: string }
  messages: ConversationMessage[]
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
