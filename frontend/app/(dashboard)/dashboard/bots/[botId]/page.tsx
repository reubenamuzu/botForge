'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Code2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot, KnowledgeItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigureTab } from './_components/ConfigureTab'
import { KnowledgeBaseTab } from './_components/KnowledgeBaseTab'

export default function BotDetailPage() {
  const { botId } = useParams<{ botId: string }>()
  const { getToken } = useAuth()
  const router = useRouter()
  const [bot, setBot] = useState<Bot | null>(null)
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [botRes, knowledgeRes] = await Promise.all([
        api.get<Bot>(`/bots/${botId}`, { headers }),
        api.get<KnowledgeItem[]>(`/bots/${botId}/knowledge`, { headers }),
      ])
      setBot(botRes.data)
      setKnowledge(knowledgeRes.data)
    } catch {
      toast.error('Failed to load bot')
      router.push('/dashboard/bots')
    } finally {
      setLoading(false)
    }
  }, [botId, getToken, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (!bot) return null

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/bots">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          {bot.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-xl font-semibold text-gray-900">{bot.name}</h1>
      </div>

      <Tabs defaultValue="configure">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/dashboard/bots/${botId}/embed`}>
              <Code2 className="h-3.5 w-3.5" />
              Embed
            </Link>
          </Button>
        </div>
        <TabsContent value="configure" className="mt-6">
          <ConfigureTab bot={bot} onSaved={setBot} />
        </TabsContent>
        <TabsContent value="knowledge" className="mt-6">
          <KnowledgeBaseTab botId={botId} items={knowledge} onItemsChanged={setKnowledge} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
