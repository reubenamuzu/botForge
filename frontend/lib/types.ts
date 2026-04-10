export type Tone = 'FRIENDLY' | 'PROFESSIONAL' | 'FORMAL'
export type KnowledgeType = 'FAQ' | 'PDF' | 'URL'

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
